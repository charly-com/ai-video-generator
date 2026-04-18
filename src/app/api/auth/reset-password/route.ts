// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'

const Schema = z.object({
  token: z.string().min(1),
  password: z.string().min(6).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })

    const { token, password } = parsed.data

    const record = await prisma.passwordResetToken.findUnique({ where: { token } })
    if (!record || record.used) {
      return NextResponse.json({ success: false, error: 'Invalid or already used reset link' }, { status: 400 })
    }
    if (record.expires < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } })
      return NextResponse.json({ success: false, error: 'Reset link has expired' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id: record.userId }, data: { password: hashed } })
    await prisma.passwordResetToken.update({ where: { token }, data: { used: true } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[reset-password]', error)
    return NextResponse.json({ success: false, error: 'Reset failed' }, { status: 500 })
  }
}
