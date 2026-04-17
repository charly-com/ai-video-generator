'use client'

import { useState } from 'react'

const MODELS = [
  { id: 'kling-video-v2-master', label: 'Kling V2', desc: 'Basic+', tier: 'basic' },
  { id: 'wan-pro', label: 'Wan Pro', desc: 'Pro+', tier: 'pro' },
  { id: 'luma-dream-machine', label: 'Luma Dream', desc: 'Pro+', tier: 'pro' },
]

const ASPECT_RATIOS = ['16:9', '9:16', '1:1'] as const
type AspectRatio = typeof ASPECT_RATIOS[number]

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

export function VideoStudio() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('kling-video-v2-master')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [duration, setDuration] = useState(5)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [addAudio, setAddAudio] = useState(true)
  const [audioPrompt, setAudioPrompt] = useState('')
  const [downloading, setDownloading] = useState(false)

  async function generate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    setVideoUrl('')
    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          aspectRatio,
          duration,
          imageUrl: imageUrl.trim() || undefined,
          negativePrompt: negativePrompt.trim() || undefined,
          addAudio,
          audioPrompt: audioPrompt.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setVideoUrl(json.data?.fileUrl ?? '')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Video generation failed')
    } finally {
      setLoading(false)
    }
  }

  async function downloadVideo() {
    if (!videoUrl) return
    setDownloading(true)
    try {
      const name = `viralmint-${Date.now()}.mp4`
      const proxyUrl = `/api/download?url=${encodeURIComponent(videoUrl)}&name=${encodeURIComponent(name)}`
      const res = await fetch(proxyUrl)
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, minHeight: 500 }}>
      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Prompt */}
        <div style={card()}>
          {label('Prompt')}
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="A dynamic Afrobeats music video scene with vibrant colors, smooth camera movement..."
            rows={4}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: '#fff', fontSize: 13, padding: '10px 12px', resize: 'none',
              outline: 'none', boxSizing: 'border-box', lineHeight: 1.5,
            }}
          />
          <textarea
            value={negativePrompt}
            onChange={e => setNegativePrompt(e.target.value)}
            placeholder="Negative prompt (optional)..."
            rows={2}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: 'rgba(255,255,255,0.5)', fontSize: 12, padding: '8px 12px', resize: 'none',
              outline: 'none', boxSizing: 'border-box', marginTop: 8,
            }}
          />
        </div>

        {/* Model */}
        <div style={card()}>
          {label('Model')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MODELS.map(m => (
              <button key={m.id} onClick={() => setModel(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px', borderRadius: 8, border: '1px solid',
                  borderColor: model === m.id ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)',
                  background: model === m.id ? 'rgba(249,115,22,0.08)' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: model === m.id ? '#f97316' : '#fff' }}>{m.label}</span>
                <span style={{ fontSize: 10, color: m.tier === 'pro' ? '#a855f7' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect & Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={card()}>
            {label('Aspect')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {ASPECT_RATIOS.map(r => (
                <button key={r} onClick={() => setAspectRatio(r)}
                  style={{
                    padding: '7px', borderRadius: 8, border: '1px solid',
                    borderColor: aspectRatio === r ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)',
                    background: aspectRatio === r ? 'rgba(249,115,22,0.08)' : 'transparent',
                    color: aspectRatio === r ? '#f97316' : 'rgba(255,255,255,0.5)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={card()}>
            {label(`Duration: ${duration}s`)}
            <input type="range" min={3} max={15} step={1} value={duration} onChange={e => setDuration(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f97316', marginBottom: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
              <span>3s</span><span>15s</span>
            </div>
          </div>
        </div>

        {/* Start image (img2vid) */}
        <div style={card()}>
          {label('Start Image URL (optional)')}
          <input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://... (image-to-video)"
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: '#fff', fontSize: 13, padding: '9px 12px', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Audio */}
        <div style={card()}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 8 }}>
            <input type="checkbox" checked={addAudio} onChange={e => setAddAudio(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#f97316' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>🔊 Generate AI audio</span>
          </label>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: addAudio ? 10 : 0 }}>
            Adds a matching soundtrack &amp; effects to the video
          </div>
          {addAudio && (
            <input
              value={audioPrompt}
              onChange={e => setAudioPrompt(e.target.value)}
              placeholder="Audio description (optional — uses video prompt)"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, color: '#fff', fontSize: 12, padding: '8px 12px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          )}
        </div>

        {/* Generate */}
        <button onClick={generate} disabled={loading || !prompt.trim()}
          style={{
            padding: '14px', borderRadius: 12, border: 'none', cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
            background: loading || !prompt.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#a855f7,#ec4899)',
            color: loading || !prompt.trim() ? 'rgba(255,255,255,0.3)' : '#fff',
            fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
          }}>
          {loading ? '⏳ Generating video...' : '▶ Generate Video'}
        </button>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#EF4444', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* Result */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {videoUrl ? (
          <div style={{ borderRadius: 14, overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.07)' }}>
            <video src={videoUrl} controls autoPlay loop style={{ width: '100%', display: 'block' }} />
            <div style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
              <button onClick={downloadVideo} disabled={downloading}
                style={{
                  padding: '8px 16px', borderRadius: 8, background: downloading ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#F59E0B,#EF4444)',
                  border: 'none', color: downloading ? 'rgba(255,255,255,0.3)' : '#000',
                  fontSize: 13, fontWeight: 700, cursor: downloading ? 'not-allowed' : 'pointer',
                }}>
                {downloading ? '⏳ Downloading...' : '↓ Download to device'}
              </button>
              <a href={videoUrl} target="_blank" rel="noreferrer"
                style={{
                  padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                }}>
                ↗ Open
              </a>
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 14,
            minHeight: 400, color: 'rgba(255,255,255,0.2)', gap: 12,
          }}>
            {loading ? (
              <>
                <div style={{ fontSize: 36 }}>🎬</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Generating your video...</div>
                <div style={{ fontSize: 12 }}>This may take 1–3 minutes</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48 }}>🎬</div>
                <div style={{ fontSize: 14 }}>Your generated video will appear here</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
