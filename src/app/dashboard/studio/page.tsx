'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const MODELS = [
  { id: 'minimax-video-01', name: 'MiniMax Video-01', badge: 'Fast', desc: 'Best for quick social clips', tier: 'free', color: '#F59E0B' },
  { id: 'kling-video-v2-master', name: 'Kling v2 Master', badge: 'Popular', desc: 'Cinematic quality, high detail', tier: 'basic', color: '#8B5CF6' },
  { id: 'wan-pro', name: 'Wan 2.1 Pro', badge: '4K', desc: 'Maximum quality, longer clips', tier: 'pro', color: '#EF4444' },
  { id: 'luma-dream-machine', name: 'Luma Dream Machine', badge: 'Realistic', desc: 'Hyper-realistic motion', tier: 'pro', color: '#06B6D4' },
]

const ASPECT_RATIOS = [
  { value: '9:16', label: '9:16', icon: '📱', desc: 'TikTok, Reels, Shorts' },
  { value: '16:9', label: '16:9', icon: '🖥️', desc: 'YouTube, Twitter' },
  { value: '1:1', label: '1:1', icon: '⬜', desc: 'Instagram Feed' },
]

const DURATIONS = [5, 6, 8, 10, 15]

const STYLE_PRESETS = [
  { label: 'Cinematic', prompt: 'cinematic, dramatic lighting, film grain, shallow depth of field, 4K' },
  { label: 'TikTok', prompt: 'trendy, fast cuts, vibrant colors, vertical, gen-z aesthetic' },
  { label: 'Product', prompt: 'clean studio background, professional product showcase, soft box lighting' },
  { label: 'Vlog', prompt: 'handheld camera, authentic, natural lighting, documentary style' },
  { label: 'Tutorial', prompt: 'clear screen recording, clean background, professional presenter' },
  { label: 'Ad', prompt: 'polished advertisement, brand colors, call-to-action, commercial quality' },
]

type StudioStatus = 'idle' | 'scripting' | 'generating' | 'ready' | 'error'

export default function VideoStudioPage() {
  const searchParams = useSearchParams()
  const [model, setModel] = useState('minimax-video-01')
  const [prompt, setPrompt] = useState(searchParams.get('trend') ? `Create a viral video about ${searchParams.get('trend')}` : '')
  const [script, setScript] = useState('')
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16')
  const [duration, setDuration] = useState(6)
  const [status, setStatus] = useState<StudioStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [streamedScript, setStreamedScript] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // If trend param pre-fill
  useEffect(() => {
    const trend = searchParams.get('trend')
    if (trend) setPrompt(`Create a viral video capitalizing on the ${trend} trend. Hook viewer in first 2 seconds, show high energy content.`)
  }, [searchParams])

  async function generateScript() {
    setStatus('scripting')
    setStreamedScript('')
    try {
      const evtSource = new EventSource(
        `/api/script/generate?topic=${encodeURIComponent(prompt)}&platform=tiktok&duration=${duration}&tone=casual`
      )
      evtSource.onmessage = e => {
        if (e.data === '[DONE]') { evtSource.close(); setStatus('idle'); return }
        try {
          const { text } = JSON.parse(e.data)
          setStreamedScript(p => p + text)
        } catch {}
      }
      evtSource.onerror = () => { evtSource.close(); setStatus('idle') }
    } catch {
      setStatus('error')
    }
  }

  async function generateVideo() {
    if (!prompt.trim()) return
    setStatus('generating')
    setProgress(0)
    setVideoUrl(null)
    setError(null)

    // Simulate progress
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 92) { clearInterval(progressRef.current!); return 92 }
        return p + (Math.random() * 4 + 1)
      })
    }, 800)

    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, aspectRatio, duration, imageUrl: imageUrl || undefined }),
      })
      const data = await res.json()
      clearInterval(progressRef.current!)
      if (data.success) {
        setProgress(100)
        setTimeout(() => { setVideoUrl(data.data.fileUrl); setStatus('ready') }, 500)
      } else {
        setError(data.error || 'Generation failed')
        setStatus('error')
      }
    } catch (e) {
      clearInterval(progressRef.current!)
      setError(String(e))
      setStatus('error')
    }
  }

  function applyPreset(p: { prompt: string }) {
    setPrompt(prev => prev ? `${prev}, ${p.prompt}` : p.prompt)
  }

  const isGenerating = status === 'generating'
  const selectedModel = MODELS.find(m => m.id === model)!

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Mobile: stacked. Desktop: side-by-side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', overflow: 'hidden' }} className="studio-grid">

          {/* Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: 16, gap: 12, overflow: 'auto' }}>
            <div style={{ flex: 1, minHeight: 280, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {status === 'idle' && !videoUrl && (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Your video will appear here</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Write a prompt and click Generate</div>
                </div>
              )}

              {status === 'generating' && (
                <div style={{ textAlign: 'center', padding: 32, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 4, height: 48, marginBottom: 16 }}>
                    {[28,40,20,44,32,36,24].map((h, i) => (
                      <div key={i} style={{ width: 6, height: h, background: '#F59E0B', borderRadius: 3, animation: `wave 1.2s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Generating with {selectedModel.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>This takes 30–90 seconds depending on duration</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', maxWidth: 280, margin: '0 auto' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#F59E0B,#EF4444)', borderRadius: 2, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{Math.round(progress)}% complete</div>
                </div>
              )}

              {status === 'ready' && videoUrl && (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <video src={videoUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 16 }} />
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                    <a href={videoUrl} download style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>⬇ Download</a>
                    <button onClick={() => window.location.href = '/dashboard/publish'} style={{ padding: '6px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Publish →</button>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#EF4444', marginBottom: 6 }}>Generation failed</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 16, maxWidth: 260 }}>{error}</div>
                  <button onClick={() => setStatus('idle')} style={{ padding: '8px 20px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 13 }}>Try again</button>
                </div>
              )}
            </div>

            {/* Style presets */}
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Style presets</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {STYLE_PRESETS.map(p => (
                  <button key={p.label} onClick={() => applyPreset(p)}
                    style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Streamed script output */}
            {(status === 'scripting' || streamedScript) && (
              <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  ✦ Claude Script {status === 'scripting' ? '(writing...)' : ''}
                </div>
                <pre style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'inherit', maxHeight: 200, overflowY: 'auto' }}>{streamedScript || '...'}</pre>
                {streamedScript && (
                  <button onClick={() => setPrompt(streamedScript.split('\n')[0] || prompt)}
                    style={{ marginTop: 8, padding: '6px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B', fontSize: 12, cursor: 'pointer' }}>
                    Use as prompt →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Model */}
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>AI Model</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {MODELS.map(m => (
                  <button key={m.id} onClick={() => setModel(m.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 10, border: `1px solid ${model === m.id ? m.color + '60' : 'rgba(255,255,255,0.07)'}`, background: model === m.id ? `${m.color}12` : 'transparent', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: model === m.id ? '#fff' : 'rgba(255,255,255,0.6)' }}>{m.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{m.desc}</div>
                    </div>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: `${m.color}22`, color: m.color, fontWeight: 700, flexShrink: 0 }}>{m.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Video Prompt</div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your video... (e.g. Cinematic product reveal, golden hour lighting, slow zoom on iPhone, 4K quality)"
                style={{ width: '100%', minHeight: 90, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' }} />
              <button onClick={generateScript} disabled={!prompt.trim() || status === 'scripting'}
                style={{ marginTop: 6, width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                ✦ Generate script with Claude
              </button>
            </div>

            {/* Image-to-video */}
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Start from image (optional)</div>
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                placeholder="Paste image URL or generate one first..."
                style={{ width: '100%', padding: '9px 11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>

            {/* Aspect ratio */}
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Aspect Ratio</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {ASPECT_RATIOS.map(a => (
                  <button key={a.value} onClick={() => setAspectRatio(a.value as typeof aspectRatio)}
                    style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: `1px solid ${aspectRatio === a.value ? '#F59E0B60' : 'rgba(255,255,255,0.08)'}`, background: aspectRatio === a.value ? 'rgba(245,158,11,0.1)' : 'transparent', color: aspectRatio === a.value ? '#F59E0B' : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                <span>Duration</span><span style={{ color: '#F59E0B', fontWeight: 700 }}>{duration}s</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => setDuration(d)}
                    style={{ flex: 1, padding: '7px 4px', borderRadius: 7, border: `1px solid ${duration === d ? '#F59E0B60' : 'rgba(255,255,255,0.08)'}`, background: duration === d ? 'rgba(245,158,11,0.1)' : 'transparent', color: duration === d ? '#F59E0B' : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button onClick={generateVideo} disabled={!prompt.trim() || isGenerating}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: isGenerating ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#F59E0B,#EF4444)', border: 'none', color: isGenerating ? 'rgba(255,255,255,0.3)' : '#000', fontSize: 15, fontWeight: 800, cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em' }}>
              {isGenerating ? `Generating… ${Math.round(progress)}%` : '✦ Generate Video'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave { 0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.4)} }
        @media (max-width: 767px) {
          .studio-grid { grid-template-columns: 1fr !important; }
          .studio-grid > div:last-child { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>
    </div>
  )
}
