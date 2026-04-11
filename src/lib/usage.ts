// ──────────────────────────────────────────────────────────────
// lib/usage.ts — Usage limit enforcement
// ──────────────────────────────────────────────────────────────
import { prisma } from './db/prisma'
import { getPlanLimits, type PlanTierKey } from './pricing'

export async function checkUsageLimit(
  userId: string,
  type: 'image_generation' | 'video_generation'
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({ where: { userId } })
  const tier = (subscription?.plan ?? 'free') as PlanTierKey
  const limits = getPlanLimits(tier)

  const limitField = type === 'video_generation' ? 'videosPerMonth' : 'imagesPerMonth'
  const limit = limits[limitField]

  if (limit === -1) return true // unlimited

  const record = await prisma.usageRecord.findFirst({
    where: { userId, periodEnd: { gte: new Date() } },
    orderBy: { createdAt: 'desc' },
  })

  const used = type === 'video_generation'
    ? (record?.videosUsed ?? 0)
    : (record?.imagesUsed ?? 0)

  return used < limit
}

export async function getMonthlyUsage(userId: string) {
  const record = await prisma.usageRecord.findFirst({
    where: { userId, periodEnd: { gte: new Date() } },
    orderBy: { createdAt: 'desc' },
  })

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const posts = await prisma.publishJob.count({
    where: { userId, status: 'published', publishedAt: { gte: startOfMonth } },
  })

  return {
    videos: record?.videosUsed ?? 0,
    images: record?.imagesUsed ?? 0,
    posts,
  }
}
