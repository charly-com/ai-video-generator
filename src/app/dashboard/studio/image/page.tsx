'use client'

import { useState } from 'react'

const MODELS = [
  { id: 'flux-pro-ultra', name: 'FLUX 1.1 Ultra', badge: 'Best', color: '#F59E0B', desc: 'Top quality for pro use' },
  { id: 'flux-realism', name: 'FLUX Realism', badge: 'Photo', color: '#10B981', desc: 'Hyper-realistic photos' },
  { id: 'ideogram-v3', name: 'Ideogram v3', badge: 'Text', color: '#06B6D4', desc: 'Best text-in-image' },
  { id: 'recraft-v3', name: 'Recraft v3', badge: 'Vector', color: '#8B5CF6', desc: 'Illustrations & brand' },
]

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1', icon: '⬜', desc: 'Feed' },
  { value: '9:16', label: '9:16', icon: '📱', desc: 'Story' },
  { value: '16:9', label: '16:9', icon: '🖥️', desc: 'YouTube' },
  { value: '4:5', label: '4:5', icon: '📷', desc: 'Portrait' },
]

const MODE_TABS = [
  { id: 'generate', label: '✦ Generate', desc: 'Text → Image' },
  { id: 'edit', label: '✏️ Edit', desc: 'Modify image' },
  { id: 'upscale', label: '⬆️ Upscale', desc: '4x bigger' },
  { id: 'remove-bg', label: '✂️ Remove BG', desc: 'Clean cutout' },
]

const PROMPT_IDEAS = [
  'Cinematic portrait of a Nigerian entrepreneur, golden hour, shot on Leica',
  'Afrobeat concert poster, vibrant colors, geometric patterns, Lagos skyline',
  'Minimalist product photo, white background, soft shadows, luxury feel',
  'Futuristic Lagos city at night, neon lights, cyberpunk aesthetic',
  'Traditional Ankara fabric pattern, modern geometric design, bold colors',
  'Food photography, jollof rice steam, overhead shot, warm tones',
]

type Mode = 'generate' | 'edit' | 'upscale' | 'remove-bg'
type Status = 'idle' | 'generating' | 'ready' | 'error'

export default function ImageStudioPage() {
  const [mode, setMode] = useState<Mode>('generate')
  const [model, setModel] = useState('flux-pro-ultra')
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [numImages, setNumImages] = useState(1)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<string[]>([])
  const [selectedResult, setSelectedResult] = useState<string | null>(null)
  const [inputImageUrl, setInputImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    if (mode === 'generate' && !prompt.trim()) return
    if (['edit', 'upscale', 'remove-bg'].includes(mode) && !inputImageUrl.trim()) return

    setStatus('generating')
    setProgress(0)
    setResults([])
    setError(null)

    const interval = setInterval(() => {
      setProgress(p => p >= 90 ? 90 : p + (Math.random() * 8 + 3))
    }, 400)

    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode,
          prompt: prompt || undefined,
          model,
          aspectRatio,
          numImages,
          imageUrl: inputImageUrl || undefined,
        }),
      })
      const data = await res.json()
      clearInterval(interval)

      if (data.success) {
        const images = data.data.metadata?.allImages?.map((i: { url: string }) => i.url)
          || [data.data.fileUrl].filter(Boolean)
        setProgress(100)
        setTimeout(() => {
          setResults(images)
          setSelectedResult(images[0] || null)
          setStatus('ready')
        }, 300)
      } else {
        setError(data.error)
        setStatus('error')
      }
    } catch (e) {
      clearInterval(interval)
      setError(String(e))
      setStatus('error')
    }
  }

  async function enhancePrompt() {
    if (!prompt) return
    try {
      const res = await fetch('/api/script/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enhance-prompt', prompt, platform: 'instagram' }),
      })
      const data = await res.json()
      if (data.success) setPrompt(data.data.enhanced)
    } catch {}
  }

  const isGenerating = status === 'generating'
  const selectedModelData = MODELS.find(m => m.id === model)!

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '12px 16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }} className="hide-scroll">
        {MODE_TABS.map(t => (
          <button key={t.id} onClick={() => { setMode(t.id as Mode); setStatus('idle'); setResults([]) }}
            style={{ flexShrink: 0, padding: '8px 14px', borderRadius: '10px 10px 0 0', border: `1px solid ${mode === t.id ? 'rgba(255,255,255,0.1)' : 'transparent'}`, borderBottom: mode === t.id ? '1px solid #0a0a14' : '1px solid transparent', background: mode === t.id ? '#0a0a14' : 'transparent', color: mode === t.id ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: mode === t.id ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', overflow: 'hidden' }} className="studio-grid">
        {/* Canvas area */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {/* Main image display */}
          <div style={{ aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '9:16' ? '9/16' : aspectRatio === '4:5' ? '4/5' : '1/1', maxHeight: 420, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', alignSelf: 'center', maxWidth: '100%' }}>

            {status === 'idle' && !selectedResult && (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🖼️</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                  {mode === 'generate' ? 'Generated image appears here' :
                   mode === 'edit' ? 'Paste an image URL to edit' :
                   mode === 'upscale' ? 'Paste image to upscale 4x' :
                   'Paste image to remove background'}
                </div>
              </div>
            )}

            {isGenerating && (
              <div style={{ textAlign: 'center', width: '100%', padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: selectedModelData.color, animation: `bounce 1s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Generating with {selectedModelData.name}…</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', maxWidth: 240, margin: '0 auto' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${selectedModelData.color},#EF4444)`, borderRadius: 2, transition: 'width 0.4s' }} />
                </div>
              </div>
            )}

            {status === 'ready' && selectedResult && (
              <img src={selectedResult} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {status === 'error' && (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>❌</div>
                <div style={{ fontSize: 13, color: '#EF4444', marginBottom: 8 }}>{error}</div>
                <button onClick={() => setStatus('idle')} style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12 }}>Try again</button>
              </div>
            )}

            {status === 'ready' && selectedResult && (
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                <a href={selectedResult} download style={{ padding: '6px 11px', borderRadius: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>⬇ Save</a>
                <button onClick={() => { setInputImageUrl(selectedResult); setMode('edit') }}
                  style={{ padding: '6px 11px', borderRadius: 8, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer' }}>✏️ Edit</button>
                <button style={{ padding: '6px 11px', borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Publish →</button>
              </div>
            )}
          </div>

          {/* Thumbnails for multiple results */}
          {results.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {results.map((url, i) => (
                <button key={i} onClick={() => setSelectedResult(url)}
                  style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', padding: 0, border: `2px solid ${selectedResult === url ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', flexShrink: 0 }}>
                  <img src={url} alt={`Result ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Prompt ideas */}
          {mode === 'generate' && (
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>✨ Try these prompts:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {PROMPT_IDEAS.slice(0, 3).map((idea, i) => (
                  <button key={i} onClick={() => setPrompt(idea)}
                    style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', lineHeight: 1.4 }}>
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Model selection */}
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Model</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setModel(m.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 9, border: `1px solid ${model === m.id ? m.color + '55' : 'rgba(255,255,255,0.07)'}`, background: model === m.id ? `${m.color}10` : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: model === m.id ? '#fff' : 'rgba(255,255,255,0.55)' }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{m.desc}</div>
                  </div>
                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: `${m.color}22`, color: m.color, fontWeight: 700 }}>{m.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input image URL for edit/upscale/remove-bg */}
          {mode !== 'generate' && (
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Image URL</div>
              <textarea value={inputImageUrl} onChange={e => setInputImageUrl(e.target.value)}
                placeholder="https://... or paste from vault"
                style={{ width: '100%', minHeight: 60, padding: '9px 11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#fff', fontSize: 12, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
          )}

          {/* Prompt */}
          {(mode === 'generate' || mode === 'edit') && (
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                {mode === 'edit' ? 'Edit instruction' : 'Prompt'}
              </div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder={mode === 'edit' ? 'Change the background to sunset, add text overlay...' : 'Describe what you want to create...'}
                style={{ width: '100%', minHeight: 80, padding: '9px 11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#fff', fontSize: 12, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' }} />
              {mode === 'generate' && (
                <button onClick={enhancePrompt} disabled={!prompt}
                  style={{ marginTop: 6, width: '100%', padding: '7px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  ✦ Enhance with Claude
                </button>
              )}
            </div>
          )}

          {/* Settings */}
          {mode === 'generate' && (
            <>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Aspect Ratio</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5 }}>
                  {ASPECT_RATIOS.map(a => (
                    <button key={a.value} onClick={() => setAspectRatio(a.value)}
                      style={{ padding: '7px 4px', borderRadius: 8, border: `1px solid ${aspectRatio === a.value ? '#F59E0B55' : 'rgba(255,255,255,0.08)'}`, background: aspectRatio === a.value ? 'rgba(245,158,11,0.1)' : 'transparent', color: aspectRatio === a.value ? '#F59E0B' : 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <span style={{ fontSize: 14 }}>{a.icon}</span>
                      <span>{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  <span>Variations</span><span style={{ color: '#F59E0B', fontWeight: 700 }}>{numImages}</span>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[1, 2, 4].map(n => (
                    <button key={n} onClick={() => setNumImages(n)}
                      style={{ flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${numImages === n ? '#F59E0B55' : 'rgba(255,255,255,0.08)'}`, background: numImages === n ? 'rgba(245,158,11,0.1)' : 'transparent', color: numImages === n ? '#F59E0B' : 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Generate button */}
          <button onClick={generate}
            disabled={isGenerating || (mode === 'generate' && !prompt.trim()) || (['edit','upscale','remove-bg'].includes(mode) && !inputImageUrl.trim())}
            style={{ width: '100%', padding: '13px', borderRadius: 12, background: isGenerating ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg,${selectedModelData.color},#EF4444)`, border: 'none', color: isGenerating ? 'rgba(255,255,255,0.3)' : '#000', fontSize: 14, fontWeight: 800, cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {isGenerating ? `Generating… ${Math.round(progress)}%` :
              mode === 'generate' ? '✦ Generate Image' :
              mode === 'edit' ? '✏️ Apply Edit' :
              mode === 'upscale' ? '⬆️ Upscale 4x' :
              '✂️ Remove Background'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        .hide-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        .hide-scroll::-webkit-scrollbar { display:none; }
        @media (max-width: 767px) {
          .studio-grid { grid-template-columns: 1fr !important; }
          .studio-grid > div:last-child { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>
    </div>
  )
}
