'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07070F', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000', margin: '0 auto 20px' }}>V</div>
          {!sent ? (
            <>
              <h1 style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 8 }}>Forgot password?</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7 }}>Enter your email and we'll send you a reset link.</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
              <h1 style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 8 }}>Check your inbox</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7 }}>If an account exists for <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{email}</strong>, we've sent a password reset link. It expires in 1 hour.</p>
            </>
          )}
        </div>

        {!sent && (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="your@email.com"
              style={{ padding: '13px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            {error && <p style={{ color: '#EF4444', fontSize: 13 }}>{error}</p>}
            <button type="submit" disabled={loading || !email}
              style={{ padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 15, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Sending…' : 'Send reset link'}
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
