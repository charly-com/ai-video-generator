// src/app/api/ai/generate-script/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import type { ApiResponse } from '@/types'

const client = new Anthropic()

const GenerateScriptSchema = z.object({
  topic: z.string().min(5).max(1000),
  audience: z.string().max(300).optional(),
  platform: z.enum(['tiktok', 'instagram', 'youtube', 'x', 'linkedin']),
  format: z.enum(['hook', 'script', 'caption', 'thread', 'description']),
  tone: z.enum(['Casual', 'Professional', 'Humorous', 'Educational', 'Inspirational', 'Bold']),
})

const PLATFORM_CONTEXT: Record<string, string> = {
  tiktok: 'TikTok (short-form vertical video, fast-paced, trending sounds, Gen Z/Millennial audience)',
  instagram: 'Instagram (Reels + feed posts, aesthetic-driven, lifestyle & brand content)',
  youtube: 'YouTube (longer-form video, searchable, strong retention hooks)',
  x: 'X / Twitter (concise, punchy, threads perform well, professional discourse)',
  linkedin: 'LinkedIn (professional network, thought leadership, business value)',
}

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  hook: 'Write ONLY the first 3-5 seconds hook. Make it stop-scroll worthy. Include the exact words to say on camera.',
  script: 'Write a complete video script with: [HOOK] opening, [BODY] main content with scene directions, [CTA] call-to-action. Include on-screen text suggestions in [brackets].',
  caption: 'Write a compelling post caption (2-3 short paragraphs max) followed by 15-20 relevant hashtags. Start with a strong first line.',
  thread: 'Write a numbered thread (5-8 posts). Each post must be punchy and standalone. Start with a hook post (1/). End with a CTA.',
  description: 'Write a SEO-optimised video description: opening paragraph (hook + keyword-rich), timestamps section, relevant links section (use placeholders), hashtags. Max 400 words.',
}

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
    const parsed = GenerateScriptSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { topic, audience, platform, format, tone } = parsed.data

    const systemPrompt = `You are an expert social media content strategist and viral copywriter specialising in African markets, particularly Nigeria and West Africa. You write content that resonates with Nigerian and African audiences while also having global appeal. You understand Afrobeats culture, Nigerian entrepreneur culture, and African fashion/lifestyle content.`

    const userPrompt = `Create a ${tone.toLowerCase()} ${format} for ${PLATFORM_CONTEXT[platform]}.

Topic/Product: ${topic}${audience ? `\nTarget Audience: ${audience}` : ''}

Instructions: ${FORMAT_INSTRUCTIONS[format]}

Tone: ${tone}

Write only the final content — no preamble, no explanations, no meta-commentary. Just the script/content itself.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const script = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('')

    return NextResponse.json<ApiResponse<{ script: string }>>({
      success: true,
      data: { script },
    })
  } catch (error) {
    console.error('[generate-script] Error:', error)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'Script generation failed', details: String(error) },
      { status: 500 }
    )
  }
}
