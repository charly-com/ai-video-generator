// src/app/api/generate/image/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { generateImage, editImage, upscaleImage, removeBackground } from '@/lib/fal/client'
import { z } from 'zod'
import type { ApiResponse } from '@/types'
import { PRICING_TIERS } from '@/types'

const GenerateImageSchema = z.object({
  action: z.enum(['generate', 'edit', 'upscale', 'remove-bg']),
  prompt: z.string().min(5).max(2000).optional(),
  model: z.string().optional(),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5', '4:3', '3:4']).optional(),
  numImages: z.number().min(1).max(4).optional(),
  seed: z.number().optional(),
  negativePrompt: z.string().max(500).optional(),
  guidanceScale: z.number().min(1).max(20).optional(),
  style: z.string().optional(),
  // Edit-specific
  imageUrl: z.string().url().optional(),
  mask: z.string().optional(),
  strength: z.number().min(0).max(1).optional(),
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

    const parsed = GenerateImageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Check usage limits (except for upscale/remove-bg which are free operations)
    if (data.action === 'generate') {
      const limitCheck = await checkImageLimit(userId)
      if (!limitCheck.allowed) {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: limitCheck.reason },
          { status: 429 }
        )
      }
    }

    // Create pending record
    const content = await prisma.generatedContent.create({
      data: {
        userId,
        type: data.action === 'generate' ? 'image' : 'image_edit',
        status: 'generating',
        prompt: data.prompt ?? 'Image edit/transform',
        model: data.model ?? 'flux-pro-ultra',
        aspectRatio: data.aspectRatio ?? '1:1',
      },
    })

    try {
      let result: { imageUrl?: string; images?: Array<{ url: string; width: number; height: number }>; falRequestId: string }

      switch (data.action) {
        case 'generate': {
          if (!data.prompt || !data.model || !data.aspectRatio) {
            throw new Error('prompt, model, and aspectRatio required for generate')
          }
          result = await generateImage({
            prompt: data.prompt,
            model: data.model,
            aspectRatio: data.aspectRatio,
            numImages: data.numImages,
            seed: data.seed,
            negativePrompt: data.negativePrompt,
            guidanceScale: data.guidanceScale,
            style: data.style,
          })
          await incrementImageUsage(userId)
          break
        }

        case 'edit': {
          if (!data.imageUrl || !data.prompt) {
            throw new Error('imageUrl and prompt required for edit')
          }
          result = await editImage({
            imageUrl: data.imageUrl,
            prompt: data.prompt,
            model: data.model ?? 'flux-inpainting',
            mask: data.mask,
            strength: data.strength,
          })
          break
        }

        case 'upscale': {
          if (!data.imageUrl) throw new Error('imageUrl required for upscale')
          result = await upscaleImage(data.imageUrl)
          break
        }

        case 'remove-bg': {
          if (!data.imageUrl) throw new Error('imageUrl required for remove-bg')
          result = await removeBackground(data.imageUrl)
          break
        }
      }

      const fileUrl = result.imageUrl ?? result.images?.[0]?.url
      const width = result.images?.[0]?.width
      const height = result.images?.[0]?.height

      const updated = await prisma.generatedContent.update({
        where: { id: content.id },
        data: {
          status: 'ready',
          fileUrl,
          width,
          height,
          falRequestId: result.falRequestId,
          metadata: {
            allImages: result.images,
            seed: data.seed,
          },
        },
      })

      return NextResponse.json<ApiResponse<typeof updated>>({
        success: true,
        data: updated,
      })
    } catch (genError) {
      await prisma.generatedContent.update({
        where: { id: content.id },
        data: { status: 'failed', metadata: { error: String(genError) } },
      })
      throw genError
    }
  } catch (error) {
    console.error('[generate/image] Error:', error)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Image generation failed', details: String(error) },
      { status: 500 }
    )
  }
}

async function checkImageLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const [subscription, usage] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.usageRecord.findFirst({
      where: { userId, periodEnd: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const plan = subscription?.plan ?? 'free'
  const tier = PRICING_TIERS.find(t => t.name === plan)
  const limit = tier?.limits.imagesPerMonth

  if (limit === null) return { allowed: true }

  const used = usage?.imagesUsed ?? 0
  if (used >= (limit ?? 50)) {
    return {
      allowed: false,
      reason: `You've used all ${limit} images for this period. Upgrade to generate more.`,
    }
  }

  return { allowed: true }
}

async function incrementImageUsage(userId: string) {
  const now = new Date()
  const record = await prisma.usageRecord.findFirst({
    where: { userId, periodEnd: { gte: now } },
    orderBy: { createdAt: 'desc' },
  })

  if (record) {
    await prisma.usageRecord.update({
      where: { id: record.id },
      data: { imagesUsed: { increment: 1 } },
    })
  }
}
