// src/lib/claude/client.ts

import Anthropic from '@anthropic-ai/sdk'
import type { ScriptGenerationRequest, GeneratedScript, SocialPlatform } from '../../types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const MODEL = 'claude-sonnet-4-20250514'

// ─── Script Generation ────────────────────────────────────────────────────────

export async function generateVideoScript(
  req: ScriptGenerationRequest
): Promise<GeneratedScript> {
  const platformContext = getPlatformContext(req.platform)

  const prompt = `You are an expert social media content strategist and scriptwriter.

Generate a compelling video script for ${req.platform} with these specifications:
- Topic: ${req.topic}
- Target duration: ${req.duration} seconds
- Tone: ${req.tone}
${req.audience ? `- Target audience: ${req.audience}` : ''}
${req.brandVoice ? `- Brand voice: ${req.brandVoice}` : ''}
${req.keywords?.length ? `- Keywords to include: ${req.keywords.join(', ')}` : ''}

Platform context: ${platformContext}

Return ONLY valid JSON with this exact structure:
{
  "title": "Video title (max 100 chars)",
  "hook": "Opening 3-5 seconds that grabs attention immediately",
  "body": "Main content script with [PAUSE] markers and [B-ROLL: description] notes",
  "callToAction": "Closing CTA for ${req.platform}",
  "hashtags": ["array", "of", "relevant", "hashtags", "no", "hash", "symbol"],
  "visualPrompt": "Detailed fal.ai image generation prompt matching the video style",
  "estimatedDuration": ${req.duration}
}`

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  try {
    const cleaned = content.text.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleaned) as GeneratedScript
  } catch {
    throw new Error('Failed to parse Claude script response')
  }
}

// ─── Prompt Enhancement ───────────────────────────────────────────────────────

export async function enhanceImagePrompt(
  basicPrompt: string,
  style?: string,
  platform?: SocialPlatform
): Promise<string> {
  const platformHints: Record<string, string> = {
    instagram: 'visually striking, high contrast, Instagram-aesthetic, lifestyle photography style',
    youtube: 'thumbnail-worthy, bold colors, clear focal point, clickable visual',
    tiktok: 'vertical format, vibrant, trendy, Gen-Z aesthetic',
    twitter: 'clean, clear, information-dense, professional',
    linkedin: 'professional, corporate-aesthetic, clean backgrounds',
    facebook: 'warm, relatable, community-focused visual',
  }

  const hint = platform ? platformHints[platform] ?? '' : ''

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Transform this basic image description into a detailed, high-quality fal.ai / Stable Diffusion prompt.

Basic description: "${basicPrompt}"
${style ? `Style preference: ${style}` : ''}
${hint ? `Platform context: ${hint}` : ''}

Rules:
- Add technical photography/art direction details
- Include lighting, composition, camera settings
- Add quality boosters (8K, photorealistic, sharp details etc.)
- Keep under 200 words
- Return ONLY the enhanced prompt, nothing else`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response from Claude')
  return content.text.trim()
}

// ─── Caption Generation ───────────────────────────────────────────────────────

export async function generateCaption(
  contentDescription: string,
  platform: SocialPlatform,
  brandVoice?: string
): Promise<{ caption: string; hashtags: string[] }> {
  const platformLimits: Record<string, number> = {
    instagram: 2200,
    twitter: 280,
    linkedin: 3000,
    tiktok: 2200,
    youtube: 5000,
    facebook: 63206,
  }

  const limit = platformLimits[platform] ?? 2200

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: `Write an engaging ${platform} caption for this content:

"${contentDescription}"

${brandVoice ? `Brand voice: ${brandVoice}` : ''}
Character limit: ${limit}
Platform: ${platform}

Return ONLY valid JSON:
{
  "caption": "The caption text without hashtags",
  "hashtags": ["hashtag1", "hashtag2"]
}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response from Claude')

  try {
    const cleaned = content.text.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { caption: contentDescription, hashtags: [] }
  }
}

// ─── Content Ideas ────────────────────────────────────────────────────────────

export async function generateContentIdeas(params: {
  niche: string
  platform: SocialPlatform
  count?: number
}): Promise<Array<{ title: string; hook: string; visualConcept: string }>> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Generate ${params.count ?? 5} viral content ideas for ${params.platform} in the ${params.niche} niche.

Return ONLY valid JSON array:
[
  {
    "title": "Content title",
    "hook": "Opening hook that stops the scroll",
    "visualConcept": "Brief visual description for AI image/video generation"
  }
]`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response from Claude')

  try {
    const cleaned = content.text.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return []
  }
}

// ─── Streaming Script Generation ─────────────────────────────────────────────

export async function* generateVideoScriptStream(
  req: ScriptGenerationRequest
): AsyncGenerator<string> {
  const stream = await anthropic.messages.stream({
    model: MODEL,
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `Write a ${req.duration}-second ${req.tone} video script about "${req.topic}" for ${req.platform}.
Format it as a ready-to-read teleprompter script with clear sections: HOOK, MAIN CONTENT, and CTA.`,
      },
    ],
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPlatformContext(platform: SocialPlatform): string {
  const contexts: Record<SocialPlatform, string> = {
    youtube: 'YouTube videos: hook in first 30s, chapters, SEO-friendly, 8-15 minute sweet spot for monetization',
    instagram: 'Instagram Reels: fast-paced, visual, trending audio, 15-30 seconds optimal',
    twitter: 'X/Twitter: concise, punchy, conversation-starter, under 60 seconds',
    tiktok: 'TikTok: trend-aware, authentic, quick cuts, 15-60 seconds, starts mid-action',
    linkedin: 'LinkedIn: professional, value-driven, thought leadership, storytelling format',
    facebook: 'Facebook: community-focused, emotional, shareable, 1-3 minutes optimal',
  }
  return contexts[platform] ?? 'Social media video, engaging and platform-optimized'
}