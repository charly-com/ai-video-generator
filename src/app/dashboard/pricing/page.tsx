'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free', priceM: 0, priceY: 0, color: 'rgba(255,255,255,0.1)', textColor: '#fff',
    features: ['10 AI videos/month', '50 AI images/month', '2 social accounts', 'Basic templates', 'Manual publishing'],
    locked: ['Scheduled publishing', 'Analytics', 'Trend Radar', 'Brand Kit', 'Content Calendar'],
    current: false,
  },
  {
    name: 'Basic', priceM: 10000, priceY: 100000, color: '#F59E0B', textColor: '#000', popular: true, current: true,
    features: ['50 AI videos/month', '300 AI images/month', '5 social accounts', 'Scheduled publishing', 'Analytics dashboard', 'Content Calendar', 'Trend Radar', 'Brand Kit', 'Content Vault'],
    locked: ['White-label export', 'Priority GPU queue', 'API access', '4K quality'],
  },
  {
    name: 'Pro', priceM: 25000, priceY: 250000, color: '#8B5CF6', textColor: '#fff',
    features: ['Unlimited videos & images', '15 social accounts', 'All features unlocked', 'Priority GPU queue', 'White-label export', 'API access', '4K quality output', '3 team seats', 'Dedicated support'],
    locked: [],
  },
  {
    name: 'Agency', priceM: 75000, priceY: 750000, color: 'linear-gradient(135deg,#F59E0B,#EF4444)', textColor: '#000',
    features: ['Unlimited everything', 'Unlimited social accounts', 'Unlimited team members', 'Custom AI model training', 'Dedicated GPU', 'Full white-label', 'Custom integrations', 'SLA guarantee', 'Dedicated account manager'],
    locked: [],
  },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  async function upgrade(planName: string) {
    setLoading(planName)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize', plan: planName.toLowerCase(), billingCycle: billing }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = data.data.authorizationUrl
      } else {
        alert(data.error || 'Payment initialization failed')
      }
    } catch (e) {
      alert('Failed to start checkout: ' + String(e))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', overflowX: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
          Upgrade your plan 💎
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>
          You&apos;re on <strong style={{ color: '#F59E0B' }}>Basic</strong>. Upgrade to unlock more and grow faster.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 50, padding: 4, gap: 4 }}>
          {(['monthly', 'yearly'] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)}
              style={{ padding: '8px 20px', borderRadius: 50, border: 'none', background: billing === b ? 'rgba(255,255,255,0.1)' : 'transparent', color: billing === b ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              {b === 'yearly' ? '📅 Yearly — save 17%' : '📆 Monthly'}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {PLANS.map(plan => {
          const price = billing === 'monthly' ? plan.priceM : Math.round(plan.priceY / 12)
          const isLoading = loading === plan.name

          return (
            <div key={plan.name} style={{ position: 'relative', padding: 20, borderRadius: 18, background: '#0d0d1a', border: `1.5px solid ${plan.popular ? plan.color : plan.current ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)'}` }}>
              {plan.popular && <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: plan.textColor, fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>MOST POPULAR</div>}
              {plan.current && <div style={{ position: 'absolute', top: -11, right: 16, background: '#10B981', color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 20 }}>CURRENT</div>}

              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{plan.name}</div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: plan.priceY > 0 && billing === 'yearly' ? 4 : 16 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>₦</span>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{price.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>/mo</span>
              </div>

              {billing === 'yearly' && plan.priceY > 0 && (
                <div style={{ fontSize: 11, color: '#10B981', marginBottom: 14 }}>₦{plan.priceY.toLocaleString()} billed yearly</div>
              )}

              <button
                onClick={() => plan.current ? null : upgrade(plan.name)}
                disabled={plan.current || isLoading}
                style={{
                  display: 'block', width: '100%', padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  background: plan.current ? 'rgba(255,255,255,0.05)' : typeof plan.color === 'string' && plan.color.startsWith('#') ? plan.color : plan.color,
                  color: plan.current ? 'rgba(255,255,255,0.3)' : plan.textColor,
                  border: 'none', cursor: plan.current ? 'default' : 'pointer', marginBottom: 16,
                  fontFamily: 'inherit', opacity: isLoading ? 0.7 : 1,
                }}>
                {isLoading ? '⏳ Opening Paystack...' : plan.current ? '✓ Current plan' : `Upgrade to ${plan.name} →`}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.55)', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                  </div>
                ))}
                {plan.locked.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 7, fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'line-through', alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, marginTop: 1 }}>✕</span>{f}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 32, padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Common questions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, cancel in your settings. You keep access until the period ends.' },
            { q: 'What payment methods?', a: 'Paystack — accepts all Nigerian bank cards, bank transfer, and USSD.' },
            { q: 'Is there a free trial?', a: '7-day full-featured trial on Basic and Pro. No card needed.' },
            { q: 'What happens to my content?', a: 'Your content is always yours. We never delete it even if you downgrade.' },
          ].map(item => (
            <div key={item.q}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.q}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 20 }}>
        🔒 Payments secured by Paystack · 7-day free trial on paid plans · Cancel anytime
      </p>
    </div>
  )
}
