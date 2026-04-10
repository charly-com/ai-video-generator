import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of ViralKit.',
}

const LAST_UPDATED = 'April 11, 2025'

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100dvh', background: '#07070F', color: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 900, margin: '0 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#000' }}>V</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>ViralKit</span>
        </Link>
        <Link href="/privacy" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Privacy Policy →</Link>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', fontSize: 12, color: '#F59E0B', fontWeight: 600, marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Legal
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.15 }}>Terms of Service</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <Callout>
          Please read these Terms carefully before using ViralKit. By accessing or using our service you agree to be bound by them. If you do not agree, do not use the service.
        </Callout>

        <Section title="1. Acceptance of Terms">
          <P>These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and ViralKit (&ldquo;ViralKit&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) governing your access to and use of the website, mobile application, and related services (collectively, the &ldquo;Service&rdquo;).</P>
          <P>If you are using the Service on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.</P>
        </Section>

        <Section title="2. Eligibility">
          <P>You must be at least 16 years old to use ViralKit. By using the Service you represent and warrant that you meet this requirement and that you have the legal capacity to enter into a binding agreement.</P>
        </Section>

        <Section title="3. Account Registration">
          <P>To access most features you must create an account. You agree to:</P>
          <List items={[
            'Provide accurate and complete information during registration',
            'Keep your login credentials confidential',
            'Notify us immediately of any unauthorised access to your account',
            'Be responsible for all activity that occurs under your account',
          ]} />
          <P>We reserve the right to suspend or terminate accounts that violate these Terms or that we believe to be used fraudulently.</P>
        </Section>

        <Section title="4. Subscriptions &amp; Billing">
          <SubHeading>4.1 Plans</SubHeading>
          <P>ViralKit offers free and paid subscription plans. Paid plans are billed on a monthly or annual basis as selected at checkout. Plan details, pricing, and included limits are described on our pricing page.</P>

          <SubHeading>4.2 Payment</SubHeading>
          <P>Payments are processed by Paystack. By subscribing you authorise us to charge the payment method on file on each billing cycle. All prices are in USD unless stated otherwise.</P>

          <SubHeading>4.3 Cancellations &amp; Refunds</SubHeading>
          <P>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period — you retain access until then. We do not offer prorated refunds for partial periods except where required by applicable law.</P>

          <SubHeading>4.4 Price Changes</SubHeading>
          <P>We may change subscription prices with at least 30 days&apos; notice. Continued use after the effective date constitutes acceptance of the new price.</P>
        </Section>

        <Section title="5. Acceptable Use">
          <P>You agree not to use the Service to:</P>
          <List items={[
            'Violate any applicable law or regulation',
            'Infringe the intellectual property rights of any third party',
            'Generate, publish, or distribute content that is defamatory, obscene, harassing, hateful, or discriminatory',
            'Create or distribute misinformation, deepfakes intended to deceive, or non-consensual intimate imagery',
            'Spam, phish, or conduct any unsolicited commercial communications',
            'Attempt to gain unauthorised access to our systems or other users\' accounts',
            'Reverse-engineer, decompile, or extract source code from the Service',
            'Use automated scraping, crawling, or data harvesting tools except as expressly permitted by our API terms',
            'Circumvent usage limits or billing controls',
            'Resell or sub-license access to the Service without our written permission',
          ]} />
        </Section>

        <Section title="6. Content Ownership &amp; License">
          <SubHeading>6.1 Your Content</SubHeading>
          <P>You retain all intellectual property rights in the prompts you submit and the content generated on your behalf using ViralKit. You grant us a limited, non-exclusive, worldwide licence to store, process, and transmit your content solely to provide the Service.</P>

          <SubHeading>6.2 AI-Generated Content</SubHeading>
          <P>AI-generated outputs may be subject to the terms of the underlying model providers (e.g., fal.ai). You are responsible for ensuring your use of generated content complies with applicable laws and third-party rights.</P>

          <SubHeading>6.3 Our Intellectual Property</SubHeading>
          <P>The ViralKit name, logo, UI design, and all proprietary technology remain the exclusive property of ViralKit. Nothing in these Terms grants you a licence to use our trademarks or proprietary materials.</P>
        </Section>

        <Section title="7. Third-Party Services">
          <P>The Service integrates with third-party platforms and APIs (Google, YouTube, Instagram, TikTok, Twitter/X, fal.ai, Paystack, and others). Your use of those platforms is subject to their own terms of service. We are not responsible for the acts or omissions of third-party services.</P>
        </Section>

        <Section title="8. Disclaimers">
          <P>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</P>
          <P>We do not warrant that the Service will be uninterrupted, error-free, or free of viruses. AI-generated outputs may be inaccurate, incomplete, or inappropriate — you are responsible for reviewing content before publishing.</P>
        </Section>

        <Section title="9. Limitation of Liability">
          <P>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VIRALKIT AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</P>
          <P>OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) USD $50.</P>
        </Section>

        <Section title="10. Indemnification">
          <P>You agree to indemnify and hold harmless ViralKit and its affiliates from any claims, damages, losses, liabilities, costs, or expenses (including reasonable attorney&apos;s fees) arising from: (a) your use of the Service; (b) content you create or publish; (c) your violation of these Terms; or (d) your violation of any third-party rights.</P>
        </Section>

        <Section title="11. Termination">
          <P>We may suspend or terminate your access to the Service at any time, with or without notice, if we reasonably believe you have violated these Terms or if required by law. You may also delete your account at any time from the settings page.</P>
          <P>Upon termination, your right to use the Service ceases immediately. Sections that by their nature should survive (including 6, 8, 9, 10, 12) will survive termination.</P>
        </Section>

        <Section title="12. Governing Law &amp; Dispute Resolution">
          <P>These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict-of-law principles. Any disputes shall first be attempted to be resolved informally by contacting us. If unresolved within 30 days, disputes shall be submitted to the exclusive jurisdiction of the courts of Lagos, Nigeria.</P>
        </Section>

        <Section title="13. Changes to Terms">
          <P>We may update these Terms from time to time. We will provide at least 14 days&apos; notice of material changes via email or in-app notification. Continued use of the Service after the effective date constitutes acceptance of the revised Terms.</P>
        </Section>

        <Section title="14. Contact" last>
          <P>Questions about these Terms? Reach us at:</P>
          <div style={{ marginTop: 16, padding: '20px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
            <p style={{ margin: '0 0 6px', color: '#fff', fontWeight: 600, fontSize: 15 }}>ViralKit</p>
            <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Email: <a href="mailto:legal@viralkit.app" style={{ color: '#F59E0B', textDecoration: 'none' }}>legal@viralkit.app</a></p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Website: <a href="https://viral.langtangihub.org" style={{ color: '#F59E0B', textDecoration: 'none' }}>viral.langtangihub.org</a></p>
          </div>
        </Section>

        {/* Footer links */}
        <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ fontSize: 14, color: '#F59E0B', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>
          <Link href="/privacy" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Back to ViralKit</Link>
        </div>
      </main>
    </div>
  )
}

/* ── Helpers ── */

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section style={{ marginBottom: last ? 0 : 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.01em' }}>{title}</h2>
      {children}
    </section>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: '20px 0 8px' }}>{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: '0 0 12px' }}>{children}</p>
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '16px 20px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, marginBottom: 40 }}>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  )
}
