'use client'
// src/app/dashboard/social/page.tsx

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { CheckCircle2, Plus, Trash2, Globe, AlertCircle } from 'lucide-react'
import { getPlatformColor } from '../../../lib/utils'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

const PLATFORMS = [
  { id: 'youtube',   name: 'YouTube',    emoji: '▶️', desc: 'Upload videos directly',           tier: 'basic' },
  { id: 'instagram', name: 'Instagram',  emoji: '📸', desc: 'Posts, Reels & Stories',           tier: 'free'  },
  { id: 'tiktok',    name: 'TikTok',     emoji: '🎵', desc: 'Short-form video upload',          tier: 'basic' },
  { id: 'twitter',   name: 'X / Twitter',emoji: '🐦', desc: 'Tweets with media',               tier: 'free'  },
  { id: 'linkedin',  name: 'LinkedIn',   emoji: '💼', desc: 'Professional content',             tier: 'basic' },
  { id: 'facebook',  name: 'Facebook',   emoji: '👤', desc: 'Pages & Reels',                   tier: 'pro'   },
]

interface SocialAccount {
  id: string
  platform: string
  username: string
  displayName: string
  profileImageUrl?: string
  followers?: number
}

function SocialPageInner() {
  const [accounts, setAccounts]     = useState<SocialAccount[]>([])
  const [loading, setLoading]       = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    load()
    const connected = searchParams.get('connected')
    const error     = searchParams.get('error')
    if (connected) toast.success(`${connected} connected! 🎉`)
    if (error)     toast.error(`Connection failed: ${error}`)
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res  = await fetch('/api/social/accounts')
      const json = await res.json()
      if (json.success) setAccounts(json.data)
    } catch { toast.error('Failed to load accounts') }
    setLoading(false)
  }

  async function connect(platformId: string) {
    setConnecting(platformId)
    try {
      const res  = await fetch('/api/social/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: platformId }),
      })
      const json = await res.json()
      if (json.success) window.location.href = json.data.url
      else toast.error(json.error)
    } catch { toast.error('Failed to start connection') }
    setConnecting(null)
  }

  async function disconnect(id: string, platform: string) {
    if (!confirm(`Disconnect ${platform}?`)) return
    try {
      await fetch(`/api/social/accounts?id=${id}`, { method: 'DELETE' })
      setAccounts(prev => prev.filter(a => a.id !== id))
      toast.success('Account disconnected')
    } catch { toast.error('Failed to disconnect') }
  }

  const connectedPlatforms = new Set(accounts.map(a => a.platform))

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-4 pt-5 pb-24 sm:px-6 sm:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-700 text-[22px] text-white">Social Accounts</h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {accounts.length} connected
          </p>
        </div>
        <span className="badge badge-green"><Globe size={10} /> {accounts.length}/5 slots</span>
      </div>

      {/* Connected accounts */}
      {accounts.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {accounts.map((acc, i) => (
            <div key={acc.id} className={`flex items-center gap-3 p-4 ${i > 0 ? 'border-t' : ''}`}
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${getPlatformColor(acc.platform)}20` }}>
                {PLATFORMS.find(p => p.id === acc.platform)?.emoji ?? '🌐'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-600 text-white">{acc.displayName || acc.username}</p>
                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  @{acc.username}
                  {acc.followers && <> · {acc.followers.toLocaleString()} followers</>}
                </p>
              </div>
              <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
              <button onClick={() => disconnect(acc.id, acc.platform)}
                className="btn-ghost p-2 rounded-lg text-red-400 hover:bg-red-500/10">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* All platforms */}
      <p className="text-[12px] font-600 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Add Platform</p>
      <div className="space-y-2">
        {PLATFORMS.map(p => {
          const isConnected  = connectedPlatforms.has(p.id)
          const isConnecting = connecting === p.id
          return (
            <div key={p.id} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${getPlatformColor(p.id)}15` }}>
                {p.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-600 text-white">{p.name}</span>
                  {p.tier !== 'free' && (
                    <span className={`badge text-[9px] py-0 ${p.tier === 'pro' ? 'badge-purple' : 'badge-cyan'}`}>{p.tier.toUpperCase()}</span>
                  )}
                </div>
                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
              </div>
              {isConnected ? (
                <span className="badge badge-green"><CheckCircle2 size={10} /> Connected</span>
              ) : (
                <button onClick={() => connect(p.id)} disabled={isConnecting}
                  className="btn-brand px-4 py-2 text-[12px] flex items-center gap-1.5 disabled:opacity-50">
                  {isConnecting ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={12} />}
                  Connect
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* API Keys info box */}
      <div className="rounded-2xl p-4 flex gap-3" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
        <AlertCircle size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-600 text-white mb-1">OAuth credentials required</p>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Each platform needs API keys in your <code className="text-orange-400">.env</code>. See the README for step-by-step setup for each platform&apos;s developer console.
          </p>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading…</div>}
    </div>
  )
}

export default function SocialPage() {
  return (
    <Suspense>
      <SocialPageInner />
    </Suspense>
  )
}
