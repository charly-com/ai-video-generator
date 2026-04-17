'use client'

import { useState, useEffect, useCallback } from 'react'

type Tab = 'overview' | 'users' | 'content'

interface Stats {
  users: { total: number; last30Days: number; last7Days: number }
  content: { total: number; last7Days: number }
  subscriptions: { active: number; byPlan: Array<{ plan: string; count: number }> }
  ai: { generationsLast30Days: number; estimatedCostLast30DaysUsd: number }
  publishing: { totalPublished: number }
}

interface AdminUser {
  id: string
  email: string
  name: string | null
  image: string | null
  isAdmin: boolean
  createdAt: string
  subscription: { plan: string; status: string } | null
  _count: { generatedContent: number; publishJobs: number; socialAccounts: number }
}

interface AdminContent {
  id: string
  type: string
  status: string
  model: string
  prompt: string
  fileUrl: string | null
  thumbnailUrl: string | null
  createdAt: string
  user: { id: string; email: string; name: string | null }
}

const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14,
  padding: 20,
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>Admin Dashboard</h1>
          <span style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#a855f7', fontSize: 11, fontWeight: 700 }}>👑 ADMIN</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Manage users, monitor usage, and view platform-wide activity.</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 2 }}>
        {(['overview', 'users', 'content'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '9px 18px', borderRadius: 10, border: 'none',
              background: tab === t ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: tab === t ? '#F59E0B' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
            }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'content' && <ContentTab />}
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(json => {
        if (json.success) setStats(json.data)
        else setError(json.error ?? 'Failed to load stats')
      })
      .catch(e => setError(e.message))
  }, [])

  if (error) return <ErrorBlock message={error} />
  if (!stats) return <LoadingBlock label="Loading stats..." />

  const cards = [
    { label: 'Total users', value: stats.users.total, sub: `+${stats.users.last7Days} this week`, color: '#F59E0B' },
    { label: 'Active subs', value: stats.subscriptions.active, sub: `${stats.users.last30Days} new users in 30d`, color: '#10B981' },
    { label: 'Generated assets', value: stats.content.total, sub: `+${stats.content.last7Days} this week`, color: '#a855f7' },
    { label: 'Published posts', value: stats.publishing.totalPublished, sub: 'all time', color: '#3b82f6' },
    { label: 'AI generations (30d)', value: stats.ai.generationsLast30Days, sub: `$${stats.ai.estimatedCostLast30DaysUsd.toFixed(2)} est. cost`, color: '#EC4899' },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        {cards.map(c => (
          <div key={c.label} style={CARD}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: c.color, marginBottom: 6, letterSpacing: '-0.02em' }}>
              {typeof c.value === 'number' ? c.value.toLocaleString() : c.value}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={CARD}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Subscriptions by plan</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stats.subscriptions.byPlan.map(p => {
            const pct = stats.subscriptions.active > 0 ? (p.count / stats.subscriptions.active) * 100 : 0
            return (
              <div key={p.plan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>{p.plan}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{p.count} ({pct.toFixed(0)}%)</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#F59E0B,#EF4444)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Users ────────────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '25' })
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/users?${params.toString()}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setUsers(json.data)
      setPages(json.pagination.pages)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { void load() }, [load])

  async function toggleAdmin(u: AdminUser) {
    if (!confirm(`${u.isAdmin ? 'Revoke' : 'Grant'} admin for ${u.email}?`)) return
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: u.id, isAdmin: !u.isAdmin }),
    })
    if (res.ok) void load()
  }

  async function changePlan(u: AdminUser) {
    const plan = prompt('New plan (free, basic, pro, agency):', u.subscription?.plan ?? 'free')
    if (!plan) return
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: u.id, plan }),
    })
    if (res.ok) void load()
  }

  async function deleteUser(u: AdminUser) {
    if (!confirm(`Delete ${u.email}? This also removes all their content.`)) return
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: u.id }),
    })
    if (res.ok) void load()
    else {
      const json = await res.json()
      alert(json.error ?? 'Delete failed')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by email or name..."
          style={{ flex: 1, padding: '9px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none' }} />
      </div>

      {error && <ErrorBlock message={error} />}
      {loading && users.length === 0 && <LoadingBlock label="Loading users..." />}

      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['User', 'Plan', 'Content', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000' }}>
                      {(u.name?.[0] ?? u.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {u.name ?? u.email.split('@')[0]}
                        {u.isAdmin && <span style={{ fontSize: 9, color: '#a855f7', fontWeight: 700 }}>👑 ADMIN</span>}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', textTransform: 'capitalize' }}>
                  <span style={{ padding: '3px 9px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontSize: 11, fontWeight: 700 }}>
                    {u.subscription?.plan ?? 'free'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.5)' }}>
                  {u._count.generatedContent} assets · {u._count.publishJobs} posts
                </td>
                <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.5)' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => toggleAdmin(u)}
                      style={{ padding: '4px 9px', borderRadius: 6, border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.08)', color: '#a855f7', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      {u.isAdmin ? 'Revoke' : 'Make admin'}
                    </button>
                    <button onClick={() => changePlan(u)}
                      style={{ padding: '4px 9px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.08)', color: '#F59E0B', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      Plan
                    </button>
                    <button onClick={() => deleteUser(u)}
                      style={{ padding: '4px 9px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <Pagination page={page} pages={pages} onChange={setPage} />
      )}
    </div>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

function ContentTab() {
  const [content, setContent] = useState<AdminContent[]>([])
  const [status, setStatus] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '25' })
      if (status) params.set('status', status)
      const res = await fetch(`/api/admin/content?${params.toString()}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setContent(json.data)
      setPages(json.pagination.pages)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => { void load() }, [load])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {['', 'ready', 'generating', 'failed', 'pending'].map(s => (
          <button key={s || 'all'} onClick={() => { setStatus(s); setPage(1) }}
            style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid',
              borderColor: status === s ? '#F59E0B' : 'rgba(255,255,255,0.08)',
              background: status === s ? 'rgba(245,158,11,0.1)' : 'transparent',
              color: status === s ? '#F59E0B' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {error && <ErrorBlock message={error} />}
      {loading && content.length === 0 && <LoadingBlock label="Loading content..." />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {content.map(c => (
          <div key={c.id} style={CARD}>
            {c.fileUrl && c.type === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.thumbnailUrl ?? c.fileUrl} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
            )}
            {c.fileUrl && c.type === 'video' && (
              <video src={c.fileUrl} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, marginBottom: 10, background: '#000' }} />
            )}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 8px', borderRadius: 20, background: 'rgba(168,85,247,0.1)', color: '#a855f7', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{c.type}</span>
              <span style={{ padding: '3px 8px', borderRadius: 20, background: statusColor(c.status).bg, color: statusColor(c.status).fg, fontSize: 10, fontWeight: 700 }}>
                {c.status}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 8, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {c.prompt}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {c.user.email} · {c.model} · {new Date(c.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && <Pagination page={page} pages={pages} onChange={setPage} />}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(s: string): { bg: string; fg: string } {
  if (s === 'ready') return { bg: 'rgba(16,185,129,0.1)', fg: '#10B981' }
  if (s === 'failed') return { bg: 'rgba(239,68,68,0.1)', fg: '#EF4444' }
  if (s === 'generating') return { bg: 'rgba(245,158,11,0.1)', fg: '#F59E0B' }
  return { bg: 'rgba(255,255,255,0.05)', fg: 'rgba(255,255,255,0.5)' }
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
      <div style={{ fontSize: 13 }}>{label}</div>
    </div>
  )
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#EF4444', fontSize: 13, marginBottom: 14 }}>
      {message}
    </div>
  )
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
        style={btnStyle(page === 1)}>← Prev</button>
      <div style={{ padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        Page {page} of {pages}
      </div>
      <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages}
        style={btnStyle(page === pages)}>Next →</button>
    </div>
  )
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '6px 14px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: disabled ? 'rgba(255,255,255,0.2)' : '#fff',
    fontSize: 12, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
}
