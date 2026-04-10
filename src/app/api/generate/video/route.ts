// src/app/api/generate/video/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { generateVideo } from '@/lib/fal/client'
import { z } from 'zod'
import type { GenerateVideoRequest, ApiResponse } from '@/types'
import { PRICING_TIERS } from '@/types'

const GenerateVideoSchema = z.object({
  prompt: z.string().min(10).max(2000),
  model: z.string(),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5', '4:3', '3:4']),
  duration: z.number().min(3).max(15),
  imageUrl: z.string().url().optional(),
  negativePrompt: z.string().max(500).optional(),
  seed: z.number().optional(),
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

    // Validate input
    const parsed = GenerateVideoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Check usage limits
    const limitCheck = await checkVideoLimit(userId)
    if (!limitCheck.allowed) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: limitCheck.reason },
        { status: 429 }
      )
    }

    // Check model access by plan
    const planCheck = await checkModelAccess(userId, data.model)
    if (!planCheck.allowed) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: planCheck.reason },
        { status: 403 }
      )
    }

    // Create pending content record
    const content = await prisma.generatedContent.create({
      data: {
        userId,
        type: 'video',
        status: 'generating',
        prompt: data.prompt,
        model: data.model,
        aspectRatio: data.aspectRatio,
        metadata: {
          duration: data.duration,
          imageUrl: data.imageUrl,
          negativePrompt: data.negativePrompt,
          seed: data.seed,
        },
      },
    })

    // Increment usage immediately to prevent race conditions
    await incrementVideoUsage(userId)

    // Start generation (non-blocking for queue approach, blocking here for simplicity)
    try {
      const result = await generateVideo(data as GenerateVideoRequest)

      // Update content with result
      const updated = await prisma.generatedContent.update({
        where: { id: content.id },
        data: {
          status: 'ready',
          fileUrl: result.fileUrl,
          falRequestId: result.falRequestId,
        },
      })

      return NextResponse.json<ApiResponse<typeof updated>>({
        success: true,
        data: updated,
      })
    } catch (genError) {
      // Rollback usage on generation failure
      await decrementVideoUsage(userId)

      await prisma.generatedContent.update({
        where: { id: content.id },
        data: { status: 'failed', metadata: { error: String(genError) } },
      })

      throw genError
    }
  } catch (error) {
    console.error('[generate/video] Error:', error)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Video generation failed', details: String(error) },
      { status: 500 }
    )
  }
}

// ─── Limit Helpers ────────────────────────────────────────────────────────────

async function checkVideoLimit(
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const [subscription, usage] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.usageRecord.findFirst({
      where: { userId, periodEnd: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const plan = subscription?.plan ?? 'free'
  const tier = PRICING_TIERS.find(t => t.name === plan)
  const limit = tier?.limits.videosPerMonth

  if (limit === null) return { allowed: true } // unlimited

  const used = usage?.videosUsed ?? 0
  if (used >= (limit ?? 10)) {
    return {
      allowed: false,
      reason: `You've used all ${limit} videos for this period. Upgrade to generate more.`,
    }
  }

  return { allowed: true }
}

async function checkModelAccess(
  userId: string,
  model: string
): Promise<{ allowed: boolean; reason?: string }> {
  const proOnlyModels = ['wan-pro', 'luma-dream-machine']
  const basicModels = ['kling-video-v2-master']

  const subscription = await prisma.subscription.findUnique({ where: { userId } })
  const plan = subscription?.plan ?? 'free'

  if (proOnlyModels.includes(model) && !['pro', 'agency'].includes(plan)) {
    return { allowed: false, reason: `${model} requires a Pro plan or higher.` }
  }

  if (basicModels.includes(model) && plan === 'free') {
    return { allowed: false, reason: `${model} requires a Basic plan or higher.` }
  }

  return { allowed: true }
}

async function incrementVideoUsage(userId: string) {
  const now = new Date()
  const record = await prisma.usageRecord.findFirst({
    where: { userId, periodEnd: { gte: now } },
    orderBy: { createdAt: 'desc' },
  })

  if (record) {
    await prisma.usageRecord.update({
      where: { id: record.id },
      data: { videosUsed: { increment: 1 } },
    })
  }
}

async function decrementVideoUsage(userId: string) {
  const now = new Date()
  const record = await prisma.usageRecord.findFirst({
    where: { userId, periodEnd: { gte: now } },
    orderBy: { createdAt: 'desc' },
  })

  if (record && record.videosUsed > 0) {
    await prisma.usageRecord.update({
      where: { id: record.id },
      data: { videosUsed: { decrement: 1 } },
    })
  }
}
