'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'

type Platform = 'All' | 'TK' | 'IG' | 'YT' | 'X' | 'LI'
type TrendCategory = 'hashtag' | 'sound' | 'challenge' | 'topic'

interface Trend {
  id: string
  tag: string
  platform: Exclude<Platform, 'All'>
  category: TrendCategory
  growth: string
  posts: string
  timeAgo: string
  isHot: boolean
  isNew: boolean
  description: string
  hook: string
}

const TRENDS: Trend[] = [
  { id: '1', tag: '#LagosTech', platform: 'TK', category: 'hashtag', growth: '+847%', posts: '24.3K', timeAgo: '2h ago', isHot: true, isNew: true, description: 'Lagos technology entrepreneurs sharing startup stories', hook: 'POV: Building a startup in Lagos with ₦50k capital...' },
  { id: '2', tag: '#NaijaFood', platform: 'IG', category: 'hashtag', growth: '+312%', posts: '18.9K', timeAgo: '5h ago', isHot: true, isNew: false, description: 'Nigerian food content going global after viral BBC feature', hook: 'This Nigerian dish just went viral internationally...' },
  { id: '3', tag: 'Afrobeats Remix Sound', platform: 'TK', category: 'sound', growth: '+289%', posts: '41.2K', timeAgo: '3h ago', isHot: true, isNew: true, description: 'Trending TikTok sound from Burna Boy remix', hook: 'Using this trending sound for maximum reach...' },
  { id: '4', tag: '#AfricanFashionWeek', platform: 'IG', category: 'hashtag', growth: '+189%', posts: '9.7K', timeAgo: '8h ago', isHot: false, isNew: false, description: 'Fashion week season driving massive fashion content', hook: 'My take on African fashion trends this season...' },
  { id: '5', tag: '#9jaEntrepreneur', platform: 'X', category: 'topic', growth: '+156%', posts: '6.2K', timeAgo: '4h ago', isHot: false, isNew: true, description: 'Nigerian entrepreneur success stories going viral on X', hook: 'Thread: How I scaled to ₦1M revenue in 6 months...' },
  { id: '6', tag: '#AfrobeatHits2026', platform: 'YT', category: 'hashtag', growth: '+134%', posts: '3.4K', timeAgo: '12h ago', isHot: false, isNew: false, description: 'Music reaction and review content performing well', hook: 'Rating all the biggest Afrobeats hits so far...' },
  { id: '7', tag: 'African Sunset Transition', platform: 'TK', category: 'challenge', growth: '+423%', posts: '89.1K', timeAgo: '1h ago', isHot: true, isNew: true, description: 'Viral transition video challenge sweeping TikTok', hook: 'Tried the African sunset transition challenge...' },
  { id: '8', tag: '#MadeinNaija', platform: 'IG', category: 'hashtag', growth: '+98%', posts: '12.4K', timeAgo: '1d ago', isHot: false, isNew: false, description: 'Made in Nigeria products getting international attention', hook: 'These Nigerian brands are taking over...' },
]

const PLATFORM_COLORS: Record<string, string> = { TK: '#69C9D0', IG: '#E1306C', YT: '#FF0000', X: '#1DA1F2', LI: '#0077B5' }
const CATEGORY_LABELS: Record<TrendCategory, string> = { hashtag: '#️⃣', sound: '🎵', challenge: '🎯', topic: '💬' }

export default function TrendRadarPage() {
  const [platform, setPlatform] = useState<Platform>('All')
  const [category, setCategory] = useState<TrendCategory | 'All'>('All')
  const [search, setSearch] = useState('')
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Populate on client only to avoid SSR/client time mismatch
  useEffect(() => {
    setLastUpdate(new Date())
    const interval = setInterval(() => setLastUpdate(new Date()), 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filtered = TRENDS.filter(t => {
    if (platform !== 'All' && t.platform !== platform) return false
    if (category !== 'All' && t.category !== category) return false
    if (search && !t.tag.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function createFromTrend(trend: Trend) {
    setGenerating(trend.id)
    await new Promise(r => setTimeout(r, 1500))
    setGenerating(null)
    // Would navigate to studio with pre-filled prompt
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
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : '—'} · Refreshes every 15 min</p>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            🔔 Alert me on new trends
          </button>
        </div>

        {/* Hot right now banner */}
        <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto' }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', flexShrink: 0 }}>Exploding now:</span>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {TRENDS.filter(t => t.isHot).map(t => (
              <button key={t.id} onClick={() => setSelectedTrend(t)}
                style={{ flexShrink: 0, padding: '4px 10px', borderRadius: 20, background: `${PLATFORM_COLORS[t.platform]}22`, border: `1px solid ${PLATFORM_COLORS[t.platform]}44`, color: PLATFORM_COLORS[t.platform], fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {t.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 160, position: 'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trends..."
              style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {/* Platform filter */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
            {(['All','TK','IG','YT','X','LI'] as Platform[]).map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                style={{ padding: '5px 8px', borderRadius: 7, border: 'none', background: platform === p ? 'rgba(255,255,255,0.12)' : 'transparent', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', color: platform === p ? (p !== 'All' ? PLATFORM_COLORS[p] : '#fff') : 'rgba(255,255,255,0.35)' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
          {(['All', 'hashtag', 'sound', 'challenge', 'topic'] as const).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: category === c ? '#F59E0B' : 'rgba(255,255,255,0.08)', background: category === c ? 'rgba(245,158,11,0.1)' : 'transparent', color: category === c ? '#F59E0B' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
              {c !== 'All' ? CATEGORY_LABELS[c] : '⚡'} {c === 'All' ? 'All trends' : c.charAt(0).toUpperCase() + c.slice(1) + 's'}
            </button>
          ))}
        </div>

        {/* Trend list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(trend => (
            <div key={trend.id}
              style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${trend.isHot ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, cursor: 'pointer', transition: 'all 0.15s' }}
              onClick={() => setSelectedTrend(selectedTrend?.id === trend.id ? null : trend)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${PLATFORM_COLORS[trend.platform]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: PLATFORM_COLORS[trend.platform], flexShrink: 0 }}>{trend.platform}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{trend.tag}</span>
                    {trend.isHot && <span style={{ fontSize: 9, background: 'rgba(239,68,68,0.15)', color: '#EF4444', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>🔥 HOT</span>}
                    {trend.isNew && <span style={{ fontSize: 9, background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>NEW</span>}
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{CATEGORY_LABELS[trend.category]}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{trend.posts} posts · {trend.timeAgo}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981' }}>{trend.growth}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>growth rate</div>
                </div>
              </div>

              {/* Expanded detail */}
              {selectedTrend?.id === trend.id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>{trend.description}</p>
                  <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>💡 Suggested hook:</div>
                    <div style={{ fontSize: 13, color: '#F59E0B', fontStyle: 'italic' }}>"{trend.hook}"</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={e => { e.stopPropagation(); createFromTrend(trend) }}
                      disabled={generating === trend.id}
                      style={{ flex: 1, padding: '10px', borderRadius: 10, background: generating === trend.id ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#F59E0B,#EF4444)', border: 'none', color: generating === trend.id ? 'rgba(255,255,255,0.3)' : '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                      {generating === trend.id ? '⏳ Creating...' : '✦ Create content on this trend →'}
                    </button>
                    <button onClick={e => e.stopPropagation()}
                      style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}>
                      🔔
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
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