// src/app/api/admin/stats/route.ts

import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    usersLast30,
    usersLast7,
    totalContent,
    contentLast7,
    activeSubs,
    planBreakdown,
    aiLogs,
    publishedPosts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: last30 } } }),
    prisma.user.count({ where: { createdAt: { gte: last7 } } }),
    prisma.generatedContent.count(),
    prisma.generatedContent.count({ where: { createdAt: { gte: last7 } } }),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.subscription.groupBy({
      by: ['plan'],
      _count: { plan: true },
    }),
    prisma.aIGenerationLog.aggregate({
      where: { createdAt: { gte: last30 } },
      _sum: { estimatedCostUsd: true },
      _count: { id: true },
    }),
    prisma.publishJob.count({ where: { status: 'published' } }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        last30Days: usersLast30,
        last7Days: usersLast7,
      },
      content: {
        total: totalContent,
        last7Days: contentLast7,
      },
      subscriptions: {
        active: activeSubs,
        byPlan: planBreakdown.map(p => ({ plan: p.plan, count: p._count.plan })),
      },
      ai: {
        generationsLast30Days: aiLogs._count.id,
        estimatedCostLast30DaysUsd: aiLogs._sum.estimatedCostUsd ?? 0,
      },
      publishing: {
        totalPublished: publishedPosts,
      },
    },
  })
}
