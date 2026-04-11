// src/app/api/publish/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { publishToplatform } from '@/lib/social/publishers'
import { generateCaption } from '@/lib/claude/claude'
import { z } from 'zod'
import type { ApiResponse, SocialAccount, SocialPlatform } from '@/types'

const PublishSchema = z.object({
  contentId: z.string().cuid(),
  socialAccountIds: z.array(z.string().cuid()).min(1).max(10),
  caption: z.string().max(5000).optional(),
  hashtags: z.array(z.string()).max(30).optional(),
  scheduledFor: z.string().datetime().optional(),
  generateCaption: z.boolean().optional(),
  youtubeOptions: z
    .object({
      title: z.string().max(100),
      description: z.string().max(5000),
      tags: z.array(z.string()).max(50),
      categoryId: z.string().optional(),
      privacyStatus: z.enum(['public', 'private', 'unlisted']),
    })
    .optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await req.json()

    const parsed = PublishSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Verify content belongs to user
    const content = await prisma.generatedContent.findFirst({
      where: { id: data.contentId, userId, status: 'ready' },
    })

    if (!content) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Content not found or not ready' },
        { status: 404 }
      )
    }

    // Verify all social accounts belong to user
    const accounts = await prisma.socialAccount.findMany({
      where: { id: { in: data.socialAccountIds }, userId, isActive: true },
    })

    if (accounts.length !== data.socialAccountIds.length) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'One or more social accounts not found' },
        { status: 404 }
      )
    }

    // Auto-generate caption if requested
    let caption = data.caption
    if (data.generateCaption && !caption && content.fileUrl) {
      const platform = accounts[0].platform as SocialPlatform
      const generated = await generateCaption(content.prompt, platform)
      caption = `${generated.caption}\n\n${generated.hashtags.map(h => `#${h}`).join(' ')}`
    }

    // Create publish jobs for each account
    const scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : undefined
    const isScheduled = scheduledFor && scheduledFor > new Date()

    const jobs = await prisma.$transaction(
      accounts.map((account: { id: any; platform: string }) =>
        prisma.publishJob.create({
          data: {
            userId,
            contentId: data.contentId,
            socialAccountId: account.id,
            status: isScheduled ? 'scheduled' : 'pending',
            scheduledFor,
            caption,
            hashtags: data.hashtags ?? [],
            options: account.platform === 'youtube' ? data.youtubeOptions : undefined,
          },
        })
      )
    )

    // If not scheduled, publish immediately
    const results: Array<{ jobId: string; status: string; url?: string; error?: string }> = []

    if (!isScheduled) {
      for (const job of jobs) {
        const account = accounts.find((a: { id: any }) => a.id === job.socialAccountId)!

        try {
          await prisma.publishJob.update({
            where: { id: job.id },
            data: { status: 'publishing' },
          })

          const result = await publishToplatform(account.platform as SocialPlatform, account as unknown as SocialAccount, {
            caption: caption ?? content.prompt,
            mediaUrl: content.fileUrl!,
            mediaType: content.type === 'video' ? 'video' : 'image',
            options:
              account.platform === 'youtube'
                ? { ...data.youtubeOptions, videoUrl: content.fileUrl }
                : undefined,
          })

          await prisma.publishJob.update({
            where: { id: job.id },
            data: {
              status: 'published',
              publishedAt: new Date(),
              platformPostId: result.platformPostId,
            },
          })

          // Mark content as published
          await prisma.generatedContent.update({
            where: { id: data.contentId },
            data: { status: 'published' },
          })

          results.push({ jobId: job.id, status: 'published', url: result.url })
        } catch (error) {
          const errorMessage = String(error)

          await prisma.publishJob.update({
            where: { id: job.id },
            data: {
              status: 'failed',
              errorMessage,
              retryCount: { increment: 1 },
            },
          })

          results.push({ jobId: job.id, status: 'failed', error: errorMessage })
        }
      }
    } else {
      results.push(...jobs.map((j: { id: any }) => ({ jobId: j.id, status: 'scheduled' })))
    }

    return NextResponse.json<ApiResponse<typeof results>>({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('[publish] Error:', error)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Publish failed', details: String(error) },
      { status: 500 }
    )
  }
}

// ─── Get publish queue ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const where = {
    userId: session.user.id,
    ...(status ? { status } : {}),
  }

  const [jobs, total] = await Promise.all([
    prisma.publishJob.findMany({
      where,
      include: {
        content: { select: { type: true, fileUrl: true, thumbnailUrl: true, prompt: true } },
        socialAccount: { select: { platform: true, username: true, profileImageUrl: true } },
      },
      orderBy: [{ scheduledFor: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.publishJob.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      items: jobs,
      total,
      page,
      pageSize: limit,
      hasMore: page * limit < total,
    },
  })
}
