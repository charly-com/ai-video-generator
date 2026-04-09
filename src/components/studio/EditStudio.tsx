'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type Action = 'edit' | 'upscale' | 'remove-bg'

const ACTIONS: { id: Action; label: string; desc: string; icon: string }[] = [
  { id: 'edit', label: 'Edit / Inpaint', desc: 'Modify with a text prompt', icon: '✏️' },
  { id: 'upscale', label: 'Upscale', desc: 'Increase resolution 4×', icon: '⬆️' },
  { id: 'remove-bg', label: 'Remove Background', desc: 'Transparent PNG output', icon: '✂️' },
]

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

export function EditStudio() {
  const [action, setAction] = useState<Action>('edit')
  const [imageUrl, setImageUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [strength, setStrength] = useState(0.7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultUrl, setResultUrl] = useState('')

  const onDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    // Preview via object URL; in production you'd upload to storage first
    setImageUrl(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  })

  async function run() {
    if (!imageUrl) return
    if (action === 'edit' && !prompt.trim()) return
    setLoading(true)
    setError('')
    setResultUrl('')
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          imageUrl,
          prompt: action === 'edit' ? prompt : undefined,
          strength: action === 'edit' ? strength : undefined,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setResultUrl(json.data?.fileUrl ?? '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const canRun = !!imageUrl && (action !== 'edit' || !!prompt.trim())

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, minHeight: 500 }}>
      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Upload */}
        <div style={card()}>
          {label('Source Image')}
          {/* Dropzone */}
          <div
            {...getRootProps()}
            style={{
              padding: '20px', borderRadius: 10, border: `2px dashed ${isDragActive ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: isDragActive ? 'rgba(249,115,22,0.05)' : 'rgba(255,255,255,0.02)',
              textAlign: 'center', cursor: 'pointer', marginBottom: 10, transition: 'all 0.15s',
            }}>
            <input {...getInputProps()} />
            <div style={{ fontSize: 24, marginBottom: 6 }}>📁</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {isDragActive ? 'Drop it here' : 'Drag & drop or click to upload'}
            </div>
          </div>
          {/* URL input */}
          <input
            value={imageUrl.startsWith('blob:') ? '' : imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="Or paste image URL..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: '#fff', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box',
            }}
          />
          {imageUrl && (
            <img src={imageUrl} alt="Source" style={{ width: '100%', borderRadius: 8, marginTop: 10, maxHeight: 200, objectFit: 'cover' }} />
          )}
        </div>

        {/* Action */}
        <div style={card()}>
          {label('Operation')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ACTIONS.map(a => (
              <button key={a.id} onClick={() => setAction(a.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8, border: '1px solid',
                  borderColor: action === a.id ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)',
                  background: action === a.id ? 'rgba(249,115,22,0.08)' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: action === a.id ? '#f97316' : '#fff' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Edit-specific options */}
        {action === 'edit' && (
          <div style={card()}>
            {label('Edit Prompt')}
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Change the background to a Lagos street market..."
              rows={3}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, color: '#fff', fontSize: 13, padding: '10px 12px', resize: 'none',
                outline: 'none', boxSizing: 'border-box', lineHeight: 1.5, marginBottom: 12,
              }}
            />
            {label(`Edit Strength: ${Math.round(strength * 100)}%`)}
            <input type="range" min={0.1} max={1} step={0.05} value={strength} onChange={e => setStrength(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f97316' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
              <span>Subtle</span><span>Strong</span>
            </div>
          </div>
        )}

        {/* Run */}
        <button onClick={run} disabled={loading || !canRun}
          style={{
            padding: '14px', borderRadius: 12, border: 'none', cursor: loading || !canRun ? 'not-allowed' : 'pointer',
            background: loading || !canRun ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#06b6d4,#a855f7)',
            color: loading || !canRun ? 'rgba(255,255,255,0.3)' : '#fff',
            fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
          }}>
          {loading ? '⏳ Processing...' : `✦ ${ACTIONS.find(a => a.id === action)?.label}`}
        </button>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#EF4444', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(imageUrl || resultUrl) && (
          <div style={{ display: 'grid', gridTemplateColumns: resultUrl ? '1fr 1fr' : '1fr', gap: 12 }}>
            {imageUrl && (
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Before</div>
                <img src={imageUrl} alt="Before" style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', display: 'block' }} />
              </div>
            )}
            {resultUrl && (
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>After</div>
                <div style={{ position: 'relative' }}>
                  <img src={resultUrl} alt="Result" style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(249,115,22,0.2)', display: 'block' }} />
                  <a href={resultUrl} download="edited.png" target="_blank" rel="noreferrer"
                    style={{
                      position: 'absolute', bottom: 10, right: 10, padding: '6px 12px', borderRadius: 8,
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                      color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)',
                    }}>
                    ↓ Download
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {!imageUrl && !resultUrl && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 14,
            minHeight: 400, color: 'rgba(255,255,255,0.2)', gap: 12,
          }}>
            {loading ? (
              <>
                <div style={{ fontSize: 36 }}>✨</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Processing image...</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48 }}>✏️</div>
                <div style={{ fontSize: 14 }}>Upload an image to start editing</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
