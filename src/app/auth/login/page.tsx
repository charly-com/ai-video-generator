'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setLoading('google')
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading('password')
    setError('')
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(null)
    if (res?.error) {
      setError('Invalid email or password')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#07070F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000' }}>V</div>
        <span style={{ fontWeight: 900, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>ViralKit</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Sign in to your ViralKit studio</p>
        </div>

        <button onClick={handleGoogle} disabled={!!loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 16, fontFamily: 'inherit', transition: 'all 0.15s', opacity: loading === 'google' ? 0.7 : 1 }}>
          {loading === 'google' ? '⏳ Signing in...' : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <form onSubmit={handlePassword}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" autoComplete="email" required
            style={{ width: '100%', padding: '13px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" autoComplete="current-password" required
            style={{ width: '100%', padding: '13px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 12 }} />
          {error && (
            <div style={{ padding: '10px 12px', marginBottom: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#EF4444', fontSize: 13 }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={!email.trim() || !password || !!loading}
            style={{ width: '100%', padding: '14px', borderRadius: 12, background: email.trim() && password ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : 'rgba(255,255,255,0.05)', border: 'none', color: email.trim() && password ? '#000' : 'rgba(255,255,255,0.3)', fontSize: 15, fontWeight: 700, cursor: email.trim() && password ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            {loading === 'password' ? '⏳ Signing in...' : 'Sign in →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: '#F59E0B', fontWeight: 600, textDecoration: 'none' }}>Sign up free →</Link>
        </p>
      </div>
    </div>
  )
}
