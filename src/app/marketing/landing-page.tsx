'use client'
// ViralKit — Landing Page
// Village Circle aesthetic: dark editorial, Nigerian culture, gold accents

import { useState, useEffect } from 'react'
import Link from 'next/link'

const FEATURES = [
  { icon: '🎬', title: 'AI Video Studio', desc: 'Text-to-video and image-to-video with MiniMax, Kling v2, Wan Pro & Luma. Cinematic 15-second videos in under 60 seconds.', accent: '#F59E0B' },
  { icon: '🖼️', title: 'Image Factory', desc: 'FLUX 1.1 Ultra, Ideogram v3, Recraft v3. Generate 4 variants, edit with AI fill, upscale to 4K, remove backgrounds instantly.', accent: '#8B5CF6' },
  { icon: '✍️', title: 'Claude Script AI', desc: 'Any topic → viral script, hooks, captions, hashtags. Real-time streaming generation. Sounds like you, not a robot.', accent: '#06B6D4' },
  { icon: '📅', title: 'Content Calendar', desc: 'AI fills 30 days of ideas in your niche. Drag-drop scheduling, optimal post times, and batch generation built-in.', accent: '#10B981' },
  { icon: '🔥', title: 'Trend Radar', desc: 'Live trending sounds, hashtags, and challenges scanned every 15 minutes across all platforms. One-tap to create.', accent: '#F43F5E' },
  { icon: '📸', title: 'Image-to-Prompt', desc: 'Upload any reference image and AI reverse-engineers the perfect video prompt to recreate that exact style and energy.', accent: '#EC4899' },
  { icon: '🎨', title: 'Brand Kit', desc: 'Your brand colors, fonts, logos, and voice applied to every piece of content automatically. Consistent. Always.', accent: '#6366F1' },
  { icon: '📊', title: 'Analytics Hub', desc: 'Cross-platform stats in one dashboard. Views, engagement rates, best posting times — all your platforms, one screen.', accent: '#14B8A6' },
  { icon: '🏆', title: 'Streak & Badges', desc: 'Daily challenges, creator streaks, and achievement badges keep you consistent and your audience growing daily.', accent: '#F59E0B' },
]

const TESTIMONIALS = [
  { name: 'Adaeze Okonkwo', handle: '@adaeze.creates', city: 'Lagos', text: 'I went from 2k to 47k followers in 3 months. The AI video generation is mad — reels that used to take 8 hours now take 10 minutes.', stat: '+2,300% followers', avatar: 'AO', color: '#F59E0B' },
  { name: 'Emeka Chibuike', handle: '@emekadigital', city: 'Abuja', text: 'My agency runs 23 client accounts from one dashboard. Bulk scheduling + AI captions saved us 40 hours a week. It pays for itself 10x over.', stat: '40hrs/week saved', avatar: 'EC', color: '#8B5CF6' },
  { name: 'Funmi Adesanya', handle: '@funmicooks', city: 'Ibadan', text: 'The Trend Radar is pure gold. Caught a sound 6 hours before it peaked on TikTok. That video hit 800k views. ViralKit literally made me viral.', stat: '800K video views', avatar: 'FA', color: '#F43F5E' },
  { name: 'Kola Bankole', handle: '@kolathebuilder', city: 'Port Harcourt', text: 'As a developer, I thought AI content was hype. Tried ViralKit for my SaaS launch — 4 viral videos in one week. Ship faster, post smarter.', stat: '4 viral videos', avatar: 'KB', color: '#10B981' },
]

const PRICING = [
  { name: 'Free', priceM: 0, priceY: 0, color: '#ffffff20', cta: 'Start free', features: ['10 AI videos/month', '50 AI images/month', '2 social accounts', 'Manual publishing', 'Basic templates', 'Image-to-Prompt'], locked: ['Scheduled publishing', 'Analytics', 'Trend Radar', 'Brand Kit'] },
  { name: 'Basic', priceM: 10000, priceY: 100000, color: '#F59E0B', popular: true, cta: 'Get Basic', features: ['50 AI videos/month', '300 AI images/month', '5 social accounts', 'Scheduled publishing', 'Analytics dashboard', 'Content Calendar', 'Trend Radar', 'Brand Kit', 'Content Vault'], locked: ['White-label export', 'Priority GPU queue', 'API access'] },
  { name: 'Pro', priceM: 25000, priceY: 250000, color: '#8B5CF6', cta: 'Go Pro', features: ['Unlimited videos & images', '15 social accounts', 'All features', 'White-label export', 'Priority GPU queue', 'API access', '4K quality', '3 team seats', 'Dedicated support'], locked: [] },
]

const DAILY_DROPS = [
  '"Before the gun, we had the gong. The gong still calls." — #ViralKitCreators',
  '"The content war is real. Only those who create daily will survive." — #ViralKitCreators',
  '"Your story is the product. AI is just the studio." — #ViralKitCreators',
  '"6 platforms. One dashboard. Zero excuses." — #ViralKitCreators',
  '"A Naija creator with the right tools beats a foreign team." — #ViralKitCreators',
]

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [tick, setTick] = useState(0)
  const [visible, setVisible] = useState(new Set<string>())

  useEffect(() => {
    const t1 = setInterval(() => setTestimonialIdx(p => (p + 1) % TESTIMONIALS.length), 5000)
    const t2 = setInterval(() => setTick(p => p + 1), 3500)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setVisible(p => new Set([...p, (e.target as HTMLElement).dataset.id ?? '']))),
      { threshold: 0.1 }
    )
    document.querySelectorAll('[data-id]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const tst = TESTIMONIALS[testimonialIdx]

  return (
    <div style={{
      background: '#07070F', color: '#EDE8DC',
      fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700;900&display=swap');
        .pf { font-family: 'Playfair Display', Georgia, serif; }
        .gold { background: linear-gradient(90deg,#F59E0B,#EF4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gold-border { border: 1px solid rgba(245,158,11,0.25); }
        .card-fade { opacity: 0; transform: translateY(24px); transition: all 0.6s ease; }
        .card-fade.vis { opacity: 1; transform: translateY(0); }
        .grain { position: fixed; inset: 0; pointer-events: none; z-index: 900; opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .dot-bg { background-image: radial-gradient(circle at 1px 1px, rgba(237,232,220,0.045) 1px, transparent 0); background-size: 32px 32px; }
        .gold-line { background: linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent); height: 1px; }
        @keyframes breathe { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:.85;transform:scale(1.06)} }
        @keyframes tickin { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadein { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .breathe { animation: breathe 4s ease-in-out infinite; }
        .tickin { animation: tickin 0.4s ease-out forwards; }
        .fadein { animation: fadein 0.8s ease-out forwards; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:#07070F} ::-webkit-scrollbar-thumb{background:rgba(245,158,11,0.3);border-radius:2px}
        @media (min-width: 640px) { .sm-show { display: flex !important; } }
      `}} />
      <div className="grain" />

      {/* ambient glows */}
      <div style={{ position: 'fixed', top: '-20%', left: '10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-15%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.055) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(7,7,15,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(237,232,220,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#000' }}>V</div>
          <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: '-0.02em', color: '#EDE8DC' }}>ViralKit</span>
          <span style={{ fontSize: 9, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '2px 7px', marginLeft: 2, letterSpacing: '0.1em' }}>BETA</span>
          <span style={{ fontSize: 9, color: 'rgba(237,232,220,0.25)', margin: '0 4px' }}>·</span>
          <a href="https://villagecircle.ng" style={{ fontSize: 10, color: 'rgba(237,232,220,0.35)', textDecoration: 'none', letterSpacing: '0.06em' }}>villagecircle.ng</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/auth/login" style={{ fontSize: 12, color: 'rgba(237,232,220,0.45)', textDecoration: 'none', letterSpacing: '0.04em' }}>Sign in</Link>
          <Link href="/auth/signup" style={{ fontSize: 12, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 800, padding: '9px 18px', borderRadius: 50, textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            Start free →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="dot-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 60px', textAlign: 'center', position: 'relative' }}>

        {/* daily drop ticker */}
        <div className="fadein" style={{ marginBottom: 32, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 30, background: 'rgba(245,158,11,0.04)' }}>
          <span className="breathe" style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', display: 'inline-block', flexShrink: 0 }} />
          <span className="tickin" key={tick} style={{ color: '#F59E0B', fontSize: 11, fontStyle: 'italic', maxWidth: 380, textAlign: 'left', lineHeight: 1.5 }}>
            {DAILY_DROPS[tick % DAILY_DROPS.length]}
          </span>
        </div>

        <div className="fadein" style={{ animationDelay: '0.1s', marginBottom: 8, fontSize: 11, color: 'rgba(237,232,220,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Part of the <a href="https://villagecircle.ng" style={{ color: '#F59E0B', textDecoration: 'none' }}>Village Circle</a> ecosystem
        </div>

        <h1 className="pf fadein" style={{ fontSize: 'clamp(38px, 8.5vw, 80px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 22, maxWidth: 820, animationDelay: '0.15s', color: '#EDE8DC' }}>
          Create content<br />
          <em style={{ color: '#F59E0B' }}>Nigerians can't scroll past.</em>
        </h1>

        <div className="gold-line fadein" style={{ maxWidth: 400, margin: '0 auto 22px', animationDelay: '0.25s' }} />

        <p className="fadein" style={{ fontSize: 'clamp(14px, 2.2vw, 17px)', color: 'rgba(237,232,220,0.5)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.8, animationDelay: '0.3s' }}>
          AI video & image studio + 6-platform publishing + trend radar + analytics.<br />
          Built by Africans, for African creators who are serious about growth.
        </p>

        <div className="fadein" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', width: '100%', maxWidth: 380, animationDelay: '0.4s' }}>
          <Link href="/auth/signup" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 900, padding: '16px 24px', borderRadius: 14, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 36px rgba(245,158,11,0.28)', letterSpacing: '-0.01em' }}>
            Start creating — it's free 🚀
          </Link>
          <Link href="/auth/login" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(237,232,220,0.04)', border: '1px solid rgba(237,232,220,0.08)', color: 'rgba(237,232,220,0.5)', padding: '14px 24px', borderRadius: 14, fontSize: 14, textDecoration: 'none' }}>
            Sign in to your account
          </Link>
        </div>

        <div className="fadein" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28, color: 'rgba(237,232,220,0.3)', fontSize: 12, animationDelay: '0.5s' }}>
          <div style={{ display: 'flex' }}>
            {['#F59E0B','#8B5CF6','#F43F5E','#10B981','#06B6D4'].map((c, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #07070F', marginLeft: i ? -8 : 0, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000' }}>
                {['AO','EC','FA','IB','KN'][i]}
              </div>
            ))}
          </div>
          <span><strong style={{ color: 'rgba(237,232,220,0.6)' }}>18,000+</strong> creators already growing</span>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(237,232,220,0.18)' }}>scroll to explore</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(245,158,11,0.5), transparent)' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ borderTop: '1px solid rgba(237,232,220,0.05)', borderBottom: '1px solid rgba(237,232,220,0.05)', background: 'rgba(237,232,220,0.015)', padding: '36px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px 16px' }}>
          {[['2.4M+','Videos generated'],['18K+','Active creators'],['340M+','Total views earned'],['6 mins','To first video']].map(([v, l], i) => (
            <div key={v} data-id={`stat-${i}`} className={`card-fade ${visible.has(`stat-${i}`) ? 'vis' : ''}`} style={{ textAlign: 'center' }}>
              <div className="pf" style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 12, color: 'rgba(237,232,220,0.3)', marginTop: 5, letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PLATFORMS ── */}
      <div style={{ padding: '44px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 10, color: 'rgba(237,232,220,0.22)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 24 }}>Publish directly to all platforms</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          {[['YT','YouTube','#FF0000'],['IG','Instagram','#E1306C'],['TK','TikTok','#69C9D0'],['X','X/Twitter','#1DA1F2'],['LI','LinkedIn','#0077B5'],['FB','Facebook','#1877F2']].map(([abbr,name,color]) => (
            <div key={abbr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color }}>{abbr}</div>
              <span style={{ fontSize: 10, color: 'rgba(237,232,220,0.28)' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES GRID ── */}
      <section style={{ padding: '60px 20px', maxWidth: 900, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', color: '#F59E0B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 14 }}>What you get</p>
        <h2 className="pf" style={{ fontSize: 'clamp(28px,6vw,50px)', fontWeight: 900, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 10, color: '#EDE8DC', lineHeight: 1.08 }}>
          Everything to dominate<br />
          <em style={{ color: '#F59E0B' }}>every platform</em>
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(237,232,220,0.35)', marginBottom: 44, fontSize: 14, maxWidth: 480, margin: '0 auto 44px' }}>One studio. Six platforms. The best AI models on the planet.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} data-id={`feat-${i}`} className={`card-fade ${visible.has(`feat-${i}`) ? 'vis' : ''}`}
              style={{ padding: '22px 20px', borderRadius: 16, border: `1px solid ${f.accent}22`, background: `${f.accent}06`, transitionDelay: `${(i % 3) * 0.05}s` }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#EDE8DC', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(237,232,220,0.38)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NAIJA CONTENT SPOTLIGHT ── */}
      <section style={{ padding: '60px 20px', background: 'rgba(237,232,220,0.01)', borderTop: '1px solid rgba(237,232,220,0.05)', borderBottom: '1px solid rgba(237,232,220,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ color: '#F59E0B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>Built for the Naija creator</p>
          <h2 className="pf" style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, textAlign: 'center', marginBottom: 10, color: '#EDE8DC', lineHeight: 1.1 }}>
            The type of videos<br /><em style={{ color: '#F59E0B' }}>Nigerians are making now</em>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(237,232,220,0.35)', marginBottom: 44, fontSize: 14, maxWidth: 520, margin: '0 auto 44px' }}>
            Fictional shorts, Afrobeats-synced clips, market hustle stories, street-food ASMR, financial freedom journeys — ViralKit has templates for all of it.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {[
              ['🎭', 'Nollywood Short', 'Cinematic Naija drama, betrayal storyline, emotional soundtrack, 9:16 portrait'],
              ['💰', 'From Nothing Story', 'Young Naija hustler glow-up montage, Lagos streets to penthouse, motivational energy'],
              ['🍲', 'Street Food ASMR', 'Jollof rice cooking closeup, steam rising, sizzling sounds, warm market light'],
              ['🎵', 'Afrobeats Sync', 'Dance reveal trending sound, fast cuts, Lagos skyline, energy drops on beat'],
              ['📱', 'Tech Nigeria Review', 'iPhone vs Tecno comparison, street-style unboxing, Pidgin commentary overlay'],
              ['🏠', 'Real Estate Flex', 'Luxury Lekki apartment tour, drone footage, sunset views, premium Nigeria living'],
              ['👗', 'Fashion Drop', 'Ankara print reveal, designer Agbada showcase, NNPC money vibes editorial'],
              ['⚽', 'Super Eagles Hype', 'AFCON match energy, slow-motion goal celebration, crowd roar, fire graphics'],
            ].map(([icon, title, desc], i) => (
              <div key={title} data-id={`naija-${i}`} className={`card-fade ${visible.has(`naija-${i}`) ? 'vis' : ''}`}
                style={{ padding: '20px 18px', borderRadius: 16, background: 'rgba(237,232,220,0.025)', border: '1px solid rgba(237,232,220,0.07)', transitionDelay: `${(i % 4) * 0.05}s` }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#EDE8DC', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: 'rgba(237,232,220,0.38)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMIFICATION ── */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#F59E0B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 14 }}>Stay consistent</p>
          <h2 className="pf" style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, marginBottom: 10, color: '#EDE8DC', lineHeight: 1.1 }}>
            Post daily. <em style={{ color: '#F59E0B' }}>Get rewarded.</em>
          </h2>
          <p style={{ color: 'rgba(237,232,220,0.35)', marginBottom: 44, fontSize: 14 }}>Daily challenges, streaks, and badges make content creation genuinely fun.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {[
              ['🔥', 'Daily Streak', 'Post every day and watch your flame grow. Streak shields protect you on rough days.'],
              ['🏆', 'Creator Rank', 'Earn XP for every video and image. Rise from Rookie → Grinder → Viral → Legend.'],
              ['🎯', 'Daily Challenges', 'Fresh missions every day. Earn bonus generation credits for completing them.'],
              ['🎁', 'Creator Rewards', 'Hit 7-day streaks for free credits. Unlock premium templates and early model access.'],
            ].map(([e, t, d], i) => (
              <div key={t} data-id={`gam-${i}`} className={`card-fade ${visible.has(`gam-${i}`) ? 'vis' : ''}`}
                style={{ padding: 20, borderRadius: 16, background: 'rgba(237,232,220,0.025)', border: '1px solid rgba(237,232,220,0.07)', textAlign: 'left', transitionDelay: `${i * 0.05}s` }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{e}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#EDE8DC', marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'rgba(237,232,220,0.35)', lineHeight: 1.65 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '60px 20px', maxWidth: 680, margin: '0 auto' }}>
        <p style={{ color: '#F59E0B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>Creator stories</p>
        <h2 className="pf" style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, textAlign: 'center', marginBottom: 40, color: '#EDE8DC', lineHeight: 1.1 }}>
          Real creators. <em style={{ color: '#F59E0B' }}>Real results.</em>
        </h2>
        <div style={{ background: 'rgba(237,232,220,0.025)', border: '1px solid rgba(237,232,220,0.08)', borderRadius: 20, padding: '28px 24px', minHeight: 200 }}>
          <div className="gold-line" style={{ marginBottom: 20 }} />
          <p style={{ fontSize: 'clamp(14px,3vw,17px)', color: 'rgba(237,232,220,0.75)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 24 }}>"{tst.text}"</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: tst.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000' }}>{tst.avatar}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#EDE8DC' }}>{tst.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(237,232,220,0.35)' }}>{tst.handle} · {tst.city}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="pf" style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B' }}>{tst.stat}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setTestimonialIdx(i)}
              style={{ width: i === testimonialIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === testimonialIdx ? '#F59E0B' : 'rgba(237,232,220,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '60px 20px', background: 'rgba(237,232,220,0.01)', borderTop: '1px solid rgba(237,232,220,0.05)', borderBottom: '1px solid rgba(237,232,220,0.05)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ color: '#F59E0B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>Pricing</p>
          <h2 className="pf" style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, textAlign: 'center', marginBottom: 8, color: '#EDE8DC', lineHeight: 1.1 }}>
            Pricing that <em style={{ color: '#F59E0B' }}>pays for itself</em>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(237,232,220,0.3)', marginBottom: 28, fontSize: 14 }}>Pay in Naira. No hidden fees. Cancel anytime.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', background: 'rgba(237,232,220,0.04)', border: '1px solid rgba(237,232,220,0.08)', borderRadius: 50, padding: 4, gap: 4 }}>
              {(['monthly','yearly'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  style={{ padding: '8px 18px', borderRadius: 50, border: 'none', background: billing === b ? 'rgba(237,232,220,0.08)' : 'transparent', color: billing === b ? '#EDE8DC' : 'rgba(237,232,220,0.35)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {b === 'yearly' ? 'Yearly — save 17%' : 'Monthly'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {PRICING.map((p, i) => {
              const price = billing === 'monthly' ? p.priceM : Math.round(p.priceY / 12)
              return (
                <div key={p.name} data-id={`price-${i}`} className={`card-fade ${visible.has(`price-${i}`) ? 'vis' : ''}`}
                  style={{ position: 'relative', padding: 24, borderRadius: 20, background: '#0c0c18', border: `1px solid ${(p as any).popular ? p.color : 'rgba(237,232,220,0.07)'}`, borderWidth: (p as any).popular ? 1.5 : 1 }}>
                  {(p as any).popular && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${p.color},#EF4444)`, color: '#000', fontSize: 9, fontWeight: 900, padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>MOST POPULAR</div>
                  )}
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(237,232,220,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 16 }}>
                    {price > 0 && <span style={{ fontSize: 13, color: 'rgba(237,232,220,0.4)' }}>₦</span>}
                    <span className="pf" style={{ fontSize: 36, fontWeight: 900, color: '#EDE8DC' }}>{price === 0 ? 'Free' : price.toLocaleString()}</span>
                    {price > 0 && <span style={{ fontSize: 13, color: 'rgba(237,232,220,0.3)' }}>/mo</span>}
                  </div>
                  {billing === 'yearly' && p.priceY > 0 && (
                    <div style={{ fontSize: 11, color: '#10B981', marginTop: -12, marginBottom: 12 }}>₦{p.priceY.toLocaleString()} billed yearly</div>
                  )}
                  <Link href="/auth/signup" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 12, background: (p as any).popular ? `linear-gradient(135deg,${p.color},#EF4444)` : 'rgba(237,232,220,0.06)', color: (p as any).popular ? '#000' : '#EDE8DC', fontWeight: 700, fontSize: 14, textDecoration: 'none', marginBottom: 20, border: (p as any).popular ? 'none' : '1px solid rgba(237,232,220,0.1)' }}>
                    {p.cta}
                  </Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(237,232,220,0.55)' }}>
                        <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span>{f}
                      </div>
                    ))}
                    {p.locked.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(237,232,220,0.18)', textDecoration: 'line-through' }}>
                        <span style={{ flexShrink: 0 }}>✕</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(237,232,220,0.18)', marginTop: 24 }}>7-day free trial on all paid plans · No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ── VILLAGE CIRCLE BADGE ── */}
      <section style={{ padding: '44px 20px', textAlign: 'center', borderBottom: '1px solid rgba(237,232,220,0.05)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '18px 28px', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, background: 'rgba(245,158,11,0.04)', marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>🌍</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#EDE8DC', marginBottom: 3 }}>Part of Village Circle</div>
              <div style={{ fontSize: 12, color: 'rgba(237,232,220,0.38)', lineHeight: 1.5 }}>Alongside KoloAI, AmeboGist, EduCenter & more — built for African sovereignty.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['AmeboGist','🗞️'],['EduCenter','🎓'],['KoloAI','🪙'],['PlanAI','📋']].map(([name, emoji]) => (
              <span key={name} style={{ fontSize: 12, color: 'rgba(237,232,220,0.3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>{emoji}</span>{name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PWA BANNER ── */}
      <section style={{ padding: '44px 20px', background: 'rgba(245,158,11,0.04)', borderBottom: '1px solid rgba(245,158,11,0.08)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📱</div>
          <h3 className="pf" style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#EDE8DC' }}>Get the ViralKit app</h3>
          <p style={{ fontSize: 14, color: 'rgba(237,232,220,0.38)', marginBottom: 20 }}>Install on iOS or Android. Works offline for drafts, push notifications for your scheduled posts.</p>
          <a href="/install" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: 'rgba(237,232,220,0.06)', border: '1px solid rgba(237,232,220,0.1)', color: '#EDE8DC', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            📲 Add to Home Screen (PWA)
          </a>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '90px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <div className="gold-line" style={{ maxWidth: 300, margin: '0 auto 28px' }} />
          <h2 className="pf" style={{ fontSize: 'clamp(30px,7vw,58px)', fontWeight: 900, lineHeight: 1.0, marginBottom: 16, color: '#EDE8DC' }}>
            Your audience is<br />
            <em style={{ color: '#F59E0B' }}>waiting for you.</em>
          </h2>
          <p style={{ color: 'rgba(237,232,220,0.35)', fontSize: 15, marginBottom: 32 }}>
            Join 18,000+ creators making content that stops the scroll.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#000', fontWeight: 900, padding: '18px 36px', borderRadius: 16, fontSize: 17, textDecoration: 'none', boxShadow: '0 12px 44px rgba(245,158,11,0.28)', letterSpacing: '-0.01em' }}>
            Start creating — it's free 🚀
          </Link>
          <p style={{ color: 'rgba(237,232,220,0.18)', fontSize: 12, marginTop: 14 }}>No credit card · Free forever plan · Takes 30 seconds</p>
          <div className="gold-line" style={{ maxWidth: 300, margin: '28px auto 0' }} />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(237,232,220,0.05)', padding: '44px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#000' }}>V</div>
                <span style={{ fontWeight: 900, color: '#EDE8DC' }}>ViralKit</span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(237,232,220,0.25)', lineHeight: 1.65 }}>The AI content studio built for African creators. Part of Village Circle.</p>
            </div>
            {[
              { title: 'Product', links: [['Features','#'],['Pricing','#pricing'],['Changelog','#'],['Roadmap','#']] },
              { title: 'Company', links: [['About','#'],['Blog','#'],['Contact','#'],['Village Circle','https://villagecircle.ng']] },
              { title: 'Legal', links: [['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Cookies','#'],['Refunds','#']] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 10, color: 'rgba(237,232,220,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>{col.title}</div>
                {col.links.map(([label, href]) => (
                  <div key={label} style={{ marginBottom: 8 }}>
                    <a href={href} style={{ fontSize: 12, color: 'rgba(237,232,220,0.25)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(237,232,220,0.6)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(237,232,220,0.25)'}
                    >{label}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(237,232,220,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'rgba(237,232,220,0.18)' }}>© {new Date().getFullYear()} ViralKit · <a href="https://villagecircle.ng" style={{ color: 'rgba(237,232,220,0.3)', textDecoration: 'none' }}>villagecircle.ng</a></p>
            <p style={{ fontSize: 12, color: 'rgba(237,232,220,0.18)' }}>🇳🇬 Made with ♥ in Nigeria</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
