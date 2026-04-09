'use client'

import { useState } from 'react'

const MODELS = [
  { id: 'flux-pro-ultra', label: 'Flux Pro Ultra', desc: 'Highest quality' },
  { id: 'flux-pro', label: 'Flux Pro', desc: 'Balanced' },
  { id: 'flux-schnell', label: 'Flux Schnell', desc: 'Fast' },
]

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:5', '4:3', '3:4'] as const
type AspectRatio = typeof ASPECT_RATIOS[number]

const STYLES = ['None', 'Cinematic', 'Anime', 'Digital Art', 'Photographic', 'Neon', 'Watercolor', 'Sketch']

const NUM_IMAGES = [1, 2, 4]

interface GeneratedImage {
  url: string
  width?: number
  height?: number
}

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

export function ImageStudio() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('flux-pro-ultra')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [numImages, setNumImages] = useState(1)
  const [style, setStyle] = useState('None')
  const [guidanceScale, setGuidanceScale] = useState(7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<GeneratedImage[]>([])

  async function generate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          prompt,
          model,
          aspectRatio,
          numImages,
          negativePrompt: negativePrompt || undefined,
          guidanceScale,
          style: style !== 'None' ? style : undefined,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      const allImages: GeneratedImage[] = json.data?.metadata?.allImages ?? (json.data?.fileUrl ? [{ url: json.data.fileUrl }] : [])
      setImages(allImages)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
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
            placeholder="A cinematic shot of Lagos skyline at golden hour, Afrobeats music video aesthetic..."
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
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div style={card()}>
          {label('Aspect Ratio')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ASPECT_RATIOS.map(r => (
              <button key={r} onClick={() => setAspectRatio(r)}
                style={{
                  padding: '6px 12px', borderRadius: 8, border: '1px solid',
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

        {/* Style & Count */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={card()}>
            {label('Style')}
            <select value={style} onChange={e => setStyle(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, color: '#fff', fontSize: 13, padding: '8px 10px', outline: 'none',
              }}>
              {STYLES.map(s => <option key={s} value={s} style={{ background: '#16161f' }}>{s}</option>)}
            </select>
          </div>
          <div style={card()}>
            {label('Count')}
            <div style={{ display: 'flex', gap: 6 }}>
              {NUM_IMAGES.map(n => (
                <button key={n} onClick={() => setNumImages(n)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: 8, border: '1px solid',
                    borderColor: numImages === n ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)',
                    background: numImages === n ? 'rgba(249,115,22,0.08)' : 'transparent',
                    color: numImages === n ? '#f97316' : 'rgba(255,255,255,0.5)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Guidance */}
        <div style={card()}>
          {label(`Guidance Scale: ${guidanceScale}`)}
          <input type="range" min={1} max={20} value={guidanceScale} onChange={e => setGuidanceScale(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#f97316' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
            <span>Creative</span><span>Precise</span>
          </div>
        </div>

        {/* Generate */}
        <button onClick={generate} disabled={loading || !prompt.trim()}
          style={{
            padding: '14px', borderRadius: 12, border: 'none', cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
            background: loading || !prompt.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#f97316,#ec4899)',
            color: loading || !prompt.trim() ? 'rgba(255,255,255,0.3)' : '#fff',
            fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
          }}>
          {loading ? '⏳ Generating...' : '✦ Generate Images'}
        </button>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#EF4444', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {images.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr', gap: 12 }}>
            {images.map((img, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <img src={img.url} alt={`Generated ${i + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 6 }}>
                  <a href={img.url} download={`image-${i + 1}.png`} target="_blank" rel="noreferrer"
                    style={{
                      padding: '6px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                      color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)',
                    }}>
                    ↓ Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 14,
            minHeight: 400, color: 'rgba(255,255,255,0.2)', gap: 12,
          }}>
            {loading ? (
              <>
                <div style={{ fontSize: 36 }}>✨</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Generating your images...</div>
                <div style={{ fontSize: 12 }}>This may take 10–30 seconds</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48 }}>🖼️</div>
                <div style={{ fontSize: 14 }}>Your generated images will appear here</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
