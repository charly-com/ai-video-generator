'use client'
// ViralMint — Landing Page
// Fully mobile responsive, conversion optimized

import { useState, useEffect } from 'react'
import Link from 'next/link'

const FEATURES = [
  { icon: '🎬', title: 'AI Video Studio', desc: 'Text-to-video and image-to-video using MiniMax, Kling v2, and Wan Pro. 15s cinematic videos in under 60 seconds.', accent: '#F59E0B' },
  { icon: '🖼️', title: 'Image Factory', desc: 'FLUX 1.1 Ultra, Ideogram, and Recraft. Generate 4 variants, edit with AI, upscale to 4K, remove backgrounds instantly.', accent: '#8B5CF6' },
  { icon: '✍️', title: 'Claude Script AI', desc: 'Turn any topic into a viral script, hooks, captions, and hashtags. Real-time streaming generation for every platform.', accent: '#06B6D4' },
  { icon: '📅', title: 'Content Calendar', desc: 'AI-fills 30 days of ideas in your niche. Drag-drop scheduling, optimal post times, and batch generation built-in.', accent: '#10B981' },
  { icon: '🔥', title: 'Trend Radar', desc: 'Live trending sounds, hashtags, and challenges scanned every 15 minutes. One-tap to create content on any trend.', accent: '#F43F5E' },
  { icon: '🎨', title: 'Brand Kit', desc: 'Your brand colors, fonts, logos, and voice applied to every piece of content automatically. Consistent. Always.', accent: '#6366F1' },
  { icon: '📊', title: 'Analytics Hub', desc: 'Cross-platform stats in one dashboard. Views, engagement rates, best posting times — all your platforms, one screen.', accent: '#14B8A6' },
  { icon: '🏆', title: 'Streak & Badges', desc: 'Daily challenges, creator streaks, and achievement badges keep you consistent and your audience growing daily.', accent: '#F59E0B' },
  { icon: '🗄️', title: 'Content Vault', desc: 'Every video and image you generate is stored, searchable, and ready to repurpose. Never lose a piece of content.', accent: '#EC4899' },
]

const TESTIMONIALS = [
  { name: 'Adaeze Okonkwo', handle: '@adaeze.creates', city: 'Lagos', text: 'I went from 2k to 47k followers in 3 months. The AI video generation is insane — reels that used to take 8 hours now take 10 minutes.', stat: '+2,300% followers', avatar: 'AO', color: '#F59E0B' },
  { name: 'Emeka Chibuike', handle: '@emekadigital', city: 'Abuja', text: 'My agency now runs 23 client accounts from one dashboard. The bulk scheduling + AI captions saved us 40 hours a week. It pays for itself 10x over.', stat: '40hrs/week saved', avatar: 'EC', color: '#8B5CF6' },
  { name: 'Funmi Adesanya', handle: '@funmicooks', city: 'Ibadan', text: 'The Trend Radar is gold. I caught a sound 6 hours before it peaked on TikTok. That video hit 800k views. ViralMint literally made me viral.', stat: '800K video views', avatar: 'FA', color: '#F43F5E' },
]

const PRICING = [
  { name: 'Free', priceM: 0, priceY: 0, color: '#ffffff20', cta: 'Start free', features: ['10 AI videos/month', '50 AI images/month', '2 social accounts', 'Manual publishing', 'Basic templates'], locked: ['Scheduled publishing', 'Analytics', 'Trend Radar', 'Brand Kit'] },
  { name: 'Basic', priceM: 10000, priceY: 100000, color: '#F59E0B', popular: true, cta: 'Get Basic', features: ['50 AI videos/month', '300 AI images/month', '5 social accounts', 'Scheduled publishing', 'Analytics dashboard', 'Content Calendar', 'Trend Radar', 'Brand Kit', 'Content Vault'], locked: ['White-label export', 'Priority GPU queue', 'API access'] },
  { name: 'Pro', priceM: 25000, priceY: 250000, color: '#8B5CF6', cta: 'Get Pro', features: ['Unlimited videos & images', '15 social accounts', 'All features', 'White-label export', 'Priority GPU queue', 'API access', '4K quality', '3 team seats', 'Dedicated support'], locked: [] },
]

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(p => (p + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const t = TESTIMONIALS[testimonialIdx]

  return (
    <div style={{ background: '#07070F', color: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#000' }}>V</div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em' }}>ViralMint</span>
          <span style={{ fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '2px 7px', marginLeft: 2 }}>BETA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'none' }} className="sm-show">Sign in</Link>
          <Link href="/auth/signup" style={{ fontSize: 13, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 700, padding: '9px 18px', borderRadius: 50, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Start free →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 16px 60px', textAlign: 'center', position: 'relative' }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 50, padding: '8px 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          Wan 2.1 Pro 4K video is now live
          <span style={{ color: '#F59E0B' }}>→</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 20, maxWidth: 800 }}>
          Create content<br />
          <span style={{ background: 'linear-gradient(90deg,#F59E0B,#EF4444,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            that actually goes
          </span>
          <br />viral. Every time.
        </h1>

        <p style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', color: 'rgba(255,255,255,0.45)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
          AI video & image studio + 6-platform publishing + trend radar + analytics. Built for African creators who are serious about growth.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', width: '100%', maxWidth: 400 }}>
          <Link href="/auth/signup" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 900, padding: '16px 24px', borderRadius: 16, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(245,158,11,0.3)' }}>
            Start minting — it's free 🚀
          </Link>
          <Link href="/auth/login" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', padding: '14px 24px', borderRadius: 16, fontSize: 14, textDecoration: 'none' }}>
            Sign in to your account
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          <div style={{ display: 'flex' }}>
            {['#F59E0B','#8B5CF6','#F43F5E','#10B981','#06B6D4'].map((c, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #07070F', marginLeft: i ? -8 : 0, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000' }}>
                {['AO','EC','FA','IB','KN'][i]}
              </div>
            ))}
          </div>
          <span><strong style={{ color: 'rgba(255,255,255,0.6)' }}>18,000+</strong> creators already minting content</span>
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', padding: '32px 16px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px 12px' }}>
          {[['2.4M+','Videos generated'],['18K+','Active creators'],['340M+','Total views earned'],['6 mins','To first video']].map(([v, l]) => (
            <div key={v} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(22px,5vw,32px)', fontWeight: 900, background: 'linear-gradient(90deg,#F59E0B,#EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PLATFORMS */}
      <div style={{ padding: '40px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>Publish directly to all platforms</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {[['YT','YouTube','#FF0000'],['IG','Instagram','#E1306C'],['TK','TikTok','#69C9D0'],['X','X/Twitter','#1DA1F2'],['LI','LinkedIn','#0077B5'],['FB','Facebook','#1877F2']].map(([abbr,name,color]) => (
            <div key={abbr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color }}>{abbr}</div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES GRID */}
      <section style={{ padding: '60px 16px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(28px,6vw,48px)', fontWeight: 900, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 12 }}>
          Everything to dominate<br />
          <span style={{ background: 'linear-gradient(90deg,#F59E0B,#EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>every platform</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', marginBottom: 40, fontSize: 15 }}>One studio. Six platforms. The best AI models on the planet.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ padding: 20, borderRadius: 16, border: `1px solid ${f.accent}33`, background: `${f.accent}08` }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GAMIFICATION SPOTLIGHT */}
      <section style={{ padding: '60px 16px', background: 'rgba(245,158,11,0.03)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, marginBottom: 10 }}>
            Stay consistent.{' '}
            <span style={{ background: 'linear-gradient(90deg,#F59E0B,#EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get rewarded.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 40, fontSize: 14 }}>Daily challenges, streaks, and badges make content creation genuinely fun.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {[
              ['🔥','Daily Streak','Post every day and watch your flame grow. Weekly streak shields protect you on rough days. Longest streak wins rewards.'],
              ['🏆','Creator Rank','Earn XP for every video, image, and publish. Rise from Rookie → Grinder → Viral → Legend. Unlock exclusive models.'],
              ['🎯','Daily Challenges','Fresh missions every day: "Make a reel with this trending sound", "Post to 3 platforms". Earn bonus generation credits.'],
              ['🎁','Creator Rewards','Hit 7-day streaks for free credits. Unlock premium templates, early model access, and discounts on plan upgrades.'],
            ].map(([e, t, d]) => (
              <div key={t} style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'left' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{e}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '60px 16px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, textAlign: 'center', marginBottom: 40 }}>
          Real creators.{' '}
          <span style={{ background: 'linear-gradient(90deg,#F59E0B,#EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real results.</span>
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px', minHeight: 200 }}>
          <div style={{ fontSize: 48, color: 'rgba(255,255,255,0.08)', fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>"</div>
          <p style={{ fontSize: 'clamp(14px,3vw,18px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontWeight: 500, marginBottom: 24 }}>{t.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000' }}>{t.avatar}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t.handle} · {t.city}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(90deg,#F59E0B,#EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.stat}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setTestimonialIdx(i)}
              style={{ width: i === testimonialIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === testimonialIdx ? '#F59E0B' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '60px 16px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>
            Pricing that{' '}
            <span style={{ background: 'linear-gradient(90deg,#F59E0B,#EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>pays for itself</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginBottom: 28, fontSize: 14 }}>Pay in Naira. No hidden fees. Cancel anytime.</p>

          {/* Billing toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 50, padding: 4, gap: 4 }}>
              {(['monthly','yearly'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  style={{ padding: '8px 18px', borderRadius: 50, border: 'none', background: billing === b ? 'rgba(255,255,255,0.1)' : 'transparent', color: billing === b ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {b === 'yearly' ? 'Yearly — save 17%' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {PRICING.map(p => {
              const price = billing === 'monthly' ? p.priceM : Math.round(p.priceY / 12)
              return (
                <div key={p.name} style={{ position: 'relative', padding: 24, borderRadius: 20, background: '#0d0d1a', border: `1px solid ${p.popular ? p.color : 'rgba(255,255,255,0.08)'}`, borderWidth: p.popular ? 1.5 : 1 }}>
                  {p.popular && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${p.color},#EF4444)`, color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>MOST POPULAR</div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 16 }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>₦</span>
                    <span style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>{price.toLocaleString()}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>/mo</span>
                  </div>
                  {billing === 'yearly' && p.priceY > 0 && (
                    <div style={{ fontSize: 11, color: '#10B981', marginTop: -12, marginBottom: 12 }}>₦{p.priceY.toLocaleString()} billed yearly</div>
                  )}
                  <Link href="/auth/signup" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, background: p.popular ? `linear-gradient(135deg,${p.color},#EF4444)` : 'rgba(255,255,255,0.07)', color: p.popular ? '#000' : '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', marginBottom: 20, border: p.popular ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                    {p.cta}
                  </Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                        <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span>{f}
                      </div>
                    ))}
                    {p.locked.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'line-through' }}>
                        <span style={{ flexShrink: 0 }}>✕</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 24 }}>7-day free trial on all paid plans · No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* INSTALL PWA BANNER */}
      <section style={{ padding: '40px 16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))', borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
          <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Get the ViralMint app</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Install on iOS or Android for the full creator experience. Works offline for drafts, push notifications for your scheduled posts.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/install" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              📲 Add to Home Screen (PWA)
            </a>
            <a href="https://play.google.com" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              🤖 Android APK
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '80px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(30px,7vw,56px)', fontWeight: 900, lineHeight: 0.95, marginBottom: 16 }}>
            Your audience is<br />
            <span style={{ background: 'linear-gradient(90deg,#F59E0B,#EF4444,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              waiting for you.
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, marginBottom: 32 }}>
            Join 18,000+ creators making content that stops the scroll.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 900, padding: '18px 36px', borderRadius: 18, fontSize: 17, textDecoration: 'none', boxShadow: '0 12px 40px rgba(245,158,11,0.3)' }}>
            Start minting — it's free 🚀
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 14 }}>No credit card · Free forever plan · Takes 30 seconds</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 16px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>V</div>
                <span style={{ fontWeight: 900, color: '#fff' }}>ViralMint</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>The AI content studio built for African creators.</p>
            </div>
            {[
              { title: 'Product', links: ['Features','Pricing','Changelog','API Docs','Roadmap'] },
              { title: 'Company', links: ['About','Blog','Careers','Press','Contact'] },
              { title: 'Legal', links: ['Privacy','Terms','Cookies','Refunds'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ marginBottom: 8 }}>
                    <a href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>{link}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 ViralMint. All rights reserved.</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>🇳🇬 Made with ♥ in Nigeria</p>
          </div>
        </div>
      </footer>
    </div>
  )
}