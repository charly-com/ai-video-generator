'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Consent = { essential: true; analytics: boolean; preferences: boolean }

const STORAGE_KEY = 'vk_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [preferences, setPreferences] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) setVisible(true)
    } catch {
      // localStorage blocked (private mode etc.) — don't show banner
    }
  }, [])

  function save(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    } catch {
      // ignore
    }
    setVisible(false)
  }

  function acceptAll() {
    save({ essential: true, analytics: true, preferences: true })
  }

  function rejectAll() {
    save({ essential: true, analytics: false, preferences: false })
  }

  function saveCustom() {
    save({ essential: true, analytics, preferences })
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)', zIndex: 9998,
          display: showDetails ? 'block' : 'none',
        }}
        onClick={() => setShowDetails(false)}
      />

      {/* Banner */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Cookie consent"
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 520,
          background: '#131320',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          zIndex: 9999,
          overflow: 'hidden',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* Main row */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>🍪</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 5px' }}>We use cookies</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
                We use essential cookies to keep you logged in, and optional cookies to improve your experience.{' '}
                <Link href="/privacy#cookie-policy" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 500 }}>
                  Learn more
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {showDetails && (
          <div style={{ padding: '0 20px', marginBottom: 8 }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
              <CookieRow
                label="Essential"
                description="Required for authentication and security. Always active."
                checked
                locked
              />
              <CookieRow
                label="Analytics"
                description="Help us understand how you use ViralKit so we can improve it."
                checked={analytics}
                onChange={setAnalytics}
              />
              <CookieRow
                label="Preferences"
                description="Remember your UI settings across sessions."
                checked={preferences}
                onChange={setPreferences}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ padding: '14px 20px 20px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={acceptAll}
            style={{
              flex: '1 1 120px', padding: '11px 16px', borderRadius: 10,
              background: 'linear-gradient(135deg,#F59E0B,#EF4444)',
              border: 'none', color: '#000', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em',
            }}
          >
            Accept all
          </button>

          {showDetails ? (
            <button
              onClick={saveCustom}
              style={{
                flex: '1 1 120px', padding: '11px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Save choices
            </button>
          ) : (
            <button
              onClick={() => setShowDetails(true)}
              style={{
                flex: '1 1 100px', padding: '11px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Manage
            </button>
          )}

          <button
            onClick={rejectAll}
            style={{
              padding: '11px 14px', borderRadius: 10,
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >
            Reject optional
          </button>
        </div>
      </div>
    </>
  )
}

function CookieRow({
  label,
  description,
  checked,
  locked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  locked?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 3px' }}>{label}</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, margin: 0 }}>{description}</p>
      </div>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {locked ? (
          <div style={{
            width: 36, height: 20, borderRadius: 10,
            background: 'linear-gradient(135deg,#F59E0B,#EF4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 3px',
            opacity: 0.6,
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff' }} />
          </div>
        ) : (
          <button
            role="switch"
            aria-checked={checked}
            aria-label={`Toggle ${label} cookies`}
            onClick={() => onChange?.(!checked)}
            style={{
              width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: checked ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center',
              justifyContent: checked ? 'flex-end' : 'flex-start',
              padding: '0 3px', transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </button>
        )}
      </div>
    </div>
  )
}
