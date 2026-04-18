'use client'
// src/app/dashboard/brand/page.tsx

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Palette, Type, Image, Save, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface BrandKit {
  id: string; name: string; primaryColor: string; secondaryColor?: string
  accentColor?: string; fontPrimary?: string; fontSecondary?: string
  logoUrl?: string; brandVoice?: string; tagline?: string; industry?: string
}

const INDUSTRIES = ['Technology', 'Fashion', 'Food & Beverage', 'Health & Fitness', 'Education',
  'Entertainment', 'Finance', 'Real Estate', 'Beauty', 'Sports', 'Travel', 'Other']

const FONT_OPTIONS = ['Inter', 'Syne', 'DM Sans', 'Playfair Display', 'Montserrat',
  'Raleway', 'Poppins', 'Space Grotesk', 'Bebas Neue', 'Oswald']

export default function BrandPage() {
  const [kits, setKits]         = useState<BrandKit[]>([])
  const [editing, setEditing]   = useState<BrandKit | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)
  const [isPro, setIsPro]       = useState(false)

  const [form, setForm] = useState({
    name: '', primaryColor: '#f97316', secondaryColor: '#a855f7',
    accentColor: '#06b6d4', fontPrimary: 'Syne', fontSecondary: 'DM Sans',
    brandVoice: '', tagline: '', industry: 'Technology',
  })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [kitsRes, billingRes] = await Promise.all([
        fetch('/api/brand'), fetch('/api/billing'),
      ])
      const kitsJson = await kitsRes.json()
      const billJson = await billingRes.json()
      if (kitsJson.success) setKits(kitsJson.data)
      if (billJson.success) setIsPro(['pro', 'agency'].includes(billJson.data?.subscription?.plan ?? ''))
    } catch { toast.error('Failed to load') }
    setLoading(false)
  }

  async function save() {
    setSaving(true)
    try {
      const method = editing ? 'PUT' : 'POST'
      const body   = editing ? { id: editing.id, ...form } : form
      const res    = await fetch('/api/brand', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success(editing ? 'Brand kit updated!' : 'Brand kit created! 🎨')
      setCreating(false)
      setEditing(null)
      load()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed')
    }
    setSaving(false)
  }

  async function deleteKit(id: string) {
    if (!confirm('Delete this brand kit?')) return
    await fetch(`/api/brand?id=${id}`, { method: 'DELETE' })
    setKits(prev => prev.filter(k => k.id !== id))
    toast.success('Deleted')
  }

  function startEdit(kit: BrandKit) {
    setForm({ name: kit.name, primaryColor: kit.primaryColor, secondaryColor: kit.secondaryColor ?? '#a855f7',
      accentColor: kit.accentColor ?? '#06b6d4', fontPrimary: kit.fontPrimary ?? 'Syne',
      fontSecondary: kit.fontSecondary ?? 'DM Sans', brandVoice: kit.brandVoice ?? '',
      tagline: kit.tagline ?? '', industry: kit.industry ?? 'Technology' })
    setEditing(kit)
    setCreating(true)
  }

  const showForm = creating || editing

  if (!isPro && kits.length === 0 && !creating) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-24 sm:px-6 sm:pt-6">
        <h1 className="font-syne font-700 text-[22px] text-white mb-1">Brand Kit</h1>
        <p className="text-[13px] mb-6" style={{ color: 'var(--text-secondary)' }}>Save your brand identity</p>
        <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <Crown size={40} className="mx-auto mb-3 text-orange-400" />
          <p className="font-syne font-700 text-[18px] text-white mb-2">Brand Kit requires Basic+</p>
          <p className="text-[13px] mb-6" style={{ color: 'var(--text-secondary)' }}>
            Save your brand colors, fonts and voice. Apply to all AI-generated content with one tap.
          </p>
          <Link href="/dashboard/pricing"><button className="btn-brand px-6 py-3 text-[14px]">Upgrade now →</button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-4 pt-5 pb-24 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-700 text-[22px] text-white">Brand Kit</h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{kits.length} kit{kits.length !== 1 ? 's' : ''}</p>
        </div>
        {!showForm && (
          <button onClick={() => setCreating(true)} className="btn-brand px-4 py-2.5 text-[13px] flex items-center gap-1.5">
            <Plus size={14} /> New kit
          </button>
        )}
      </div>

      {/* Kit list */}
      {!showForm && kits.map(kit => (
        <div key={kit.id} className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {/* Color swatches */}
          <div className="flex gap-1.5">
            {[kit.primaryColor, kit.secondaryColor, kit.accentColor].filter(Boolean).map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-lg" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-600 text-[14px] text-white">{kit.name}</p>
            <p className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
              {kit.fontPrimary} · {kit.industry}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => startEdit(kit)} className="btn-ghost p-2 rounded-lg"><Edit2 size={14} /></button>
            <button onClick={() => deleteKit(kit.id)} className="btn-ghost p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl p-5 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="font-syne font-700 text-[16px] text-white">{editing ? 'Edit' : 'New'} Brand Kit</h2>

          <div>
            <label className="text-[12px] font-600 mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Kit name</label>
            <input className="input-dark w-full px-3 py-2.5 text-[14px]" placeholder="My Brand" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          {/* Colors */}
          <div>
            <label className="text-[12px] font-600 mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}><Palette size={12} /> Brand Colors</label>
            <div className="grid grid-cols-3 gap-3">
              {(['primaryColor', 'secondaryColor', 'accentColor'] as const).map((key, i) => (
                <div key={key}>
                  <p className="text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>{['Primary', 'Secondary', 'Accent'][i]}</p>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form[key] ?? '#ffffff'} onChange={e => setForm({...form, [key]: e.target.value})}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <input className="input-dark flex-1 px-2 py-1.5 text-[12px]" value={form[key] ?? ''} onChange={e => setForm({...form, [key]: e.target.value})} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div>
            <label className="text-[12px] font-600 mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}><Type size={12} /> Fonts</label>
            <div className="grid grid-cols-2 gap-3">
              {(['fontPrimary', 'fontSecondary'] as const).map((key, i) => (
                <div key={key}>
                  <p className="text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>{['Heading', 'Body'][i]}</p>
                  <select className="input-dark w-full px-3 py-2 text-[13px]" value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}>
                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="text-[12px] font-600 mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Industry</label>
            <select className="input-dark w-full px-3 py-2.5 text-[14px]" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-600 mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Tagline</label>
            <input className="input-dark w-full px-3 py-2.5 text-[14px]" placeholder="Your brand tagline" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} />
          </div>

          <div>
            <label className="text-[12px] font-600 mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Brand Voice</label>
            <textarea className="input-dark w-full px-3 py-2.5 text-[14px] resize-none" rows={3}
              placeholder="Professional, witty, empowering, speaks to young Nigerians…"
              value={form.brandVoice} onChange={e => setForm({...form, brandVoice: e.target.value})} />
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setCreating(false); setEditing(null) }} className="btn-ghost flex-1 py-3 text-[14px]">Cancel</button>
            <button onClick={save} disabled={!form.name || saving} className="btn-brand flex-1 py-3 text-[14px] flex items-center justify-center gap-2 disabled:opacity-50">
              <Save size={14} /> {saving ? 'Saving…' : 'Save Kit'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
