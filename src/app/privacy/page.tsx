import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How ViralKit collects, uses, and protects your personal data.',
}

const LAST_UPDATED = 'April 11, 2025'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100dvh', background: '#07070F', color: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 900, margin: '0 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#F59E0B,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#000' }}>V</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>ViralKit</span>
        </Link>
        <Link href="/terms" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Terms of Service →</Link>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', fontSize: 12, color: '#F59E0B', fontWeight: 600, marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Legal
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.15 }}>Privacy Policy</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="1. Introduction">
          <P>ViralKit (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your personal information. This Privacy Policy explains what data we collect when you use ViralKit, how we use it, and your rights regarding that data.</P>
          <P>By using our service you agree to the collection and use of information in accordance with this policy.</P>
        </Section>

        <Section title="2. Information We Collect">
          <SubHeading>a) Account Information</SubHeading>
          <P>When you create an account we collect your name, email address, and profile image — either directly or via OAuth providers such as Google.</P>

          <SubHeading>b) Content You Create</SubHeading>
          <P>We store the AI-generated videos, images, scripts, and captions you produce using our tools so they are accessible from your vault and can be published on your behalf.</P>

          <SubHeading>c) Social Account Tokens</SubHeading>
          <P>When you connect a social media account (YouTube, Instagram, TikTok, Twitter/X) we store OAuth access and refresh tokens encrypted in our database. These are used solely to publish content you schedule.</P>

          <SubHeading>d) Usage &amp; Analytics</SubHeading>
          <P>We collect usage records (videos generated, images generated per billing period) to enforce plan limits and improve the product. We also collect aggregate analytics on published content performance when platforms provide this data.</P>

          <SubHeading>e) Log &amp; Device Data</SubHeading>
          <P>Our servers automatically receive standard web server logs including IP addresses, browser user-agent, pages visited, and timestamps. This data is used for security, debugging, and abuse prevention.</P>

          <SubHeading>f) Cookies &amp; Local Storage</SubHeading>
          <P>We use session cookies required for authentication and, with your consent, analytics cookies to understand how the product is used. See our Cookie Policy section below for details.</P>
        </Section>

        <Section title="3. How We Use Your Information">
          <List items={[
            'Provide, operate, and improve the ViralKit service',
            'Authenticate your identity and maintain your session',
            'Publish scheduled content to connected social accounts',
            'Track usage against your subscription plan limits',
            'Send transactional emails (magic links, billing receipts, publish notifications)',
            'Detect and prevent fraud, abuse, or security incidents',
            'Comply with legal obligations',
          ]} />
        </Section>

        <Section title="4. Sharing Your Information">
          <P>We do not sell your personal data. We share data only in the following limited circumstances:</P>
          <List items={[
            'Service Providers — third-party processors that help us operate ViralKit (e.g., Neon/PostgreSQL for database hosting, fal.ai for AI generation, Paystack for billing). They process data only as instructed by us.',
            'Social Platforms — when you publish content, the content and metadata you provide are sent to the relevant platform API.',
            'Legal Requirements — if required by law, regulation, or valid legal process.',
            'Business Transfers — in connection with a merger, acquisition, or sale of assets; you will be notified before your data is transferred and becomes subject to a different privacy policy.',
          ]} />
        </Section>

        <Section title="5. Data Retention">
          <P>We retain your account data for as long as your account is active. Generated content in your vault is retained until you delete it or close your account. Usage records are retained for 13 months for billing and compliance purposes. Server logs are retained for 90 days.</P>
          <P>When you delete your account, we delete or anonymise all personally identifiable information within 30 days, except where we are required to retain it by law.</P>
        </Section>

        <Section title="6. Security">
          <P>We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest for sensitive tokens, hashed credentials, and role-based access controls. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security but we take commercially reasonable steps to protect your data.</P>
        </Section>

        <Section title="7. Your Rights">
          <P>Depending on your jurisdiction you may have the right to:</P>
          <List items={[
            'Access — request a copy of the personal data we hold about you',
            'Rectification — correct inaccurate data',
            'Erasure — request deletion of your data ("right to be forgotten")',
            'Portability — receive your data in a structured, machine-readable format',
            'Restriction — ask us to limit how we process your data',
            'Object — object to processing based on legitimate interests',
            'Withdraw consent — where processing is based on consent you may withdraw it at any time',
          ]} />
          <P>To exercise any of these rights, email us at <a href="mailto:privacy@viralkit.app" style={{ color: '#F59E0B', textDecoration: 'none' }}>privacy@viralkit.app</a>. We will respond within 30 days.</P>
        </Section>

        <Section title="8. Cookie Policy">
          <P>Cookies are small text files stored on your device. We use:</P>
          <List items={[
            'Essential cookies — required for authentication and security (e.g., next-auth session). Cannot be disabled.',
            'Analytics cookies — help us understand usage patterns (e.g., page views). Only set with your consent.',
            'Preference cookies — remember UI preferences such as theme. Only set with your consent.',
          ]} />
          <P>You can manage your cookie preferences via the consent banner shown on your first visit, or by clearing cookies in your browser settings. Note that disabling essential cookies will prevent you from signing in.</P>
        </Section>

        <Section title="9. Children's Privacy">
          <P>ViralKit is not directed to children under 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us immediately and we will delete it.</P>
        </Section>

        <Section title="10. International Transfers">
          <P>ViralKit is operated from and data is stored within cloud infrastructure that may be located in the United States or European Union. If you are accessing the service from another region, your data may be transferred to and processed in a jurisdiction with different data protection laws. We apply appropriate safeguards (e.g., Standard Contractual Clauses) for cross-border transfers.</P>
        </Section>

        <Section title="11. Changes to This Policy">
          <P>We may update this Privacy Policy from time to time. We will notify you of material changes by email or a prominent in-app notice at least 14 days before the change takes effect. Continued use after the effective date constitutes acceptance of the updated policy.</P>
        </Section>

        <Section title="12. Contact Us" last>
          <P>Questions or concerns about this policy? Contact us at:</P>
          <div style={{ marginTop: 16, padding: '20px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
            <p style={{ margin: '0 0 6px', color: '#fff', fontWeight: 600, fontSize: 15 }}>ViralKit</p>
            <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Email: <a href="mailto:privacy@viralkit.app" style={{ color: '#F59E0B', textDecoration: 'none' }}>privacy@viralkit.app</a></p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Website: <a href="https://viral.langtangihub.org" style={{ color: '#F59E0B', textDecoration: 'none' }}>viral.langtangihub.org</a></p>
          </div>
        </Section>

        {/* Footer links */}
        <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/privacy" style={{ fontSize: 14, color: '#F59E0B', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
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
