'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setLoading('google')
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading('register')
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined, email, password }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Registration failed')
      }

      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (signInRes?.error) {
        setError('Account created but sign-in failed. Try logging in.')
        setLoading(null)
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#07070F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000' }}>V</div>
        <span style={{ fontWeight: 900, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>ViralKit</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Start generating viral content in minutes</p>
        </div>

        <button onClick={handleGoogle} disabled={!!loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 16, fontFamily: 'inherit' }}>
          {loading === 'google' ? '⏳ Signing in...' : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>or sign up with email</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <form onSubmit={handleRegister}>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Your name (optional)" autoComplete="name"
            style={{ width: '100%', padding: '13px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }} />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" autoComplete="email" required
            style={{ width: '100%', padding: '13px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password (6+ chars)" autoComplete="new-password" required minLength={6}
            style={{ width: '100%', padding: '13px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }} />
          {error && (
            <div style={{ padding: '10px 12px', marginBottom: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#EF4444', fontSize: 13 }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={!email.trim() || !password || !!loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, background: email.trim() && password ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : 'rgba(255,255,255,0.05)', border: 'none', color: email.trim() && password ? '#000' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 700, cursor: email.trim() && password ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
            {loading === 'register' ? '⏳ Creating...' : 'Create account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#F59E0B', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
