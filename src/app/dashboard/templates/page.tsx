'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TEMPLATE_LIBRARY, type ContentTemplate, type TemplateCategory } from '@/lib/templates/library'

const CATEGORIES: { value: TemplateCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all',            label: 'All',           emoji: '✦' },
  { value: 'viral_hook',     label: 'Viral Hook',    emoji: '👀' },
  { value: 'product_launch', label: 'Product',       emoji: '🚀' },
  { value: 'tutorial',       label: 'Tutorial',      emoji: '📚' },
  { value: 'behind_scenes',  label: 'Behind Scenes', emoji: '🎥' },
  { value: 'trending',       label: 'Trending',      emoji: '🔥' },
  { value: 'educational',    label: 'Educational',   emoji: '🤯' },
  { value: 'promo',          label: 'Promo',         emoji: '💸' },
  { value: 'challenge',      label: 'Challenge',     emoji: '💪' },
  { value: 'testimonial',    label: 'Testimonial',   emoji: '🏆' },
]

const TIER_COLOR: Record<string, string> = {
  free:  '#22c55e',
  basic: '#F59E0B',
  pro:   '#8b5cf6',
}

const PLATFORM_EMOJI: Record<string, string> = {
  tiktok: '🎵', instagram: '📸', youtube: '▶️', twitter: '🐦', linkedin: '💼', facebook: '👥',
}

export default function TemplatesPage() {
  const router = useRouter()
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all')
  const [selected, setSelected] = useState<ContentTemplate | null>(null)

  const filtered = category === 'all'
    ? TEMPLATE_LIBRARY
    : TEMPLATE_LIBRARY.filter(t => t.category === category)

  function useTemplate(t: ContentTemplate) {
    const prompt = encodeURIComponent(t.visualPrompt)
    router.push(`/dashboard/studio?prompt=${prompt}`)
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 1000, margin: '0 auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>Templates</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{TEMPLATE_LIBRARY.length} proven content templates</p>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)}
            style={{ padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
              background: category === c.value ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
              color: category === c.value ? '#F59E0B' : 'rgba(255,255,255,0.4)' }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {filtered.map(t => (
          <div key={t.id}
            onClick={() => setSelected(selected?.id === t.id ? null : t)}
            style={{ borderRadius: 14, background: selected?.id === t.id ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${selected?.id === t.id ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)'}`,
              padding: 14, cursor: 'pointer', transition: 'all 0.15s' }}>

            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 28 }}>{t.emoji}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, fontWeight: 700,
                  background: `${TIER_COLOR[t.tier]}22`, color: TIER_COLOR[t.tier] }}>
                  {t.tier.toUpperCase()}
                </span>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 10, fontWeight: 700,
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                  {t.contentType === 'both' ? 'VIDEO+IMG' : t.contentType.toUpperCase()}
                </span>
              </div>
            </div>

            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{t.name}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', lineHeight: 1.5 }}>{t.hook}</p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>👁 {t.estimatedViews}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>⏰ {t.bestTime}</span>
            </div>

            {/* Platforms */}
            <div style={{ display: 'flex', gap: 4, marginBottom: selected?.id === t.id ? 12 : 0 }}>
              {t.platform.map(p => (
                <span key={p} title={p} style={{ fontSize: 14 }}>{PLATFORM_EMOJI[p]}</span>
              ))}
            </div>

            {/* Expanded detail */}
            {selected?.id === t.id && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, marginTop: 4 }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Structure</p>
                <ol style={{ margin: '0 0 12px', paddingLeft: 18 }}>
                  {t.structure.map((s, i) => (
                    <li key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{s}</li>
                  ))}
                </ol>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hashtags</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                  {t.hashtags.map(h => (
                    <span key={h} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>#{h}</span>
                  ))}
                </div>
                <button onClick={(e) => { e.stopPropagation(); useTemplate(t) }}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', border: 'none', color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                  Use this template →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
