'use client'
// src/components/layout/MobileNav.tsx

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Video, Image, Send, BarChart3, Plus } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/studio/video', icon: Video, label: 'Video' },
  { href: '/dashboard/studio/image', icon: Image, label: 'Image' },
  { href: '/dashboard/publish', icon: Send, label: 'Queue' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Stats' },
]

export function MobileNav() {
  const pathname = usePathname()
  const [showQuick, setShowQuick] = useState(false)

  return (
    <>
      {/* Quick action overlay */}
      {showQuick && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setShowQuick(false)}>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            onClick={e => e.stopPropagation()}>
            <Link href="/dashboard/studio/video" onClick={() => setShowQuick(false)}>
              <button className="flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg font-syne font-600 text-[14px] animate-slide-up">
                <Video size={18} /> Generate Video
              </button>
            </Link>
            <Link href="/dashboard/studio/image" onClick={() => setShowQuick(false)}>
              <button className="flex items-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg font-syne font-600 text-[14px] animate-slide-up" style={{ animationDelay: '0.05s' }}>
                <Image size={18} /> Generate Image
              </button>
            </Link>
          </div>
        </div>
      )}

      <nav className="bottom-nav md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 2).map(item => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}

          {/* Center create button */}
          <button
            onClick={() => setShowQuick(!showQuick)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              showQuick
                ? 'bg-orange-600 rotate-45'
                : 'bg-gradient-to-br from-orange-500 to-pink-600 shadow-[0_4px_15px_rgba(249,115,22,0.4)]'
            }`}>
            <Plus size={22} className="text-white" />
          </button>

          {navItems.slice(2).map(item => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}
        </div>
      </nav>
    </>
  )
}

function NavItem({ href, icon: Icon, label, active }: {
  href: string; icon: React.ElementType; label: string; active: boolean
}) {
  return (
    <Link href={href}>
      <button className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
        active ? 'text-orange-400' : ''
      }`} style={{ color: active ? undefined : 'var(--text-muted)' }}>
        <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
        <span className={`text-[10px] font-600 ${active ? 'text-orange-400' : ''}`}>{label}</span>
        {active && <div className="w-1 h-1 rounded-full bg-orange-400" />}
      </button>
    </Link>
  )
}
