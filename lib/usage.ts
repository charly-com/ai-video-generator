// ──────────────────────────────────────────────────────────────
// lib/usage.ts — Usage limit enforcement
// ──────────────────────────────────────────────────────────────
import { prisma } from './prisma';
import type { UsageType } from '@prisma/client';
 
export async function checkUsageLimit(
  userId: string,
  type: 'image_generation' | 'video_generation'
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  const tier = (subscription?.tier ?? 'free') as PlanTierKey;
  const limits = getPlanLimits(tier);
 
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
 
  const usageType: UsageType = type === 'video_generation' ? 'video_generation' : 'image_generation';
  const limitField = type === 'video_generation' ? 'videosPerMonth' : 'imagesPerMonth';
  const limit = limits[limitField];
 
  if (limit === -1) return true; // unlimited
 
  const count = await prisma.usageLog.count({
    where: { userId, type: usageType, createdAt: { gte: startOfMonth } },
  });
 
  return count < limit;
}
 
export async function getMonthlyUsage(userId: string) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
 
  const [videos, images, posts] = await prisma.$transaction([
    prisma.usageLog.count({ where: { userId, type: 'video_generation', createdAt: { gte: startOfMonth } } }),
    prisma.usageLog.count({ where: { userId, type: 'image_generation', createdAt: { gte: startOfMonth } } }),
    prisma.usageLog.count({ where: { userId, type: 'post_published', createdAt: { gte: startOfMonth } } }),
  ]);
 
  return { videos, images, posts };
}
 