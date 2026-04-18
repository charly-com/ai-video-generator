'use client'
// src/app/dashboard/profile/page.tsx

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Trophy, Settings, LogOut, Crown, Zap, Shield, KeyRound, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { BADGES, LEVELS, getLevel, getLevelProgress } from '../../../lib/gamification/system'
import { getInitials } from '../../../lib/utils'
import Link from 'next/link'

interface StreakData {
  current: number; longest: number; totalXp: number
  badges: Array<{ badgeId: string; earnedAt: string }>
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [plan, setPlan]     = useState('free')

  const [showChangePw, setShowChangePw]   = useState(false)
  const [currentPw, setCurrentPw]         = useState('')
  const [newPw, setNewPw]                 = useState('')
  const [confirmPw, setConfirmPw]         = useState('')
  const [pwLoading, setPwLoading]         = useState(false)
  const [pwError, setPwError]             = useState('')
  const [pwSuccess, setPwSuccess]         = useState(false)
  const [showCurrent, setShowCurrent]     = useState(false)
  const [showNew, setShowNew]             = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)

  async function handleChangePw(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)
    if (newPw !== confirmPw) { setPwError('New passwords do not match'); return }
    if (newPw.length < 6) { setPwError('Password must be at least 6 characters'); return }
    setPwLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      const json = await res.json()
      if (!json.success) { setPwError(json.error ?? 'Failed to update password'); return }
      setPwSuccess(true)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => { setPwSuccess(false); setShowChangePw(false) }, 2500)
    } catch {
      setPwError('Something went wrong. Please try again.')
    }
    setPwLoading(false)
  }

  useEffect(() => {
    fetch('/api/gamification/streak').then(r => r.json()).then(j => {
      if (j.success) setStreak(j.data)
    })
    fetch('/api/billing').then(r => r.json()).then(j => {
      if (j.success) setPlan(j.data?.subscription?.plan ?? 'free')
    })
  }, [])

  const xp    = streak?.totalXp ?? 0
  const level = getLevel(xp)
  const prog  = getLevelProgress(xp)
  const earnedBadgeIds = new Set(streak?.badges?.map(b => b.badgeId) ?? [])

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-4 pt-5 pb-24 sm:px-6 sm:pt-6">
      {/* Profile card */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="relative">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-syne font-800 text-[22px]"
                style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)', color: '#fff' }}>
                {getInitials(session?.user?.name ?? 'You')}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center text-[12px]"
              style={{ background: 'var(--bg-base)', border: '2px solid var(--bg-card)' }}>
              {level.emoji}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-syne font-700 text-[18px] text-white truncate">{session?.user?.name ?? 'Creator'}</p>
            <p className="text-[13px] truncate" style={{ color: 'var(--text-secondary)' }}>{session?.user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge text-[10px] ${plan === 'pro' || plan === 'agency' ? 'badge-purple' : plan === 'basic' ? 'badge-orange' : 'badge-gray'}`}>
                {plan.toUpperCase()}
              </span>
              <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{level.title}</span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[12px] mb-1.5">
            <span style={{ color: 'var(--text-secondary)' }}>Level {level.level} · {xp.toLocaleString()} XP</span>
            <span style={{ color: 'var(--text-muted)' }}>Level {level.level + 1}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${prog}%` }} />
          </div>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{level.perks[0]}</p>
        </div>
      </div>

      {/* Streak */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Current streak', value: streak?.current ?? 0, suffix: 'd', icon: '🔥' },
          { label: 'Longest streak', value: streak?.longest ?? 0, suffix: 'd', icon: '⚡' },
          { label: 'Total XP',       value: xp, suffix: '',  icon: '⭐' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-syne font-700 text-[20px] text-white">{s.value.toLocaleString()}{s.suffix}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-syne font-600 text-[14px] text-white">Badges <span className="text-orange-400">{earnedBadgeIds.size}</span>/{Object.keys(BADGES).length}</p>
          <Trophy size={16} className="text-orange-400" />
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {Object.values(BADGES).map(badge => {
            const earned = earnedBadgeIds.has(badge.id)
            return (
              <div key={badge.id} title={`${badge.name}: ${badge.description}`}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center transition-all ${earned ? '' : 'opacity-25 grayscale'}`}
                style={{ background: earned ? 'var(--bg-elevated)' : 'var(--bg-input)', border: `1px solid ${earned ? 'rgba(249,115,22,0.2)' : 'var(--border)'}` }}>
                <span className="text-xl">{badge.emoji}</span>
                <span className="text-[8px] mt-0.5 px-1 leading-tight" style={{ color: 'var(--text-muted)' }}>{badge.name.split(' ')[0]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Level roadmap */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="font-syne font-600 text-[14px] text-white mb-3">Creator Levels</p>
        <div className="space-y-2">
          {LEVELS.slice(0, 5).map(l => (
            <div key={l.level} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${l.level === level.level ? 'border border-orange-500/30 bg-orange-500/5' : ''}`}>
              <span className="text-[20px] w-8 text-center">{l.emoji}</span>
              <div className="flex-1">
                <p className={`text-[13px] font-600 ${l.level <= level.level ? 'text-white' : ''}`} style={{ color: l.level <= level.level ? undefined : 'var(--text-muted)' }}>
                  Lv.{l.level} {l.title}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{l.xpRequired.toLocaleString()} XP · {l.perks[0]}</p>
              </div>
              {l.level <= level.level && <Zap size={14} className="text-orange-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <button
          onClick={() => { setShowChangePw(!showChangePw); setPwError(''); setPwSuccess(false) }}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors">
          <KeyRound size={15} className="text-cyan-400" />
          <span className="text-[14px] flex-1 text-left" style={{ color: 'var(--text-secondary)' }}>Change Password</span>
          <ChevronDown size={14} className={`transition-transform ${showChangePw ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
        </button>

        {showChangePw && (
          <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--border)' }}>
            {pwSuccess ? (
              <p className="text-[13px] text-green-400 py-3 text-center">✓ Password updated successfully!</p>
            ) : (
              <form onSubmit={handleChangePw} className="space-y-2 pt-3">
                {/* Current password */}
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                    placeholder="Current password" required autoComplete="current-password"
                    className="input-dark w-full px-3 py-2.5 text-[14px] pr-10" />
                  <button type="button" onClick={() => setShowCurrent(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* New password */}
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
                    placeholder="New password (min 6 chars)" required autoComplete="new-password"
                    className="input-dark w-full px-3 py-2.5 text-[14px] pr-10" />
                  <button type="button" onClick={() => setShowNew(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Confirm new password */}
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Confirm new password" required autoComplete="new-password"
                    className="input-dark w-full px-3 py-2.5 text-[14px] pr-10" />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {pwError && (
                  <p className="text-[12px] text-red-400 px-1">{pwError}</p>
                )}
                <button type="submit" disabled={pwLoading || !currentPw || !newPw || !confirmPw}
                  className="btn-brand w-full py-2.5 text-[13px] disabled:opacity-50">
                  {pwLoading ? 'Updating…' : 'Update password'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Settings links */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {[
          { icon: <Crown size={15} />, label: 'Upgrade Plan', href: '/dashboard/pricing', color: 'text-orange-400' },
          { icon: <Shield size={15} />, label: 'Privacy Policy', href: '/privacy', color: 'text-cyan-400' },
          { icon: <Settings size={15} />, label: 'Terms of Service', href: '/terms', color: 'text-gray-400' },
        ].map((item, i) => (
          <Link key={i} href={item.href}>
            <div className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-t' : ''} hover:bg-white/3 transition-colors cursor-pointer`}
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <span className={item.color}>{item.icon}</span>
              <span className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              <span className="ml-auto text-[12px]" style={{ color: 'var(--text-muted)' }}>→</span>
            </div>
          </Link>
        ))}
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className={`w-full flex items-center gap-3 px-4 py-3.5 border-t hover:bg-red-500/5 transition-colors`}
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <LogOut size={15} className="text-red-400" />
          <span className="text-[14px] text-red-400">Sign out</span>
        </button>
      </div>
    </div>
  )
}
