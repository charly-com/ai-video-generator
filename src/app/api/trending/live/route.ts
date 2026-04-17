// src/app/api/trending/live/route.ts
//
// Live trend radar: aggregates actual trending topics from Google, YouTube,
// Reddit, Hacker News, and X / Twitter. Cached for 15 minutes per filter combo.

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { aggregateTrends, type TrendSource } from '@/lib/trends/sources'

const CACHE_TTL_MS = 15 * 60 * 1000
const cache = new Map<string, { expiresAt: number; payload: unknown }>()

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const geo = searchParams.get('geo') ?? 'US'
  const youtubeRegion = searchParams.get('youtubeRegion') ?? geo
  const xCountry = searchParams.get('xCountry') ?? 'worldwide'
  const sourcesParam = searchParams.get('sources')
  const sources = (sourcesParam
    ? sourcesParam.split(',').map(s => s.trim())
    : ['google', 'youtube', 'reddit', 'hackernews', 'twitter']) as TrendSource[]

  const cacheKey = JSON.stringify({ geo, youtubeRegion, xCountry, sources })
  const cached = cache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ ...(cached.payload as object), cached: true })
  }

  try {
    const result = await aggregateTrends({ geo, youtubeRegion, xCountry, sources })
    const payload = {
      success: true,
      data: result.trends,
      availability: result.sources,
      updatedAt: new Date().toISOString(),
    }
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload })
    return NextResponse.json(payload)
  } catch (error) {
    console.error('[trending/live] Aggregation failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate trends' },
      { status: 500 },
    )
  }
}
