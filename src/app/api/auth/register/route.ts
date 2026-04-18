// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { sendVerificationEmail } from '@/lib/email/resend'
import crypto from 'crypto'

const RegisterSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const email = parsed.data.email.toLowerCase()

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    const hashed = await bcrypt.hash(parsed.data.password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name ?? email.split('@')[0],
        password: hashed,
      },
    })

    const now = new Date()
    const end = new Date(now)
    end.setMonth(end.getMonth() + 1)

    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'free',
        billingCycle: 'monthly',
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: end,
      },
    })

    await prisma.usageRecord.create({
      data: {
        userId: user.id,
        videosUsed: 0,
        imagesUsed: 0,
        periodStart: now,
        periodEnd: end,
      },
    })

    // Send verification email (non-blocking — don't fail registration if email fails)
    try {
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
      await prisma.verificationToken.create({
        data: { identifier: email, token, expires },
      })
      await sendVerificationEmail(email, token)
    } catch (emailErr) {
      console.warn('[register] Failed to send verification email:', emailErr)
    }

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('[auth/register] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 },
    )
  }
}
