'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'

type Platform = 'All' | 'GT' | 'YT' | 'X' | 'RD' | 'HN'
type TrendCategory = 'hashtag' | 'sound' | 'challenge' | 'topic'
type SourceKey = 'google' | 'youtube' | 'reddit' | 'hackernews' | 'twitter'

interface Trend {
  id: string
  tag: string
  platform: Platform extends 'All' ? never : Exclude<Platform, 'All'>
  category: TrendCategory
  source: SourceKey
  growth: string
  posts: string
  timeAgo: string
  isHot: boolean
  isNew: boolean
  description: string
  hook: string
  url?: string
}

const PLATFORM_COLORS: Record<string, string> = {
  GT: '#4285F4', YT: '#FF0000', X: '#1DA1F2', RD: '#FF4500', HN: '#FF6600',
  TK: '#69C9D0', IG: '#E1306C', LI: '#0077B5',
}
const PLATFORM_LABELS: Record<string, string> = {
  GT: 'Google', YT: 'YouTube', X: 'X', RD: 'Reddit', HN: 'HN',
  TK: 'TikTok', IG: 'Instagram', LI: 'LinkedIn',
}
const CATEGORY_LABELS: Record<TrendCategory, string> = { hashtag: '#️⃣', sound: '🎵', challenge: '🎯', topic: '💬' }
const SOURCE_LABELS: Record<SourceKey, string> = {
  google: 'Google Trends',
  youtube: 'YouTube',
  reddit: 'Reddit',
  hackernews: 'Hacker News',
  twitter: 'X / Twitter',
}

export default function TrendRadarPage() {
  const [platform, setPlatform] = useState<Platform>('All')
  const [category, setCategory] = useState<TrendCategory | 'All'>('All')
  const [search, setSearch] = useState('')
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [geo, setGeo] = useState('US')
  const [trends, setTrends] = useState<Trend[]>([])
  const [availability, setAvailability] = useState<Record<SourceKey, boolean>>({
    google: false, youtube: false, reddit: false, hackernews: false, twitter: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTrends = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ geo, youtubeRegion: geo })
      const res = await fetch(`/api/trending/live?${params.toString()}`)
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to load trends')
      setTrends(json.data as Trend[])
      setAvailability(json.availability)
      setLastUpdate(new Date(json.updatedAt ?? Date.now()))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load trends')
    } finally {
      setLoading(false)
    }
  }, [geo])

  useEffect(() => {
    void fetchTrends()
    const interval = setInterval(() => void fetchTrends(), 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchTrends])

  const filtered = trends.filter(t => {
    if (platform !== 'All' && t.platform !== platform) return false
    if (category !== 'All' && t.category !== category) return false
    if (search && !t.tag.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const availablePlatforms: Platform[] = ['All', 'GT', 'YT', 'X', 'RD', 'HN']

  async function createFromTrend(trend: Trend) {
    setGenerating(trend.id)
    await new Promise(r => setTimeout(r, 600))
    setGenerating(null)
    window.location.href = `/dashboard/studio?prompt=${encodeURIComponent(trend.hook)}&tag=${encodeURIComponent(trend.tag)}`
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Trend Radar</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: '3px 8px' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 700 }}>LIVE</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
              {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'Loading live data...'} · Auto-refresh every 15 min
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select value={geo} onChange={e => setGeo(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, outline: 'none' }}>
              <option value="US">🇺🇸 United States</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="NG">🇳🇬 Nigeria</option>
              <option value="ZA">🇿🇦 South Africa</option>
              <option value="KE">🇰🇪 Kenya</option>
              <option value="GH">🇬🇭 Ghana</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="IN">🇮🇳 India</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="FR">🇫🇷 France</option>
              <option value="BR">🇧🇷 Brazil</option>
            </select>
            <button onClick={() => void fetchTrends()} disabled={loading}
              style={{ padding: '6px 12px', borderRadius: 8, background: loading ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 12, cursor: loading ? 'wait' : 'pointer', fontWeight: 600 }}>
              {loading ? '⏳' : '↻'} Refresh
            </button>
          </div>
        </div>

        {/* Source availability badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {(Object.keys(SOURCE_LABELS) as SourceKey[]).map(src => (
            <div key={src}
              style={{ padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                background: availability[src] ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${availability[src] ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
                color: availability[src] ? '#10B981' : 'rgba(255,255,255,0.25)' }}>
              {availability[src] ? '●' : '○'} {SOURCE_LABELS[src]}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#EF4444', fontSize: 13, marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Hot right now banner */}
        {trends.filter(t => t.isHot).length > 0 && (
          <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔥</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', flexShrink: 0 }}>Exploding now:</span>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {trends.filter(t => t.isHot).slice(0, 8).map(t => (
                <button key={t.id} onClick={() => setSelectedTrend(t)}
                  style={{ flexShrink: 0, padding: '4px 10px', borderRadius: 20, background: `${PLATFORM_COLORS[t.platform]}22`, border: `1px solid ${PLATFORM_COLORS[t.platform]}44`, color: PLATFORM_COLORS[t.platform], fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160, position: 'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trends..."
              style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
            {availablePlatforms.map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                style={{ padding: '5px 10px', borderRadius: 7, border: 'none', background: platform === p ? 'rgba(255,255,255,0.12)' : 'transparent', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', color: platform === p ? (p !== 'All' ? PLATFORM_COLORS[p] : '#fff') : 'rgba(255,255,255,0.35)' }}>
                {p === 'All' ? 'All' : PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
          {(['All', 'hashtag', 'topic', 'challenge', 'sound'] as const).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: category === c ? '#F59E0B' : 'rgba(255,255,255,0.08)', background: category === c ? 'rgba(245,158,11,0.1)' : 'transparent', color: category === c ? '#F59E0B' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
              {c !== 'All' ? CATEGORY_LABELS[c] : '⚡'} {c === 'All' ? 'All trends' : c.charAt(0).toUpperCase() + c.slice(1) + 's'}
            </button>
          ))}
        </div>

        {/* Trend list */}
        {loading && trends.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📡</div>
            <div style={{ fontSize: 14 }}>Fetching live trends from Google, YouTube, Reddit, HN & X...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(trend => (
              <div key={trend.id}
                style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${trend.isHot ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, cursor: 'pointer', transition: 'all 0.15s' }}
                onClick={() => setSelectedTrend(selectedTrend?.id === trend.id ? null : trend)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${PLATFORM_COLORS[trend.platform]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: PLATFORM_COLORS[trend.platform], flexShrink: 0 }}>{PLATFORM_LABELS[trend.platform]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{trend.tag}</span>
                      {trend.isHot && <span style={{ fontSize: 9, background: 'rgba(239,68,68,0.15)', color: '#EF4444', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>🔥 HOT</span>}
                      {trend.isNew && <span style={{ fontSize: 9, background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>NEW</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                      {trend.posts ? `${trend.posts} · ` : ''}{trend.timeAgo}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#10B981' }}>{trend.growth}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{SOURCE_LABELS[trend.source]}</div>
                  </div>
                </div>

                {selectedTrend?.id === trend.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>{trend.description}</p>
                    <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>💡 Suggested hook:</div>
                      <div style={{ fontSize: 13, color: '#F59E0B', fontStyle: 'italic' }}>&quot;{trend.hook}&quot;</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={e => { e.stopPropagation(); createFromTrend(trend) }}
                        disabled={generating === trend.id}
                        style={{ flex: 1, padding: '10px', borderRadius: 10, background: generating === trend.id ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#F59E0B,#EF4444)', border: 'none', color: generating === trend.id ? 'rgba(255,255,255,0.3)' : '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        {generating === trend.id ? '⏳ Creating...' : '✦ Create content on this trend →'}
                      </button>
                      {trend.url && (
                        <a href={trend.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                          style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>
                          ↗
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 14 }}>No trends match your filters</div>
          </div>
        )}

        <style>{`
          @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
        `}</style>
      </div>
  )
}
