// src/lib/trends/sources.ts
//
// Aggregates trending topics from several publicly available APIs and RSS feeds:
//   • Google Trends — Daily Trending Searches (Atom RSS, no API key required)
//   • YouTube Data API v3 — Most Popular videos (needs YOUTUBE_API_KEY)
//   • Reddit — /r/all/rising.json (public, no key required)
//   • Hacker News — Firebase public API (no key required)
//   • X / Twitter — Trends24 public feed (no key required, best-effort scrape)
//
// Each source is independent; failures in one do not take down the others.

export type TrendSource = 'google' | 'youtube' | 'reddit' | 'hackernews' | 'twitter'
export type TrendPlatform = 'TK' | 'IG' | 'YT' | 'X' | 'LI' | 'RD' | 'HN' | 'GT'
export type TrendCategory = 'hashtag' | 'sound' | 'challenge' | 'topic'

export interface NormalizedTrend {
  id: string
  tag: string
  platform: TrendPlatform
  category: TrendCategory
  source: TrendSource
  growth: string
  posts: string
  timeAgo: string
  isHot: boolean
  isNew: boolean
  description: string
  hook: string
  url?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function compactCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

async function safe<T>(fn: () => Promise<T>, label: string): Promise<T | null> {
  try {
    return await fn()
  } catch (err) {
    console.warn(`[trends:${label}] Failed:`, err instanceof Error ? err.message : err)
    return null
  }
}

// ─── Google Trends ────────────────────────────────────────────────────────────

/**
 * Fetches Google's Daily Trending Searches RSS feed for a given geo.
 * The feed is XML; we parse it with regex to avoid heavy dependencies.
 */
export async function fetchGoogleTrends(geo = 'US'): Promise<NormalizedTrend[]> {
  const url = `https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 ViralKitBot/1.0' },
    next: { revalidate: 900 },
  })
  if (!res.ok) throw new Error(`Google Trends returned ${res.status}`)
  const xml = await res.text()

  const items = xml.split('<item>').slice(1)
  const results: NormalizedTrend[] = []

  for (const block of items.slice(0, 20)) {
    const title = block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim()
    const traffic = block.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1]?.trim()
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim()
    const link = block.match(/<link>(.*?)<\/link>/)?.[1]?.trim()
    if (!title) continue

    const ts = pubDate ? new Date(pubDate).getTime() : Date.now()
    const ageMins = (Date.now() - ts) / 60000

    results.push({
      id: `gt-${Buffer.from(title).toString('base64').slice(0, 16)}`,
      tag: title,
      platform: 'GT',
      category: 'topic',
      source: 'google',
      growth: traffic ?? 'Trending',
      posts: traffic ?? '',
      timeAgo: timeAgo(ts),
      isHot: ageMins < 240,
      isNew: ageMins < 60,
      description: `${title} is trending on Google Search${traffic ? ` with ${traffic} searches` : ''}`,
      hook: `Here's why ${title} is trending right now...`,
      url: link,
    })
  }
  return results
}

// ─── YouTube Most Popular ─────────────────────────────────────────────────────

interface YTVideo {
  id: string
  snippet: {
    title: string
    channelTitle: string
    publishedAt: string
    tags?: string[]
  }
  statistics: { viewCount: string; likeCount?: string }
}

export async function fetchYoutubeTrending(regionCode = 'US'): Promise<NormalizedTrend[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new Error('YOUTUBE_API_KEY not set')

  const url = new URL('https://www.googleapis.com/youtube/v3/videos')
  url.searchParams.set('part', 'snippet,statistics')
  url.searchParams.set('chart', 'mostPopular')
  url.searchParams.set('regionCode', regionCode)
  url.searchParams.set('maxResults', '15')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString(), { next: { revalidate: 900 } })
  if (!res.ok) throw new Error(`YouTube API returned ${res.status}`)
  const json = (await res.json()) as { items: YTVideo[] }

  return json.items.map(v => {
    const ts = new Date(v.snippet.publishedAt).getTime()
    const ageHours = (Date.now() - ts) / 3_600_000
    const views = Number(v.statistics.viewCount) || 0
    return {
      id: `yt-${v.id}`,
      tag: v.snippet.title.slice(0, 80),
      platform: 'YT',
      category: 'topic',
      source: 'youtube',
      growth: `${compactCount(views)} views`,
      posts: `${compactCount(views)}`,
      timeAgo: timeAgo(ts),
      isHot: ageHours < 48 && views > 100_000,
      isNew: ageHours < 24,
      description: `Trending on YouTube by ${v.snippet.channelTitle}`,
      hook: v.snippet.title,
      url: `https://youtube.com/watch?v=${v.id}`,
    }
  })
}

// ─── Reddit Rising ────────────────────────────────────────────────────────────

interface RedditPost {
  data: {
    id: string
    title: string
    subreddit: string
    score: number
    num_comments: number
    created_utc: number
    permalink: string
  }
}

export async function fetchRedditRising(): Promise<NormalizedTrend[]> {
  const res = await fetch('https://www.reddit.com/r/all/rising.json?limit=20', {
    headers: { 'User-Agent': 'ViralKitBot/1.0 (trend radar)' },
    next: { revalidate: 900 },
  })
  if (!res.ok) throw new Error(`Reddit returned ${res.status}`)
  const json = (await res.json()) as { data: { children: RedditPost[] } }

  return json.data.children.map(c => {
    const ts = c.data.created_utc * 1000
    const ageHours = (Date.now() - ts) / 3_600_000
    return {
      id: `rd-${c.data.id}`,
      tag: c.data.title.slice(0, 80),
      platform: 'RD',
      category: 'topic',
      source: 'reddit',
      growth: `${compactCount(c.data.score)} upvotes`,
      posts: `${compactCount(c.data.num_comments)} comments`,
      timeAgo: timeAgo(ts),
      isHot: c.data.score > 1_000 && ageHours < 12,
      isNew: ageHours < 3,
      description: `Rising on r/${c.data.subreddit}`,
      hook: c.data.title,
      url: `https://reddit.com${c.data.permalink}`,
    }
  })
}

// ─── Hacker News ──────────────────────────────────────────────────────────────

interface HNStory {
  id: number
  title: string
  url?: string
  score: number
  time: number
  descendants?: number
}

export async function fetchHackerNewsTop(): Promise<NormalizedTrend[]> {
  const idsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
    next: { revalidate: 900 },
  })
  if (!idsRes.ok) throw new Error(`Hacker News returned ${idsRes.status}`)
  const ids = (await idsRes.json()) as number[]

  const topIds = ids.slice(0, 12)
  const stories = await Promise.all(
    topIds.map(async id => {
      const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        next: { revalidate: 900 },
      })
      return (await r.json()) as HNStory
    }),
  )

  return stories
    .filter(s => s && s.title)
    .map(s => {
      const ts = s.time * 1000
      const ageHours = (Date.now() - ts) / 3_600_000
      return {
        id: `hn-${s.id}`,
        tag: s.title.slice(0, 80),
        platform: 'HN' as const,
        category: 'topic' as const,
        source: 'hackernews' as const,
        growth: `${s.score} points`,
        posts: `${s.descendants ?? 0} comments`,
        timeAgo: timeAgo(ts),
        isHot: s.score > 200 && ageHours < 24,
        isNew: ageHours < 4,
        description: 'Top story on Hacker News',
        hook: s.title,
        url: s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
      }
    })
}

// ─── X / Twitter Trends (via Trends24) ────────────────────────────────────────

/**
 * Trends24 is a public site that mirrors regional Twitter/X trends.
 * Twitter's own v2 API requires paid access, so we fall back to their RSS-like feed.
 * Failure here is silent — the aggregator will still return data from other sources.
 */
export async function fetchXTrends(country = 'worldwide'): Promise<NormalizedTrend[]> {
  const url = `https://trends24.in/${country === 'worldwide' ? '' : country + '/'}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 ViralKitBot/1.0' },
    next: { revalidate: 900 },
  })
  if (!res.ok) throw new Error(`Trends24 returned ${res.status}`)
  const html = await res.text()

  // Pull trends from the first <ol class="trend-card__list"> block.
  const listMatch = html.match(/<ol class="trend-card__list"[^>]*>([\s\S]*?)<\/ol>/)
  if (!listMatch) return []
  const items = Array.from(
    listMatch[1].matchAll(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g),
  ).slice(0, 20)

  return items.map(([, href, label], i) => {
    const tag = label.trim()
    const isHashtag = tag.startsWith('#')
    return {
      id: `x-${Buffer.from(tag).toString('base64').slice(0, 12)}`,
      tag,
      platform: 'X' as const,
      category: isHashtag ? ('hashtag' as const) : ('topic' as const),
      source: 'twitter' as const,
      growth: `#${i + 1} trending`,
      posts: '',
      timeAgo: 'live',
      isHot: i < 5,
      isNew: i < 3,
      description: `Currently trending on X (${country})`,
      hook: `Join the conversation on ${tag}...`,
      url: href.startsWith('http') ? href : `https://twitter.com/search?q=${encodeURIComponent(tag)}`,
    }
  })
}

// ─── Aggregator ───────────────────────────────────────────────────────────────

export interface AggregateOptions {
  geo?: string          // Google Trends geo (e.g. 'US', 'NG', 'GB')
  youtubeRegion?: string
  xCountry?: string
  sources?: TrendSource[]
}

export async function aggregateTrends(
  opts: AggregateOptions = {},
): Promise<{ trends: NormalizedTrend[]; sources: Record<TrendSource, boolean> }> {
  const sources = opts.sources ?? ['google', 'youtube', 'reddit', 'hackernews', 'twitter']

  const [google, youtube, reddit, hn, x] = await Promise.all([
    sources.includes('google') ? safe(() => fetchGoogleTrends(opts.geo), 'google') : null,
    sources.includes('youtube')
      ? safe(() => fetchYoutubeTrending(opts.youtubeRegion), 'youtube')
      : null,
    sources.includes('reddit') ? safe(() => fetchRedditRising(), 'reddit') : null,
    sources.includes('hackernews') ? safe(() => fetchHackerNewsTop(), 'hackernews') : null,
    sources.includes('twitter') ? safe(() => fetchXTrends(opts.xCountry), 'twitter') : null,
  ])

  const availability: Record<TrendSource, boolean> = {
    google: !!google,
    youtube: !!youtube,
    reddit: !!reddit,
    hackernews: !!hn,
    twitter: !!x,
  }

  const all = [
    ...(google ?? []),
    ...(youtube ?? []),
    ...(reddit ?? []),
    ...(hn ?? []),
    ...(x ?? []),
  ]

  all.sort((a, b) => {
    if (a.isHot && !b.isHot) return -1
    if (!a.isHot && b.isHot) return 1
    if (a.isNew && !b.isNew) return -1
    if (!a.isNew && b.isNew) return 1
    return 0
  })

  return { trends: all, sources: availability }
}
