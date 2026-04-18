'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'

function VerifyEmailInner() {
  const params = useSearchParams()
  const success = params.get('success') === '1'
  const error = params.get('error')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [email, setEmail] = useState('')

  async function resend() {
    if (!email) return
    setResending(true)
    await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setResending(false)
    setResent(true)
  }

  const isExpired = error === 'expired'
  const isInvalid = error === 'invalid' || error === 'missing'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07070F', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000', margin: '0 auto 24px' }}>V</div>

        {success && (
          <>
            <div style={{ fontSize: 44, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 10 }}>Email verified!</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>Your ViralKit account is now active. Start creating viral content.</p>
            <Link href="/auth/login" style={{ display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 800, borderRadius: 12, textDecoration: 'none', fontSize: 14 }}>
              Sign in →
            </Link>
          </>
        )}

        {!success && !error && (
          <>
            <div style={{ fontSize: 44, marginBottom: 16 }}>📧</div>
            <h1 style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 10 }}>Check your email</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>We sent a verification link to your email address. Click the link to activate your account.</p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 20 }}>Didn't get it? Check your spam folder.</p>
          </>
        )}

        {(isExpired || isInvalid) && (
          <>
            <div style={{ fontSize: 44, marginBottom: 16 }}>{isExpired ? '⏰' : '❌'}</div>
            <h1 style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 10 }}>
              {isExpired ? 'Link expired' : 'Invalid link'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
              {isExpired ? 'Verification links expire after 24 hours.' : 'This verification link is not valid.'} Enter your email to get a new one.
            </p>
            {!resent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' }}
                />
                <button onClick={resend} disabled={resending || !email}
                  style={{ padding: '13px', borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 14, opacity: resending ? 0.6 : 1 }}>
                  {resending ? 'Sending…' : 'Resend verification email'}
                </button>
              </div>
            ) : (
              <p style={{ color: '#10B981', fontSize: 14 }}>✓ New verification email sent! Check your inbox.</p>
            )}
          </>
        )}

        <p style={{ marginTop: 28, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          <Link href="/auth/login" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>← Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyEmailInner /></Suspense>
}
