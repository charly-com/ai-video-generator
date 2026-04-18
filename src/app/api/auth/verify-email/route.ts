// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/auth/verify-email?error=missing', req.url))
  }

  const record = await prisma.verificationToken.findFirst({ where: { token } })

  if (!record) {
    return NextResponse.redirect(new URL('/auth/verify-email?error=invalid', req.url))
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { identifier_token: { identifier: record.identifier, token } } })
    return NextResponse.redirect(new URL('/auth/verify-email?error=expired', req.url))
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: record.identifier, token } },
  })

  return NextResponse.redirect(new URL('/auth/verify-email?success=1', req.url))
}
