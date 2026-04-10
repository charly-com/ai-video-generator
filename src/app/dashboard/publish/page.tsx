'use client'
// src/app/dashboard/publish/page.tsx

import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle2, XCircle, Loader2, Send, Filter, RefreshCw, Globe } from 'lucide-react'
import { timeAgo, getPlatformEmoji, getPlatformColor } from '../../../../lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

type JobStatus = 'all' | 'scheduled' | 'published' | 'failed' | 'pending'

interface PublishJob {
  id: string
  status: string
  scheduledFor?: string
  publishedAt?: string
  caption?: string
  errorMessage?: string
  content: { type: string; fileUrl?: string; thumbnailUrl?: string; prompt: string }
  socialAccount: { platform: string; username: string; profileImageUrl?: string }
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  scheduled:  { label: 'Scheduled', color: 'badge-cyan',   icon: <Clock size={10} /> },
  published:  { label: 'Published', color: 'badge-green',  icon: <CheckCircle2 size={10} /> },
  failed:     { label: 'Failed',    color: 'badge-orange', icon: <XCircle size={10} /> },
  pending:    { label: 'Pending',   color: 'badge-purple', icon: <Loader2 size={10} /> },
  publishing: { label: 'Live…',     color: 'badge-cyan',   icon: <Loader2 size={10} className="animate-spin" /> },
}

export default function PublishPage() {
  const [jobs, setJobs]         = useState<PublishJob[]>([])
  const [filter, setFilter]     = useState<JobStatus>('all')
  const [loading, setLoading]   = useState(true)
  const [counts, setCounts]     = useState({ scheduled: 0, published: 0, failed: 0, pending: 0 })

  async function load() {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/publish' : `/api/publish?status=${filter}`
      const res = await fetch(url)
      const json = await res.json()
      if (json.success) {
        setJobs(json.data.items)
        // Count per status
        const allRes = await fetch('/api/publish')
        const allJson = await allRes.json()
        const all: PublishJob[] = allJson.data?.items ?? []
        setCounts({
          scheduled: all.filter(j => j.status === 'scheduled').length,
          published: all.filter(j => j.status === 'published').length,
          failed:    all.filter(j => j.status === 'failed').length,
          pending:   all.filter(j => j.status === 'pending').length,
        })
      }
    } catch { toast.error('Failed to load queue') }
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-700 text-[22px] text-white">Publish Queue</h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {counts.scheduled} scheduled · {counts.published} published
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost p-2.5 rounded-xl"><RefreshCw size={14} /></button>
          <Link href="/dashboard/studio/video">
            <button className="btn-brand px-4 py-2.5 text-[13px] flex items-center gap-1.5"><Send size={13} /> New post</button>
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['all', 'scheduled', 'published', 'failed'] as JobStatus[]).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-[13px] font-600 transition-all border ${
              filter === s
                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
            style={{ borderColor: filter === s ? undefined : 'var(--border)', background: filter === s ? undefined : 'var(--bg-card)' }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'all' && counts[s as keyof typeof counts] > 0 && (
              <span className="ml-1.5 text-[10px] opacity-70">{counts[s as keyof typeof counts]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Queue */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Globe size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-syne font-600 text-white mb-1">No posts yet</p>
          <p className="text-[13px] mb-4" style={{ color: 'var(--text-secondary)' }}>Create content and schedule it to your social accounts</p>
          <Link href="/dashboard/studio/video">
            <button className="btn-brand px-6 py-2.5 text-[13px]">Create content</button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => {
            const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.pending
            const platform = job.socialAccount.platform
            return (
              <div key={job.id} className="rounded-2xl p-4 flex gap-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {/* Thumb */}
                <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden"
                  style={{ background: 'var(--bg-elevated)' }}>
                  {job.content.thumbnailUrl
                    ? <img src={job.content.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    : <span>{job.content.type === 'video' ? '🎬' : '🖼️'}</span>
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-600 text-white truncate">{job.caption || job.content.prompt.slice(0, 60)}</p>
                    <span className={`badge ${cfg.color} flex-shrink-0`}>{cfg.icon}{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[12px] flex items-center gap-1" style={{ color: getPlatformColor(platform) }}>
                      {getPlatformEmoji(platform)} {job.socialAccount.username}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {job.scheduledFor
                        ? <><Clock size={10} className="inline mr-1" />{new Date(job.scheduledFor).toLocaleString()}</>
                        : job.publishedAt
                        ? <><CheckCircle2 size={10} className="inline mr-1" />{timeAgo(job.publishedAt)}</>
                        : 'Queued'
                      }
                    </span>
                  </div>
                  {job.errorMessage && (
                    <p className="text-[11px] mt-1 text-red-400 truncate">{job.errorMessage}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
