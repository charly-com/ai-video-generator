// src/app/api/social/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { buildOAuthUrl } from '@/auth'
import type { SocialPlatform } from '@/types'
import crypto from 'crypto'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const accounts = await prisma.socialAccount.findMany({
    where: { userId: session.user.id, isActive: true },
    select: {
      id: true, platform: true, username: true,
      displayName: true, profileImageUrl: true,
      followers: true, createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ success: true, data: accounts })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await prisma.socialAccount.updateMany({
    where: { id, userId: session.user.id },
    data: { isActive: false },
  })

  return NextResponse.json({ success: true })
}

// GET connect URL for a platform
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { platform } = await req.json()
  const state = crypto.randomBytes(16).toString('hex')

  // Store state in session or short-lived cache for CSRF check
  const url = buildOAuthUrl(platform as SocialPlatform, state)
  return NextResponse.json({ success: true, data: { url, state } })
}
