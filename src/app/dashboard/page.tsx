'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface UsageData {
  videosUsed: number
  videosLimit: number
  imagesUsed: number
  imagesLimit: number
  accountsConnected: number
  accountsLimit: number
}

const QUICK_ACTIONS = [
  { href: '/dashboard/studio', icon: '🎬', label: 'New Video', color: '#F59E0B', desc: 'AI-powered' },
  { href: '/dashboard/studio/image', icon: '🖼️', label: 'New Image', color: '#8B5CF6', desc: 'FLUX Ultra' },
  { href: '/dashboard/trending', icon: '🔥', label: 'Trending', color: '#EF4444', desc: 'Live now' },
  { href: '/dashboard/calendar', icon: '📅', label: 'Calendar', color: '#10B981', desc: '30-day plan' },
]

const RECENT_CONTENT = [
  { id: '1', title: 'Product Demo Reel', type: 'video', platform: 'IG', status: 'published', views: '12.4K', date: '2h ago', thumb: '#F59E0B' },
  { id: '2', title: 'Brand Story Series', type: 'image', platform: 'LI', status: 'published', views: '3.8K', date: '5h ago', thumb: '#8B5CF6' },
  { id: '3', title: '#LagosTech Trend Reel', type: 'video', platform: 'TK', status: 'scheduled', views: '—', date: 'Today 6PM', thumb: '#EF4444' },
  { id: '4', title: 'Weekly Tip Carousel', type: 'image', platform: 'X', status: 'draft', views: '—', date: 'Yesterday', thumb: '#06B6D4' },
]

const STATUS_COLORS: Record<string, string> = {
  published: '#10B981', scheduled: '#F59E0B', draft: '#6366F1', generating: '#F59E0B',
}

const PLATFORM_COLORS: Record<string, string> = {
  IG: '#E1306C', TK: '#69C9D0', YT: '#FF0000', X: '#1DA1F2', LI: '#0077B5', FB: '#1877F2',
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [usage, setUsage] = useState<UsageData>({ videosUsed: 0, videosLimit: 10, imagesUsed: 0, imagesLimit: 50, accountsConnected: 0, accountsLimit: 3 })
  const [streak, setStreak] = useState(0)
  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
    fetch('/api/gamification/streak').then(r => r.json()).then(j => {
      if (j.success) setStreak(j.data.current ?? 0)
    }).catch(() => {})
    fetch('/api/billing').then(r => r.json()).then(j => {
      if (j.success && j.data) {
        const d = j.data
        setUsage({
          videosUsed: d.usage?.videosGenerated ?? 0,
          videosLimit: d.usage?.videosLimit ?? 10,
          imagesUsed: d.usage?.imagesGenerated ?? 0,
          imagesLimit: d.usage?.imagesLimit ?? 50,
          accountsConnected: 0,
          accountsLimit: 3,
        })
      }
    }).catch(() => {})
  }, [])

  const videoPct = Math.round((usage.videosUsed / usage.videosLimit) * 100)
  const imagePct = Math.round((usage.imagesUsed / usage.imagesLimit) * 100)

  return (
    <div style={{ padding: '16px', maxWidth: 900, margin: '0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          {greeting}, {session?.user?.name?.split(' ')[0] ?? 'Creator'} 👋
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          🔥 {streak}-day streak · You&apos;re on a roll. Keep publishing today!
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
        {QUICK_ACTIONS.map(a => (
          <Link key={a.href} href={a.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '14px 8px', borderRadius: 16, textDecoration: 'none',
            background: `${a.color}12`, border: `1px solid ${a.color}30`,
            transition: 'all 0.15s', gap: 6,
          }}>
            <span style={{ fontSize: 24 }}>{a.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{a.label}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{a.desc}</span>
          </Link>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Views', value: '48.2K', change: '+18%', up: true, icon: '👁️' },
          { label: 'Engagement', value: '6.4%', change: '+2.1%', up: true, icon: '💬' },
          { label: 'Posts this month', value: '23', change: '+5 vs last', up: true, icon: '📤' },
          { label: 'Followers gained', value: '+841', change: 'this month', up: true, icon: '👥' },
        ].map(s => (
          <div key={s.label} style={{ padding: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.up ? '#10B981' : '#EF4444' }}>{s.up ? '↑' : '↓'} {s.change}</div>
          </div>
        ))}
      </div>

      {/* Daily challenge banner */}
      <Link href="/dashboard/challenges" style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', marginBottom: 20,
        background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.07))',
        border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, textDecoration: 'none',
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🎯</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>3 daily challenges available</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Complete them to earn +400 XP and 15 credits</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>+400 XP</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Resets in 4h →</span>
        </div>
      </Link>

      {/* Two columns: recent content + scheduled */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Recent content */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Recent Content</span>
            <Link href="/dashboard/vault" style={{ fontSize: 12, color: '#F59E0B', textDecoration: 'none' }}>See all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RECENT_CONTENT.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 32, borderRadius: 8, background: `${c.thumb}22`, border: `1px solid ${c.thumb}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  {c.type === 'video' ? '🎬' : '🖼️'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: PLATFORM_COLORS[c.platform] || '#fff' }}>{c.platform}</span>
                    <span>·</span><span>{c.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLORS[c.status], background: `${STATUS_COLORS[c.status]}18`, padding: '2px 7px', borderRadius: 10 }}>{c.status}</span>
                  {c.views !== '—' && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.views} views</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending now quick-create */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Trending Now</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            </div>
            <Link href="/dashboard/trending" style={{ fontSize: 12, color: '#F59E0B', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { tag: '#LagosTech', pct: '+847%', platform: 'TK', color: '#69C9D0' },
              { tag: '#NaijaFood', pct: '+312%', platform: 'IG', color: '#E1306C' },
              { tag: 'Afrobeats Remix', pct: '+289%', platform: 'TK', color: '#69C9D0' },
              { tag: '#AfricanFashionWeek', pct: '+189%', platform: 'IG', color: '#E1306C' },
            ].map(t => (
              <Link key={t.tag} href={`/dashboard/studio?trend=${encodeURIComponent(t.tag)}`} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                borderRadius: 10, background: 'rgba(255,255,255,0.03)', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.15s',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${t.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: t.color, flexShrink: 0 }}>{t.platform}</div>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#fff' }}>{t.tag}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>{t.pct}</span>
                <span style={{ fontSize: 10, color: '#F59E0B' }}>Create →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Usage limits */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Usage this period</span>
          <Link href="/dashboard/pricing" style={{ fontSize: 12, color: '#F59E0B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Upgrade</span><span>↗</span>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { label: 'Videos', used: usage.videosUsed, limit: usage.videosLimit, pct: videoPct, color: '#F59E0B' },
            { label: 'Images', used: usage.imagesUsed, limit: usage.imagesLimit, pct: imagePct, color: '#8B5CF6' },
            { label: 'Social accounts', used: usage.accountsConnected, limit: usage.accountsLimit, pct: Math.round((usage.accountsConnected / usage.accountsLimit) * 100), color: '#10B981' },
          ].map(u => (
            <div key={u.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                <span>{u.label}</span>
                <span style={{ color: u.pct > 80 ? '#EF4444' : 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{u.used.toLocaleString()} / {u.limit}</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(u.pct, 100)}%`, background: u.pct > 80 ? '#EF4444' : u.color, borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
              {u.pct > 80 && <div style={{ fontSize: 10, color: '#EF4444', marginTop: 4 }}>⚠ {100 - u.pct}% remaining — consider upgrading</div>}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
    </div>
  )
}
