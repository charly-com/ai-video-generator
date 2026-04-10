'use client'

import { useState } from 'react'

const PLATFORMS = ['All', 'YouTube', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn']
const PERIODS = ['7 days', '30 days', '90 days', 'All time']

const PLATFORM_STATS = [
  { name: 'YouTube', short: 'YT', color: '#FF0000', views: 142000, followers: 3200, growth: '+18%', posts: 12 },
  { name: 'Instagram', short: 'IG', color: '#E1306C', views: 89000, followers: 8900, growth: '+24%', posts: 31 },
  { name: 'TikTok', short: 'TK', color: '#69C9D0', views: 210000, followers: 12400, growth: '+67%', posts: 28 },
  { name: 'Twitter', short: 'X', color: '#1DA1F2', views: 28000, followers: 2100, growth: '+9%', posts: 45 },
  { name: 'LinkedIn', short: 'LI', color: '#0077B5', views: 14000, followers: 1800, growth: '+12%', posts: 8 },
]

const TOP_CONTENT = [
  { title: 'Product Demo Reel', platform: 'TK', views: 214000, likes: 18200, shares: 4300, type: 'video', date: 'Apr 2', thumb: '#69C9D0' },
  { title: 'Behind-the-Brand Story', platform: 'IG', views: 89400, likes: 7800, shares: 1200, type: 'reel', date: 'Apr 5', thumb: '#E1306C' },
  { title: 'How I Started Tutorial', platform: 'YT', views: 42100, likes: 3100, shares: 890, type: 'video', date: 'Mar 28', thumb: '#FF0000' },
  { title: '#LagosTech Trend Video', platform: 'TK', views: 38700, likes: 4200, shares: 2100, type: 'video', date: 'Apr 7', thumb: '#69C9D0' },
  { title: 'Morning Routine Content', platform: 'IG', views: 24600, likes: 2900, shares: 340, type: 'reel', date: 'Apr 4', thumb: '#E1306C' },
]

// Weekly bar chart data (7 days)
const WEEKLY_VIEWS = [18400, 24100, 19800, 31200, 28700, 42100, 38600]
const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function MiniBarChart({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', height: Math.round((v / max) * 68), background: `${color}99`, borderRadius: '3px 3px 0 0', minHeight: 4, transition: 'height 0.5s' }} />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{WEEK_LABELS[i]}</span>
        </div>
      ))}
    </div>
  )
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export default function AnalyticsPage() {
  const [platform, setPlatform] = useState('All')
  const [period, setPeriod] = useState('30 days')

  const totalViews = PLATFORM_STATS.reduce((a, p) => a + p.views, 0)
  const totalFollowers = PLATFORM_STATS.reduce((a, p) => a + p.followers, 0)

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', overflowX: 'hidden' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Analytics</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Cross-platform performance overview</p>
        </div>
        <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ padding: '5px 10px', borderRadius: 7, border: 'none', background: period === p ? 'rgba(255,255,255,0.1)' : 'transparent', color: period === p ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Views', value: formatNum(totalViews), change: '+28%', color: '#F59E0B', icon: '👁️' },
          { label: 'Total Followers', value: formatNum(totalFollowers), change: '+19%', color: '#8B5CF6', icon: '👥' },
          { label: 'Engagement Rate', value: '6.4%', change: '+2.1%', color: '#10B981', icon: '💬' },
          { label: 'Content Published', value: '124', change: '+34 vs prev', color: '#06B6D4', icon: '📤' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#10B981' }}>↑ {s.change}</div>
          </div>
        ))}
      </div>

      {/* Views chart */}
      <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Views this week</span>
          <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>↑ +18.4% vs last week</span>
        </div>
        <MiniBarChart data={WEEKLY_VIEWS} color="#F59E0B" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Total: {formatNum(WEEKLY_VIEWS.reduce((a, b) => a + b, 0))}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Best: {formatNum(Math.max(...WEEKLY_VIEWS))} (Sat)</span>
        </div>
      </div>

      {/* Platform breakdown */}
      <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Platform breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PLATFORM_STATS.map(p => {
            const pct = Math.round((p.views / totalViews) * 100)
            return (
              <div key={p.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: p.color, flexShrink: 0 }}>{p.short}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{p.name}</span>
                      <span style={{ fontSize: 12, color: p.color, fontWeight: 700 }}>{p.growth}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: p.color, borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 60 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{formatNum(p.views)}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{pct}% of total</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top content */}
      <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Top performing content</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TOP_CONTENT.map((c, i) => (
            <div key={c.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.2)', width: 20, flexShrink: 0, textAlign: 'center' }}>#{i + 1}</div>
              <div style={{ width: 44, height: 32, borderRadius: 7, background: `${c.thumb}22`, border: `1px solid ${c.thumb}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: c.thumb, flexShrink: 0 }}>{c.platform}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.date} · {c.type}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{formatNum(c.views)}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>👍 {formatNum(c.likes)} · 🔁 {formatNum(c.shares)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best posting times */}
      <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>📊 Best posting times for your audience</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>Based on your engagement patterns over 30 days</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {[
            { platform: 'TK', color: '#69C9D0', times: '7–9 AM, 7–9 PM', days: 'Tue, Thu, Fri' },
            { platform: 'IG', color: '#E1306C', times: '12–2 PM, 6–8 PM', days: 'Mon, Wed, Fri' },
            { platform: 'YT', color: '#FF0000', times: '2–4 PM', days: 'Sat, Sun' },
            { platform: 'X', color: '#1DA1F2', times: '8–10 AM', days: 'Weekdays' },
          ].map(t => (
            <div key={t.platform} style={{ padding: '12px', background: `${t.color}0a`, border: `1px solid ${t.color}22`, borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.color, marginBottom: 4 }}>{t.platform}</div>
              <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, marginBottom: 2 }}>{t.times}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{t.days}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
