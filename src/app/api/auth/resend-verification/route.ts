import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/db/prisma'
import { sendVerificationEmail } from '@/lib/email/resend'

const Schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ success: true }) // silent — don't reveal whether user exists
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: false, error: 'Email already verified' }, { status: 400 })
    }

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({ where: { identifier: email } })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    })

    await sendVerificationEmail(email, token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[resend-verification] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to resend' }, { status: 500 })
  }
}
