// src/app/api/gamification/streak/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [streak, badges] = await Promise.all([
    prisma.creatorStreak.findUnique({ where: { userId: session.user.id } }),
    prisma.creatorBadge.findMany({ where: { userId: session.user.id }, orderBy: { earnedAt: 'desc' } }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      current:  streak?.current ?? 0,
      longest:  streak?.longest ?? 0,
      totalXp:  streak?.totalXp ?? 0,
      lastActivity: streak?.lastActivity,
      badges,
    },
  })
}
