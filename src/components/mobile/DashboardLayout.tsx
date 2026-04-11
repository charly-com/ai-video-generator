'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

// Bottom nav items for mobile
const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Home', match: /^\/dashboard$/ },
  { href: '/dashboard/studio', icon: '🎬', label: 'Studio', match: /\/studio/ },
  { href: '/dashboard/trending', icon: '🔥', label: 'Trending', match: /\/trending/ },
  { href: '/dashboard/calendar', icon: '📅', label: 'Calendar', match: /\/calendar/ },
  { href: '/dashboard/vault', icon: '🗄️', label: 'Vault', match: /\/vault/ },
]

const SIDEBAR_ITEMS = [
  { section: 'Create', items: [
    { href: '/dashboard/studio', icon: '🎬', label: 'Video Studio', badge: 'AI' },
    { href: '/dashboard/studio/image', icon: '🖼️', label: 'Image Studio', badge: 'AI' },
    { href: '/dashboard/brand-kit', icon: '🎨', label: 'Brand Kit' },
  ]},
  { section: 'Grow', items: [
    { href: '/dashboard/trending', icon: '🔥', label: 'Trend Radar', badge: 'LIVE' },
    { href: '/dashboard/calendar', icon: '📅', label: 'Content Calendar' },
    { href: '/dashboard/publish', icon: '📤', label: 'Publish Queue' },
  ]},
  { section: 'Analyze', items: [
    { href: '/dashboard/analytics', icon: '📊', label: 'Analytics' },
    { href: '/dashboard/vault', icon: '🗄️', label: 'Content Vault' },
    { href: '/dashboard/social', icon: '🔗', label: 'Social Accounts' },
  ]},
  { section: 'Earn', items: [
    { href: '/dashboard/challenges', icon: '🏆', label: 'Challenges', badge: '3' },
    { href: '/dashboard/pricing', icon: '💎', label: 'Upgrade Plan' },
  ]},
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [streak, setStreak] = useState(14)
  const [xp, setXP] = useState(2840)

  // Close sidebar when route changes
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  const pageTitle = getPageTitle(pathname)

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#07070F', color: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", overflow: 'hidden' }}>

      {/* Desktop Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, background: '#0a0a14', borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column',
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        position: 'relative',
      }} className="desktop-sidebar">

        {/* Logo */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#000', flexShrink: 0 }}>V</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: '-0.02em' }}>ViralMint</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Basic Plan</div>
          </div>
        </div>

        {/* Streak bar */}
        <div style={{ margin: '10px 12px', padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>{streak}-day streak</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>🏆 {xp.toLocaleString()} XP</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(streak % 30) / 30 * 100}%`, background: 'linear-gradient(90deg,#F59E0B,#EF4444)', borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {SIDEBAR_ITEMS.map(section => (
            <div key={section.section} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 4 }}>{section.section}</div>
              {section.items.map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
                    textDecoration: 'none', marginBottom: 2, transition: 'all 0.15s',
                    background: active ? 'rgba(245,158,11,0.12)' : 'transparent',
                    color: active ? '#F59E0B' : 'rgba(255,255,255,0.5)',
                  }}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ fontSize: 9, background: active ? '#F59E0B' : 'rgba(255,255,255,0.1)', color: active ? '#000' : 'rgba(255,255,255,0.4)', padding: '2px 5px', borderRadius: 10, fontWeight: 700 }}>{item.badge}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#000', flexShrink: 0 }}>CK</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Charly K.</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>32/50 videos used</div>
            </div>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.7)', fontSize: 12, fontWeight: 500 }}
          >
            <span style={{ fontSize: 14 }}>↪</span> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sliding sidebar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, zIndex: 50,
        background: '#0a0a14', borderRight: '1px solid rgba(255,255,255,0.05)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }} className="mobile-sidebar">
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#000' }}>V</div>
            <span style={{ fontWeight: 900, fontSize: 16 }}>ViralMint</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>

        <div style={{ margin: '10px 12px', padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>{streak}-day streak</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>🏆 {xp.toLocaleString()} XP · Grinder rank</div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {SIDEBAR_ITEMS.map(section => (
            <div key={section.section} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 4 }}>{section.section}</div>
              {section.items.map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                    textDecoration: 'none', marginBottom: 3, transition: 'all 0.15s',
                    background: active ? 'rgba(245,158,11,0.12)' : 'transparent',
                    color: active ? '#F59E0B' : 'rgba(255,255,255,0.5)',
                  }}>
                    <span style={{ fontSize: 17 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ fontSize: 10, background: active ? '#F59E0B' : 'rgba(255,255,255,0.1)', color: active ? '#000' : 'rgba(255,255,255,0.4)', padding: '2px 7px', borderRadius: 10, fontWeight: 700 }}>{item.badge}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: '0 12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link href="/dashboard/pricing" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            ✦ Upgrade to Pro
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            ↪ Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Mobile topbar */}
        <header style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 14px', background: '#0a0a14', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, gap: 12 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 20, cursor: 'pointer', padding: 4, lineHeight: 1, display: 'block' }} className="mobile-menu-btn">
            ☰
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageTitle}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '4px 8px' }}>
              <span style={{ fontSize: 12 }}>🔥</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>{streak}</span>
            </div>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', fontSize: 16 }}>🔔</button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav style={{
          height: 60, display: 'flex', alignItems: 'stretch',
          background: '#0a0a14', borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          flexShrink: 0,
        }} className="mobile-bottom-nav">
          {NAV_ITEMS.map(item => {
            const active = item.match.test(pathname)
            return (
              <Link key={item.href} href={item.href} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none', gap: 3, transition: 'all 0.15s',
                color: active ? '#F59E0B' : 'rgba(255,255,255,0.3)',
              }}>
                <span style={{ fontSize: 19, lineHeight: 1, filter: active ? 'none' : 'grayscale(0.5)' }}>{item.icon}</span>
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 400, letterSpacing: '0.02em' }}>{item.label}</span>
                {active && <div style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom) + 2px)', width: 4, height: 4, borderRadius: '50%', background: '#F59E0B' }} />}
              </Link>
            )
          })}
        </nav>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .mobile-sidebar { display: none !important; }
          .mobile-bottom-nav { display: none !important; }
          .mobile-menu-btn { display: none !important; }
          .desktop-sidebar { display: flex !important; }
        }
        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar { display: flex !important; flex-direction: column; }
          .mobile-bottom-nav { display: flex !important; position: relative; }
        }
      `}</style>
    </div>
  )
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/dashboard': '🏠 Dashboard',
    '/dashboard/studio': '🎬 Video Studio',
    '/dashboard/studio/image': '🖼️ Image Studio',
    '/dashboard/calendar': '📅 Content Calendar',
    '/dashboard/trending': '🔥 Trend Radar',
    '/dashboard/vault': '🗄️ Content Vault',
    '/dashboard/analytics': '📊 Analytics',
    '/dashboard/social': '🔗 Social Accounts',
    '/dashboard/challenges': '🏆 Challenges',
    '/dashboard/brand-kit': '🎨 Brand Kit',
    '/dashboard/publish': '📤 Publish Queue',
    '/dashboard/pricing': '💎 Upgrade Plan',
  }
  return titles[pathname] ?? 'ViralMint'
}