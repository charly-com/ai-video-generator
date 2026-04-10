// src/app/api/script/generate/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { generateVideoScript, enhanceImagePrompt, generateContentIdeas, generateVideoScriptStream } from '@/lib/claude/claude'
import { z } from 'zod'
import type { ApiResponse } from '@/types'

const ScriptSchema = z.object({
  action: z.enum(['script', 'enhance-prompt', 'ideas', 'stream-script']),
  topic: z.string().min(3).max(500).optional(),
  platform: z.enum(['youtube', 'instagram', 'twitter', 'tiktok', 'linkedin', 'facebook']),
  duration: z.number().min(5).max(600).optional(),
  tone: z.enum(['professional', 'casual', 'humorous', 'inspirational', 'educational']).optional(),
  audience: z.string().max(200).optional(),
  brandVoice: z.string().max(200).optional(),
  keywords: z.array(z.string()).max(10).optional(),
  // Enhance prompt
  prompt: z.string().min(3).max(1000).optional(),
  style: z.string().optional(),
  // Ideas
  niche: z.string().max(200).optional(),
  count: z.number().min(1).max(10).optional(),
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

    const body = await req.json()
    const parsed = ScriptSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    switch (data.action) {
      case 'script': {
        if (!data.topic) throw new Error('topic required for script generation')
        const script = await generateVideoScript({
          topic: data.topic,
          platform: data.platform,
          duration: data.duration ?? 60,
          tone: data.tone ?? 'casual',
          audience: data.audience,
          brandVoice: data.brandVoice,
          keywords: data.keywords,
        })
        return NextResponse.json<ApiResponse<typeof script>>({ success: true, data: script })
      }

      case 'enhance-prompt': {
        if (!data.prompt) throw new Error('prompt required for enhance')
        const enhanced = await enhanceImagePrompt(data.prompt, data.style, data.platform)
        return NextResponse.json<ApiResponse<{ enhanced: string }>>({
          success: true,
          data: { enhanced },
        })
      }

      case 'ideas': {
        if (!data.niche) throw new Error('niche required for ideas')
        const ideas = await generateContentIdeas({
          niche: data.niche,
          platform: data.platform,
          count: data.count ?? 5,
        })
        return NextResponse.json<ApiResponse<typeof ideas>>({ success: true, data: ideas })
      }

      default:
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('[script/generate] Error:', error)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Script generation failed', details: String(error) },
      { status: 500 }
    )
  }
}

// ─── Streaming endpoint for real-time script generation ───────────────────────

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const topic = searchParams.get('topic')
  const platform = searchParams.get('platform') as 'youtube' | 'instagram' | 'twitter' | 'tiktok' | 'linkedin' | 'facebook'
  const duration = parseInt(searchParams.get('duration') ?? '60')
  const tone = (searchParams.get('tone') ?? 'casual') as 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational'

  if (!topic || !platform) {
    return new Response('topic and platform required', { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const generator = generateVideoScriptStream({ topic, platform, duration, tone })
        for await (const chunk of generator) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
