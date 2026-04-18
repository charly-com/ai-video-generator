// src/lib/email/resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'ViralKit <noreply@viral.villagecircle.ng>'
const BASE = process.env.NEXTAUTH_URL ?? 'https://viral.villagecircle.ng'

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${BASE}/auth/verify-email?token=${token}`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your ViralKit email',
    html: emailHtml({
      heading: 'Verify your email',
      body: 'Click the button below to verify your email address and activate your ViralKit account.',
      ctaText: 'Verify Email',
      ctaUrl: url,
      note: 'This link expires in 24 hours. If you did not create a ViralKit account, you can safely ignore this email.',
    }),
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${BASE}/auth/reset-password?token=${token}`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your ViralKit password',
    html: emailHtml({
      heading: 'Reset your password',
      body: 'We received a request to reset the password for your ViralKit account. Click below to choose a new password.',
      ctaText: 'Reset Password',
      ctaUrl: url,
      note: 'This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.',
    }),
  })
}

function emailHtml({ heading, body, ctaText, ctaUrl, note }: {
  heading: string; body: string; ctaText: string; ctaUrl: string; note: string
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07070F;font-family:'DM Sans',system-ui,sans-serif;color:#EDE8DC;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#07070F;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:500px;background:#0c0c18;border:1px solid rgba(237,232,220,0.08);border-radius:16px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#F59E0B,#EF4444);padding:3px 0;"></td></tr>
        <tr><td style="padding:32px 32px 24px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:28px;">
            <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#F59E0B,#EF4444);display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;color:#000;">V</div>
            <span style="font-weight:900;font-size:17px;color:#EDE8DC;">ViralKit</span>
          </div>
          <h1 style="font-size:24px;font-weight:900;color:#EDE8DC;margin:0 0 14px;line-height:1.2;">${heading}</h1>
          <p style="font-size:14px;color:rgba(237,232,220,0.55);line-height:1.75;margin:0 0 28px;">${body}</p>
          <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#F59E0B,#EF4444);color:#000;font-weight:800;font-size:15px;text-decoration:none;border-radius:12px;letter-spacing:-0.01em;">${ctaText}</a>
          <p style="font-size:12px;color:rgba(237,232,220,0.25);margin:24px 0 0;line-height:1.65;">${note}</p>
          <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent);margin:24px 0;"></div>
          <p style="font-size:11px;color:rgba(237,232,220,0.18);margin:0;">© ${new Date().getFullYear()} ViralKit · Part of <a href="https://villagecircle.ng" style="color:rgba(237,232,220,0.3);">Village Circle</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
