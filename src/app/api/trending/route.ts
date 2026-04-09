// src/app/api/trending/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import Anthropic from '@anthropic-ai/sdk'
import type { SocialPlatform } from '../../../../types/index';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// Cache trending data for 4 hours to avoid hitting Claude too often
const trendingCache = new Map<string, { data: unknown; expiresAt: number }>()

function getCached(key: string) {
  const cached = trendingCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.data
  return null
}

function setCache(key: string, data: unknown) {
  trendingCache.set(key, { data, expiresAt: Date.now() + 4 * 60 * 60 * 1000 })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'hashtags'
  const platform = (searchParams.get('platform') ?? 'tiktok') as SocialPlatform
  const niche = searchParams.get('niche') ?? 'general'

  const cacheKey = `${type}:${platform}:${niche}`
  const cached = getCached(cacheKey)
  if (cached) return NextResponse.json({ success: true, data: cached, cached: true })

  try {
    let data: unknown

    switch (type) {
      case 'hashtags':
        data = await getTrendingHashtags(platform, niche)
        break
      case 'topics':
        data = await getTrendingTopics(platform, niche)
        break
      case 'hooks':
        data = await getTrendingHooks(platform, niche)
        break
      case 'optimal-times':
        data = getOptimalPostingTimes(platform)
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    setCache(cacheKey, data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[trending] Error:', error)
    return NextResponse.json({ error: 'Failed to get trending data' }, { status: 500 })
  }
}

async function getTrendingHashtags(platform: SocialPlatform, niche: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Generate 20 currently trending and high-performing hashtags for ${platform} in the ${niche} niche.
Include a mix of: mega (100M+), macro (10M-100M), mid (1M-10M), micro (100K-1M) hashtags.
Return ONLY valid JSON array:
[{"tag": "hashtag", "category": "mega|macro|mid|micro", "estimatedReach": "100M+", "trending": true}]`,
    }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())
}

async function getTrendingTopics(platform: SocialPlatform, niche: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `Generate 10 trending content topics/formats that are performing well on ${platform} for the ${niche} niche right now.
Return ONLY valid JSON array:
[{"topic": "topic name", "format": "video|image|reel|short", "difficulty": "easy|medium|hard", "virality": "high|medium|low", "hook": "example opening hook", "whyTrending": "brief reason"}]`,
    }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())
}

async function getTrendingHooks(platform: SocialPlatform, niche: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `Generate 15 high-converting viral hook formulas for ${platform} content in the ${niche} niche.
These should be the first 3-7 words that stop the scroll.
Return ONLY valid JSON array:
[{"hook": "example hook text", "type": "curiosity|shock|relatability|controversy|value", "fillIn": "{placeholder} to customize", "platform": "${platform}"}]`,
    }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())
}

function getOptimalPostingTimes(platform: SocialPlatform): Record<string, string[]> {
  // Based on research for Nigerian/West African timezone (WAT = UTC+1)
  const times: Record<SocialPlatform, Record<string, string[]>> = {
    tiktok: {
      monday:    ['6:00 AM', '10:00 AM', '7:00 PM', '10:00 PM'],
      tuesday:   ['7:00 AM', '9:00 AM', '8:00 PM', '11:00 PM'],
      wednesday: ['8:00 AM', '11:00 AM', '7:00 PM', '9:00 PM'],
      thursday:  ['9:00 AM', '12:00 PM', '8:00 PM', '10:00 PM'],
      friday:    ['5:00 AM', '1:00 PM', '3:00 PM', '9:00 PM'],
      saturday:  ['9:00 AM', '11:00 AM', '7:00 PM', '11:00 PM'],
      sunday:    ['7:00 AM', '8:00 AM', '4:00 PM', '9:00 PM'],
    },
    instagram: {
      monday:    ['6:00 AM', '12:00 PM', '9:00 PM'],
      tuesday:   ['8:00 AM', '12:00 PM', '9:00 PM'],
      wednesday: ['9:00 AM', '11:00 AM', '8:00 PM'],
      thursday:  ['8:00 AM', '12:00 PM', '9:00 PM'],
      friday:    ['7:00 AM', '2:00 PM', '8:00 PM'],
      saturday:  ['9:00 AM', '11:00 AM', '6:00 PM'],
      sunday:    ['10:00 AM', '2:00 PM', '8:00 PM'],
    },
    youtube: {
      monday:    ['2:00 PM', '5:00 PM'],
      tuesday:   ['2:00 PM', '5:00 PM'],
      wednesday: ['2:00 PM', '5:00 PM'],
      thursday:  ['12:00 PM', '3:00 PM'],
      friday:    ['12:00 PM', '4:00 PM'],
      saturday:  ['9:00 AM', '11:00 AM'],
      sunday:    ['9:00 AM', '11:00 AM'],
    },
    twitter: {
      monday:    ['8:00 AM', '12:00 PM', '5:00 PM', '9:00 PM'],
      tuesday:   ['9:00 AM', '12:00 PM', '5:00 PM'],
      wednesday: ['9:00 AM', '12:00 PM', '5:00 PM'],
      thursday:  ['9:00 AM', '12:00 PM', '5:00 PM'],
      friday:    ['9:00 AM', '12:00 PM', '3:00 PM'],
      saturday:  ['11:00 AM', '1:00 PM'],
      sunday:    ['12:00 PM', '4:00 PM'],
    },
    linkedin: {
      monday:    ['7:30 AM', '12:00 PM'],
      tuesday:   ['7:30 AM', '12:00 PM', '5:00 PM'],
      wednesday: ['7:30 AM', '12:00 PM', '5:00 PM'],
      thursday:  ['7:30 AM', '12:00 PM'],
      friday:    ['7:30 AM', '12:00 PM'],
      saturday:  ['10:00 AM'],
      sunday:    ['10:00 AM'],
    },
    facebook: {
      monday:    ['9:00 AM', '12:00 PM', '5:00 PM'],
      tuesday:   ['9:00 AM', '12:00 PM', '5:00 PM'],
      wednesday: ['9:00 AM', '12:00 PM', '5:00 PM'],
      thursday:  ['9:00 AM', '12:00 PM', '5:00 PM'],
      friday:    ['9:00 AM', '12:00 PM'],
      saturday:  ['10:00 AM', '12:00 PM'],
      sunday:    ['12:00 PM', '2:00 PM'],
    },
  }

  return times[platform] ?? times.instagram
}