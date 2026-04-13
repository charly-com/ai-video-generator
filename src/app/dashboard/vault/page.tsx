'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface ContentItem {
  id: string
  type: 'video' | 'image'
  status: 'ready' | 'generating' | 'failed' | 'published'
  prompt: string
  model: string
  fileUrl?: string
  aspectRatio: string
  createdAt: string
}

const STATUS_COLOR: Record<string, string> = {
  ready: '#22c55e',
  generating: '#F59E0B',
  failed: '#ef4444',
  published: '#8b5cf6',
}

export default function VaultPage() {
  const [items, setItems]   = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'video' | 'image'>('all')
  const [total, setTotal]   = useState(0)

  useEffect(() => { load() }, [filter])

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '40' })
      if (filter !== 'all') params.set('type', filter)
      const res  = await fetch(`/api/content?${params}`)
      const json = await res.json()
      if (json.success) { setItems(json.data.items); setTotal(json.data.total) }
    } catch { toast.error('Failed to load') }
    setLoading(false)
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this item?')) return
    await fetch(`/api/content?id=${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Deleted')
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 1000, margin: '0 auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>Content Vault</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{total} items saved</p>
        </div>
        <Link href="/dashboard/studio" style={{ padding: '9px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          + Create
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {(['all', 'video', 'image'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: filter === f ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? '#F59E0B' : 'rgba(255,255,255,0.4)' }}>
            {f === 'all' ? 'All' : f === 'video' ? '🎬 Videos' : '🖼️ Images'}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>Loading…</div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗄️</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>No content yet</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', marginBottom: 20 }}>Generate videos and images in the Studio</p>
          <Link href="/dashboard/studio" style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Open Studio →
          </Link>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{ borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {/* Preview */}
            <div style={{ height: 140, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {item.fileUrl && item.type === 'video' ? (
                <video src={item.fileUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
              ) : item.fileUrl && item.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.fileUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 36, opacity: 0.3 }}>{item.type === 'video' ? '🎬' : '🖼️'}</span>
              )}
              {/* Status badge */}
              <span style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                background: `${STATUS_COLOR[item.status]}22`, color: STATUS_COLOR[item.status] }}>
                {item.status}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: '10px 12px' }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.prompt}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: '4px 0 10px' }}>
                {item.model} · {item.aspectRatio} · {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {item.status === 'ready' && item.fileUrl && (
                  <a href={item.fileUrl} download style={{ flex: 1, padding: '6px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B', fontSize: 11, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                    ⬇ Download
                  </a>
                )}
                {item.status === 'ready' && (
                  <Link href="/dashboard/publish" style={{ flex: 1, padding: '6px', borderRadius: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8b5cf6', fontSize: 11, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                    📤 Publish
                  </Link>
                )}
                <button onClick={() => deleteItem(item.id)}
                  style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
