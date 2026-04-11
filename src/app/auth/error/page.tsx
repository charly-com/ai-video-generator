'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AuthErrorInner() {
  const params = useSearchParams()
  const error = params.get('error')
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-base)' }}>
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="font-syne font-700 text-[22px] text-white mb-2">Authentication error</h1>
        <p className="text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
          {error ?? 'Something went wrong during sign in.'}
        </p>
        <Link href="/auth/login">
          <button className="btn-brand px-6 py-3 text-[14px]">Try again</button>
        </Link>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorInner />
    </Suspense>
  )
}
