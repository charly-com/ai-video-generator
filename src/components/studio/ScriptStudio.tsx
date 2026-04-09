'use client'

import { useState } from 'react'

const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#69C9D0' },
  { id: 'instagram', label: 'Instagram', icon: '📸', color: '#E1306C' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: '#FF0000' },
  { id: 'x', label: 'X (Twitter)', icon: '𝕏', color: '#1DA1F2' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0077B5' },
]

const FORMATS = [
  { id: 'hook', label: 'Hook only', desc: 'First 3 seconds' },
  { id: 'script', label: 'Full script', desc: 'Complete video script' },
  { id: 'caption', label: 'Caption', desc: 'Post caption + hashtags' },
  { id: 'thread', label: 'Thread', desc: 'Multi-post thread' },
  { id: 'description', label: 'Video description', desc: 'SEO-friendly description' },
]

const TONES = ['Casual', 'Professional', 'Humorous', 'Educational', 'Inspirational', 'Bold']

function card(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: '16px',
    ...extra,
  }
}

function label(text: string) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {text}
    </div>
  )
}

export function ScriptStudio() {
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [format, setFormat] = useState('script')
  const [tone, setTone] = useState('Casual')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, platform, format, tone }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setResult(json.data?.script ?? '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, minHeight: 500 }}>
      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Topic */}
        <div style={card()}>
          {label('Topic / Product')}
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="My new skincare brand targeting Nigerian women aged 25-35..."
            rows={3}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: '#fff', fontSize: 13, padding: '10px 12px', resize: 'none',
              outline: 'none', boxSizing: 'border-box', lineHeight: 1.5, marginBottom: 12,
            }}
          />
          {label('Target Audience (optional)')}
          <input
            value={audience}
            onChange={e => setAudience(e.target.value)}
            placeholder="e.g. Nigerian entrepreneurs, Gen Z fashionistas..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: '#fff', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Platform */}
        <div style={card()}>
          {label('Platform')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                style={{
                  padding: '7px 12px', borderRadius: 8, border: '1px solid',
                  borderColor: platform === p.id ? `${p.color}66` : 'rgba(255,255,255,0.07)',
                  background: platform === p.id ? `${p.color}18` : 'transparent',
                  color: platform === p.id ? p.color : 'rgba(255,255,255,0.5)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                <span>{p.icon}</span> {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div style={card()}>
          {label('Format')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FORMATS.map(f => (
              <button key={f.id} onClick={() => setFormat(f.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px', borderRadius: 8, border: '1px solid',
                  borderColor: format === f.id ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.07)',
                  background: format === f.id ? 'rgba(245,158,11,0.08)' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: format === f.id ? '#F59E0B' : '#fff' }}>{f.label}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{f.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div style={card()}>
          {label('Tone')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TONES.map(t => (
              <button key={t} onClick={() => setTone(t)}
                style={{
                  padding: '6px 12px', borderRadius: 20, border: '1px solid',
                  borderColor: tone === t ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.07)',
                  background: tone === t ? 'rgba(245,158,11,0.08)' : 'transparent',
                  color: tone === t ? '#F59E0B' : 'rgba(255,255,255,0.5)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button onClick={generate} disabled={loading || !topic.trim()}
          style={{
            padding: '14px', borderRadius: 12, border: 'none', cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
            background: loading || !topic.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#F59E0B,#f97316)',
            color: loading || !topic.trim() ? 'rgba(255,255,255,0.3)' : '#000',
            fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
          }}>
          {loading ? '⏳ Writing script...' : '✦ Generate Script'}
        </button>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#EF4444', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {result ? (
          <div style={card({ flex: 1, display: 'flex', flexDirection: 'column' })}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B' }}>
                {FORMATS.find(f => f.id === format)?.label} · {PLATFORMS.find(p => p.id === platform)?.label}
              </div>
              <button onClick={copy}
                style={{
                  padding: '6px 14px', borderRadius: 8, background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: copied ? '#10B981' : '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {copied ? '✓ Copied!' : '⎘ Copy'}
              </button>
            </div>
            <pre style={{
              flex: 1, margin: 0, padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', fontSize: 14,
              lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit',
              overflowY: 'auto', maxHeight: 560,
            }}>
              {result}
            </pre>
          </div>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 14,
            minHeight: 400, color: 'rgba(255,255,255,0.2)', gap: 12,
          }}>
            {loading ? (
              <>
                <div style={{ fontSize: 36 }}>✍️</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Writing your script...</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48 }}>📝</div>
                <div style={{ fontSize: 14 }}>Your script will appear here</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
