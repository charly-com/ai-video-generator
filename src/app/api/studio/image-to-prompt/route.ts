import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { imageBase64, mediaType = 'image/jpeg' } = body

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            {
              type: 'text',
              text: `Analyze this image and write a detailed AI video generation prompt that would recreate its visual style, mood, lighting, composition, and aesthetic.

Write ONLY the prompt — no explanation, no preamble. Make it rich, cinematic, and specific. Include:
- Subject/scene description
- Lighting style
- Color palette and mood
- Camera angle and movement
- Visual aesthetic (documentary, cinematic, editorial, etc.)
- Any distinctive details

Keep it under 150 words and make it perfect for generating a matching AI video.`,
            },
          ],
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response')

    return NextResponse.json({ success: true, data: { prompt: content.text.trim() } })
  } catch (error) {
    console.error('[image-to-prompt] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to analyse image' }, { status: 500 })
  }
}
