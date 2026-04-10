'use client'

export default function OfflinePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#07070F', color: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", textAlign: 'center', padding: '0 16px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>📡</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>You're offline</h1>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 32, maxWidth: 360 }}>
        No internet connection. Your drafts are saved — reconnect to publish and generate content.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 700, padding: '14px 28px', borderRadius: 12, border: 'none', fontSize: 15, cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  )
}
