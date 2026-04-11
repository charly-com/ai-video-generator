'use client'

import { useState } from 'react'


const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

type Platform = 'YT' | 'IG' | 'TK' | 'X' | 'LI'

interface CalendarPost {
  id: string
  day: number
  title: string
  platform: Platform
  type: 'video' | 'image' | 'reel'
  status: 'idea' | 'draft' | 'scheduled' | 'published'
  time?: string
  aiGenerated?: boolean
}

const PLATFORM_COLORS: Record<Platform, string> = {
  YT: '#FF0000',
  IG: '#E1306C',
  TK: '#69C9D0',
  X: '#1DA1F2',
  LI: '#0077B5',
}

const INITIAL_POSTS: CalendarPost[] = [
  { id: '1', day: 1, title: 'Product reveal reel', platform: 'IG', type: 'reel', status: 'published', time: '9:00 AM', aiGenerated: true },
  { id: '2', day: 3, title: 'Behind-the-scenes vlog', platform: 'YT', type: 'video', status: 'published', time: '2:00 PM' },
  { id: '3', day: 5, title: 'Trending sound remix', platform: 'TK', type: 'reel', status: 'published', time: '7:00 PM', aiGenerated: true },
  { id: '4', day: 8, title: 'Tips thread', platform: 'X', type: 'image', status: 'scheduled', time: '8:00 AM', aiGenerated: true },
  { id: '5', day: 9, title: 'Product demo video', platform: 'YT', type: 'video', status: 'scheduled', time: '3:00 PM' },
  { id: '6', day: 10, title: 'Weekly styling content', platform: 'IG', type: 'image', status: 'scheduled', time: '12:00 PM', aiGenerated: true },
  { id: '7', day: 12, title: '#LagosTech collab reel', platform: 'TK', type: 'reel', status: 'draft', aiGenerated: true },
  { id: '8', day: 15, title: 'Customer story spotlight', platform: 'LI', type: 'video', status: 'idea', aiGenerated: true },
  { id: '9', day: 17, title: 'Q&A session live cut', platform: 'YT', type: 'video', status: 'idea' },
  { id: '10', day: 19, title: 'Behind-the-brand story', platform: 'IG', type: 'reel', status: 'idea', aiGenerated: true },
  { id: '11', day: 22, title: 'Weekly update vlog', platform: 'YT', type: 'video', status: 'idea' },
  { id: '12', day: 24, title: 'Product comparison reel', platform: 'TK', type: 'reel', status: 'idea', aiGenerated: true },
  { id: '13', day: 26, title: 'Brand milestone post', platform: 'LI', type: 'image', status: 'idea', aiGenerated: true },
  { id: '14', day: 29, title: 'Month recap video', platform: 'YT', type: 'video', status: 'idea', aiGenerated: true },
]

const AI_SUGGESTIONS = [
  { title: 'Catch the #NaijaEntrepreneur trend', platform: 'TK' as Platform, type: 'reel' as const, reason: '+847% trending now' },
  { title: 'Morning routine content — high engagement Tue-Thu', platform: 'IG' as Platform, type: 'reel' as const, reason: 'Best slot: 7-9 AM' },
  { title: 'Quick tip video for LinkedIn audience', platform: 'LI' as Platform, type: 'video' as const, reason: 'Underserved slot Fri' },
]

export default function ContentCalendarPage() {
  const [posts, setPosts] = useState<CalendarPost[]>(INITIAL_POSTS)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')
  const [generating, setGenerating] = useState(false)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dayPosts = (day: number) => posts.filter(p => p.day === day)
  const selectedPosts = selectedDay ? dayPosts(selectedDay) : []

  const statusColors: Record<string, string> = {
    published: '#10B981',
    scheduled: '#F59E0B',
    draft: '#6366F1',
    idea: 'rgba(255,255,255,0.3)',
  }

  async function aiAutofill() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2200))
    const newPosts: CalendarPost[] = [2,4,6,7,11,13,14,16,18,20,21,23,25,27,28,30].map((day, i) => ({
      id: `ai-${day}`,
      day,
      title: ['Trending sound collab', 'Brand story reel', 'FAQ breakdown thread', 'Customer testimonial', 'Product tip #1', 'Behind-the-scenes', 'Weekly roundup video', 'Community spotlight', 'How-to tutorial', 'Trend reaction video', 'Personal story post', 'Brand values content', 'Success story video', 'Industry insight thread', 'End-of-month wrap-up', 'Teaser for next month'][i] || 'AI Content Idea',
      platform: (['TK','IG','X','YT','LI'] as Platform[])[i % 5],
      type: (['reel','video','image','reel','video'] as const)[i % 5],
      status: 'idea' as const,
      aiGenerated: true,
    }))
    setPosts(prev => {
      const existing = new Set(prev.map(p => p.day))
      return [...prev, ...newPosts.filter(p => !existing.has(p.day))]
    })
    setGenerating(false)
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Content Calendar</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{MONTHS[month]} {year} · {posts.filter(p => p.status === 'scheduled' || p.status === 'published').length} posts scheduled</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 2, gap: 2 }}>
              {(['month','week','list'] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: viewMode === v ? 'rgba(255,255,255,0.1)' : 'transparent', color: viewMode === v ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}>
                  {v}
                </button>
              ))}
            </div>
            <button onClick={aiAutofill} disabled={generating}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: generating ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#F59E0B,#EF4444)', border: 'none', color: generating ? 'rgba(255,255,255,0.4)' : '#000', fontSize: 13, fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer' }}>
              {generating ? '⏳ Filling...' : '✦ AI Autofill'}
            </button>
          </div>
        </div>

        {/* AI Suggestions */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>AI Suggestions for this week</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {AI_SUGGESTIONS.map((s, i) => (
              <div key={i} style={{ flexShrink: 0, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, maxWidth: 220, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: `${PLATFORM_COLORS[s.platform]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: PLATFORM_COLORS[s.platform] }}>{s.platform}</div>
                  <span style={{ fontSize: 10, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: 10 }}>{s.reason}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 6, lineHeight: 1.4 }}>{s.title}</div>
                <button style={{ fontSize: 11, color: '#F59E0B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Add to calendar →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding: '8px 4px', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {/* Empty cells for first week offset */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: 80, borderRight: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.1)' }} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const today = day === now.getDate()
              const dp = dayPosts(day)
              const isSelected = selectedDay === day
              return (
                <div key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  style={{ minHeight: 80, borderRight: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '6px 6px', cursor: 'pointer', background: isSelected ? 'rgba(245,158,11,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: today ? 800 : 400, color: today ? '#F59E0B' : 'rgba(255,255,255,0.4)', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: today ? 'rgba(245,158,11,0.15)' : 'transparent' }}>
                      {day}
                    </span>
                    {dp.length > 0 && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{dp.length}p</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {dp.slice(0, 3).map(post => (
                      <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: statusColors[post.status], flexShrink: 0 }} />
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%', lineHeight: 1.2 }}>{post.title}</span>
                      </div>
                    ))}
                    {dp.length > 3 && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>+{dp.length - 3} more</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected day panel */}
        {selectedDay && (
          <div style={{ marginTop: 16, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{MONTHS[month]} {selectedDay}</h3>
              <button style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>+ Add post</button>
            </div>
            {selectedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No content scheduled · <span style={{ color: '#F59E0B', cursor: 'pointer' }}>Let AI suggest something →</span></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedPosts.map(post => (
                  <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${PLATFORM_COLORS[post.platform]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: PLATFORM_COLORS[post.platform], flexShrink: 0 }}>{post.platform}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {post.title}
                        {post.aiGenerated && <span style={{ fontSize: 9, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '1px 5px', borderRadius: 10 }}>AI</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{post.type} · {post.time || 'No time set'}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 10, color: statusColors[post.status], background: `${statusColors[post.status]}18`, padding: '2px 8px', borderRadius: 10, fontWeight: 600, textTransform: 'capitalize' }}>{post.status}</span>
                      {post.status === 'idea' && <button style={{ fontSize: 11, color: '#F59E0B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Generate →</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'capitalize' }}>{status}</span>
            </div>
          ))}
        </div>
      </div>
  )
}