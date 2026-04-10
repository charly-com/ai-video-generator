'use client'
// src/app/dashboard/studio/video/page.tsx

import { useState, useRef } from 'react'
import { Wand2, Film, Sparkles, Play, Download, Send, ChevronDown, X, RotateCcw, Clock, Zap, Crown, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const MODELS = [
  { id: 'minimax-video-01',       name: 'MiniMax Video-01', badge: 'Fast',    color: 'text-orange-400', tier: 'free',  desc: '6s · Great for product showcases' },
  { id: 'kling-video-v2-master',  name: 'Kling v2 Master',  badge: 'HQ',      color: 'text-purple-400', tier: 'basic', desc: '10s · Cinematic quality' },
  { id: 'wan-pro',                name: 'Wan 2.1 Pro',       badge: 'Max',     color: 'text-pink-400',   tier: 'pro',   desc: '15s · Highest fidelity' },
  { id: 'luma-dream-machine',     name: 'Luma Dream',        badge: 'Realism', color: 'text-cyan-400',   tier: 'pro',   desc: '5s · Hyper-realistic motion' },
]

const RATIOS   = ['16:9', '9:16', '1:1', '4:3']
const DURATIONS = [5, 6, 10, 15]

const TONES = ['professional', 'casual', 'humorous', 'inspirational', 'educational']

const PROMPT_EXAMPLES = [
  'Cinematic product reveal, dramatic studio lighting, slow zoom, luxury aesthetic, 4K',
  'Person walking through Lagos at golden hour, vibrant street life, documentary style',
  'Abstract brand logo animation, flowing particles, premium corporate feel',
  'Food close-up, steam rising, warm tones, mouthwatering macro photography style',
]

export default function VideoStudioPage() {
  const [model, setModel]           = useState('minimax-video-01')
  const [ratio, setRatio]           = useState('16:9')
  const [duration, setDuration]     = useState(6)
  const [prompt, setPrompt]         = useState('')
  const [negPrompt, setNegPrompt]   = useState('')
  const [topic, setTopic]           = useState('')
  const [platform, setPlatform]     = useState('instagram')
  const [tone, setTone]             = useState('casual')
  const [showAdvanced, setAdvanced] = useState(false)
  const [showScript, setShowScript] = useState(false)

  const [scriptText, setScriptText] = useState('')
  const [genStatus, setGenStatus]   = useState<'idle' | 'scripting' | 'generating' | 'done' | 'error'>('idle')
  const [progress, setProgress]     = useState(0)
  const [videoUrl, setVideoUrl]     = useState<string | null>(null)
  const [contentId, setContentId]   = useState<string | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selectedModel = MODELS.find(m => m.id === model)!

  async function generateScript() {
    if (!topic.trim()) { toast.error('Enter a topic first'); return }
    setGenStatus('scripting')
    try {
      const res = await fetch('/api/script/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'script', topic, platform, duration, tone }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setScriptText(json.data.body)
      setPrompt(json.data.visualPrompt ?? prompt)
      toast.success('Script ready! ✨')
      setGenStatus('idle')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Script failed')
      setGenStatus('idle')
    }
  }

  async function enhancePrompt() {
    if (!prompt.trim()) { toast.error('Enter a prompt first'); return }
    try {
      const res = await fetch('/api/script/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enhance-prompt', prompt, platform }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setPrompt(json.data.enhanced)
      toast.success('Prompt enhanced! 🚀')
    } catch (e: unknown) {
      toast.error('Enhancement failed')
    }
  }

  function startFakeProgress() {
    setProgress(0)
    let p = 0
    progressRef.current = setInterval(() => {
      p += Math.random() * 4 + 1
      if (p >= 90) { p = 90; clearInterval(progressRef.current!) }
      setProgress(Math.min(p, 90))
    }, 600)
  }

  async function generate() {
    if (!prompt.trim()) { toast.error('Enter a prompt'); return }
    setGenStatus('generating')
    setVideoUrl(null)
    startFakeProgress()

    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, aspectRatio: ratio, duration, negativePrompt: negPrompt }),
      })
      const json = await res.json()
      clearInterval(progressRef.current!)
      if (!json.success) throw new Error(json.error)
      setProgress(100)
      setVideoUrl(json.data.fileUrl)
      setContentId(json.data.id)
      setGenStatus('done')
      toast.success('Video generated! 🎬')
    } catch (e: unknown) {
      clearInterval(progressRef.current!)
      setProgress(0)
      setGenStatus('error')
      toast.error(e instanceof Error ? e.message : 'Generation failed')
    }
  }

  function reset() {
    setGenStatus('idle')
    setVideoUrl(null)
    setProgress(0)
    setContentId(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-24">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-700 text-[22px] text-white">Video Studio</h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>AI-powered video generation</p>
        </div>
        <span className="badge badge-orange"><Film size={11} /> AI</span>
      </div>

      {/* Model selector */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-[11px] font-600 uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>AI Model</p>
        <div className="grid grid-cols-2 gap-2">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                model === m.id
                  ? 'border-orange-500/60 bg-orange-500/10'
                  : 'border-transparent hover:border-white/10'
              }`}
              style={{ background: model === m.id ? undefined : 'var(--bg-elevated)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[13px] font-600 ${model === m.id ? 'text-white' : ''}`} style={{ color: model === m.id ? undefined : 'var(--text-secondary)' }}>{m.name}</span>
                <div className="flex gap-1">
                  <span className="badge badge-orange text-[9px] py-0">{m.badge}</span>
                  {m.tier !== 'free' && <span className={`badge text-[9px] py-0 ${m.tier === 'pro' ? 'badge-purple' : 'badge-cyan'}`}>{m.tier.toUpperCase()}</span>}
                </div>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-[11px] font-600 uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Format</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[12px] mb-2" style={{ color: 'var(--text-secondary)' }}>Aspect Ratio</p>
            <div className="flex flex-wrap gap-2">
              {RATIOS.map(r => (
                <button key={r} onClick={() => setRatio(r)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-600 transition-all border ${
                    ratio === r ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[12px] mb-2" style={{ color: 'var(--text-secondary)' }}>Duration</p>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-600 transition-all border ${
                    duration === d ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}>
                  {d}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Script generator */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setShowScript(!showScript)}>
          <p className="text-[11px] font-600 uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <Sparkles size={12} className="text-purple-400" /> Claude Script Generator
          </p>
          <ChevronDown size={14} className={`transition-transform ${showScript ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
        </button>

        {showScript && (
          <div className="mt-3 space-y-3">
            <input
              className="input-dark w-full px-3 py-2.5 text-[14px]"
              placeholder="e.g. my Afrobeats playlist app launch"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <select className="input-dark px-3 py-2 text-[13px]" value={platform} onChange={e => setPlatform(e.target.value)}>
                {['instagram','tiktok','youtube','twitter','linkedin'].map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
              <select className="input-dark px-3 py-2 text-[13px]" value={tone} onChange={e => setTone(e.target.value)}>
                {TONES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <button
              onClick={generateScript}
              disabled={genStatus === 'scripting'}
              className="btn-brand w-full py-2.5 text-[13px] flex items-center justify-center gap-2 disabled:opacity-50">
              <Sparkles size={14} />
              {genStatus === 'scripting' ? 'Generating script…' : 'Generate Script with Claude'}
            </button>
            {scriptText && (
              <div className="rounded-xl p-3 text-[13px] leading-relaxed whitespace-pre-wrap"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                {scriptText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prompt */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-[11px] font-600 uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Video Prompt</p>
        <textarea
          className="input-dark w-full px-3 py-2.5 text-[14px] resize-none"
          rows={4}
          placeholder="Describe your video scene, mood, style…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <div className="flex items-center gap-2 mt-2">
          <button onClick={enhancePrompt} className="btn-ghost px-3 py-1.5 text-[12px] flex items-center gap-1.5">
            <Wand2 size={12} /> Enhance with Claude
          </button>
          <div className="flex gap-1 ml-auto flex-wrap">
            {PROMPT_EXAMPLES.slice(0,2).map((ex, i) => (
              <button key={i} onClick={() => setPrompt(ex)}
                className="text-[10px] px-2 py-1 rounded-md"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                Example {i+1}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced */}
        <button onClick={() => setAdvanced(!showAdvanced)} className="text-[12px] mt-3 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          Advanced options
        </button>
        {showAdvanced && (
          <div className="mt-2">
            <label className="text-[12px] block mb-1" style={{ color: 'var(--text-secondary)' }}>Negative prompt</label>
            <input className="input-dark w-full px-3 py-2 text-[13px]" placeholder="blurry, watermark, ugly…"
              value={negPrompt} onChange={e => setNegPrompt(e.target.value)} />
          </div>
        )}
      </div>

      {/* Generate button */}
      {genStatus !== 'done' && (
        <button
          onClick={generate}
          disabled={genStatus === 'generating' || !prompt.trim()}
          className="btn-brand w-full py-4 text-[16px] font-syne font-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {genStatus === 'generating' ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating… {Math.round(progress)}%
            </>
          ) : (
            <><Zap size={18} /> Generate Video</>
          )}
        </button>
      )}

      {/* Progress bar */}
      {genStatus === 'generating' && (
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Result */}
      {genStatus === 'done' && videoUrl && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <video src={videoUrl} controls className="w-full" style={{ maxHeight: 400, background: '#000' }} />
          <div className="p-4 flex gap-2" style={{ background: 'var(--bg-card)' }}>
            <a href={videoUrl} download="viralkit-video.mp4" className="btn-ghost flex-1 py-2.5 text-[13px] flex items-center justify-center gap-2">
              <Download size={14} /> Download
            </a>
            <Link href="/dashboard/publish" className="flex-1">
              <button className="btn-brand w-full py-2.5 text-[13px] flex items-center justify-center gap-2">
                <Send size={14} /> Publish
              </button>
            </Link>
            <button onClick={reset} className="btn-ghost px-3 py-2.5">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      )}

      {genStatus === 'error' && (
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-red-400 text-[14px]">Generation failed. Please try again.</p>
          <button onClick={reset} className="btn-ghost mt-2 px-4 py-2 text-[13px]">Try again</button>
        </div>
      )}
    </div>
  )
}
