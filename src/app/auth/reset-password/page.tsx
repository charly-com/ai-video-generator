'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordInner() {
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const json = await res.json()
      if (json.success) {
        setDone(true)
        setTimeout(() => router.push('/auth/login'), 3000)
      } else {
        setError(json.error ?? 'Reset failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (!token) {
    return (
      <div style={{ textAlign: 'center', color: '#fff', padding: '40px 20px' }}>
        <p style={{ color: '#EF4444' }}>Invalid reset link. <Link href="/auth/forgot-password" style={{ color: '#F59E0B' }}>Request a new one</Link>.</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07070F', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000', margin: '0 auto 20px' }}>V</div>
          {done ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <h1 style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 8 }}>Password updated!</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Redirecting you to sign in…</p>
            </>
          ) : (
            <>
              <h1 style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 8 }}>Set new password</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Choose a strong password for your account.</p>
            </>
          )}
        </div>

        {!done && (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="New password (min 6 chars)"
              style={{ padding: '13px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            <input
              type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              placeholder="Confirm new password"
              style={{ padding: '13px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            {error && <p style={{ color: '#EF4444', fontSize: 13 }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 15, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
          <Link href="/auth/login" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>← Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetPasswordInner /></Suspense>
}
