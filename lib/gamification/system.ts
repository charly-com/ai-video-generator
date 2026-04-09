// src/lib/gamification/system.ts

import { prisma } from '../db/prisma';

// ─── Types ─────────────────────────────────────────────────────────────────

export type BadgeId =
  | 'first_video' | 'first_image' | 'first_publish'
  | 'streak_7' | 'streak_30' | 'streak_100'
  | 'viral_10k' | 'viral_100k' | 'viral_1m'
  | 'content_50' | 'content_200' | 'content_1000'
  | 'platform_master' | 'team_player' | 'early_adopter'
  | 'night_owl' | 'speed_demon' | 'trend_setter'

export interface Badge {
  id: BadgeId
  name: string
  description: string
  emoji: string
  xpReward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface CreatorLevel {
  level: number
  title: string
  emoji: string
  xpRequired: number
  xpNext: number
  perks: string[]
}

// ─── Badge definitions ─────────────────────────────────────────────────────

export const BADGES: Record<BadgeId, Badge> = {
  first_video:    { id: 'first_video',    name: 'First Frame',      description: 'Created your first AI video',            emoji: '🎬', xpReward: 100,  rarity: 'common' },
  first_image:    { id: 'first_image',    name: 'Pixel Perfect',    description: 'Generated your first AI image',          emoji: '🎨', xpReward: 100,  rarity: 'common' },
  first_publish:  { id: 'first_publish',  name: 'Live Wire',        description: 'Published content to social media',      emoji: '📡', xpReward: 150,  rarity: 'common' },
  streak_7:       { id: 'streak_7',       name: 'Week Warrior',     description: 'Created content 7 days in a row',        emoji: '🔥', xpReward: 300,  rarity: 'common' },
  streak_30:      { id: 'streak_30',      name: 'Monthly Grinder',  description: 'Created content 30 days in a row',       emoji: '💪', xpReward: 1000, rarity: 'rare' },
  streak_100:     { id: 'streak_100',     name: 'Unstoppable',      description: '100-day content streak — legendary!',    emoji: '⚡', xpReward: 5000, rarity: 'legendary' },
  viral_10k:      { id: 'viral_10k',      name: 'Going Places',     description: 'Single post reached 10K views',          emoji: '🚀', xpReward: 500,  rarity: 'rare' },
  viral_100k:     { id: 'viral_100k',     name: 'Viral Sensation',  description: 'Single post reached 100K views',         emoji: '🌊', xpReward: 2000, rarity: 'epic' },
  viral_1m:       { id: 'viral_1m',       name: 'Million Club',     description: 'Single post hit 1 million views!',       emoji: '🏆', xpReward: 10000,rarity: 'legendary' },
  content_50:     { id: 'content_50',     name: 'Prolific',         description: 'Created 50 pieces of content',           emoji: '📦', xpReward: 400,  rarity: 'common' },
  content_200:    { id: 'content_200',    name: 'Content Machine',  description: 'Created 200 pieces of content',          emoji: '⚙️', xpReward: 1500, rarity: 'rare' },
  content_1000:   { id: 'content_1000',   name: 'Content God',      description: 'Created 1,000 pieces of content',        emoji: '👑', xpReward: 8000, rarity: 'legendary' },
  platform_master:{ id: 'platform_master',name: 'Omnipresent',      description: 'Published to 5+ platforms',              emoji: '🌐', xpReward: 700,  rarity: 'rare' },
  team_player:    { id: 'team_player',    name: 'Squad Goals',      description: 'Invited a team member',                  emoji: '🤝', xpReward: 300,  rarity: 'common' },
  early_adopter:  { id: 'early_adopter',  name: 'OG Creator',       description: 'Joined ViralKit in the early days',      emoji: '🌟', xpReward: 500,  rarity: 'epic' },
  night_owl:      { id: 'night_owl',      name: 'Night Owl',        description: 'Created content after midnight 10 times',emoji: '🦉', xpReward: 250,  rarity: 'rare' },
  speed_demon:    { id: 'speed_demon',    name: 'Speed Demon',      description: 'Generated 10 videos in one day',         emoji: '💨', xpReward: 600,  rarity: 'epic' },
  trend_setter:   { id: 'trend_setter',   name: 'Trend Setter',     description: 'Published content on 3 trending topics', emoji: '📈', xpReward: 800,  rarity: 'epic' },
}

// ─── Level system ─────────────────────────────────────────────────────────

export const LEVELS: CreatorLevel[] = [
  { level: 1,  title: 'Rookie Creator',    emoji: '🌱', xpRequired: 0,     xpNext: 500,    perks: ['Basic templates'] },
  { level: 2,  title: 'Rising Creator',    emoji: '⭐', xpRequired: 500,   xpNext: 1500,   perks: ['Unlock creator tips'] },
  { level: 3,  title: 'Active Creator',    emoji: '🔥', xpRequired: 1500,  xpNext: 3500,   perks: ['Priority support access'] },
  { level: 4,  title: 'Pro Creator',       emoji: '💎', xpRequired: 3500,  xpNext: 7500,   perks: ['+5% AI credits bonus'] },
  { level: 5,  title: 'Expert Creator',    emoji: '🚀', xpRequired: 7500,  xpNext: 15000,  perks: ['Custom badge display'] },
  { level: 6,  title: 'Elite Creator',     emoji: '👑', xpRequired: 15000, xpNext: 30000,  perks: ['Featured on leaderboard'] },
  { level: 7,  title: 'Master Creator',    emoji: '⚡', xpRequired: 30000, xpNext: 60000,  perks: ['+10% AI credits bonus'] },
  { level: 8,  title: 'Legend Creator',    emoji: '🌟', xpRequired: 60000, xpNext: 100000, perks: ['ViralKit partner status'] },
  { level: 9,  title: 'Mythic Creator',    emoji: '🏆', xpRequired: 100000,xpNext: 200000, perks: ['Dedicated GPU priority'] },
  { level: 10, title: 'God Tier Creator',  emoji: '💫', xpRequired: 200000,xpNext: Infinity,perks: ['Hall of fame entry'] },
]

export function getLevel(xp: number): CreatorLevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getLevelProgress(xp: number): number {
  const level = getLevel(xp)
  const next = LEVELS.find(l => l.level === level.level + 1)
  if (!next) return 100
  const range = next.xpRequired - level.xpRequired
  const progress = xp - level.xpRequired
  return Math.min(100, Math.round((progress / range) * 100))
}

// ─── Streak logic ──────────────────────────────────────────────────────────

export async function recordActivity(userId: string, activityType: 'video' | 'image' | 'publish') {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get or create streak record
  let streak = await prisma.creatorStreak.findUnique({ where: { userId } })

  if (!streak) {
    streak = await prisma.creatorStreak.create({
      data: { userId, current: 1, longest: 1, lastActivity: today, totalXp: 0 }
    })
  } else {
    const lastDate = new Date(streak.lastActivity)
    lastDate.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Already active today, just add XP
    } else if (diffDays === 1) {
      // Consecutive day — extend streak
      const newCurrent = streak.current + 1
      streak = await prisma.creatorStreak.update({
        where: { userId },
        data: {
          current: newCurrent,
          longest: Math.max(streak.longest, newCurrent),
          lastActivity: today,
        },
      })
    } else {
      // Streak broken
      streak = await prisma.creatorStreak.update({
        where: { userId },
        data: { current: 1, lastActivity: today },
      })
    }
  }

  // Award XP based on activity
  const xpMap = { video: 50, image: 20, publish: 30 }
  const xp = xpMap[activityType]

  await prisma.creatorStreak.update({
    where: { userId },
    data: { totalXp: { increment: xp } },
  })

  // Check for badge eligibility
  const newBadges = await checkAndAwardBadges(userId, streak.current)

  return { streak, xpEarned: xp, newBadges }
}

async function checkAndAwardBadges(userId: string, currentStreak: number): Promise<Badge[]> {
  const earnedBadgeIds = (await prisma.creatorBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  })).map(b => b.badgeId)

  const toAward: Badge[] = []

  // Streak badges
  if (currentStreak >= 7 && !earnedBadgeIds.includes('streak_7')) toAward.push(BADGES.streak_7)
  if (currentStreak >= 30 && !earnedBadgeIds.includes('streak_30')) toAward.push(BADGES.streak_30)
  if (currentStreak >= 100 && !earnedBadgeIds.includes('streak_100')) toAward.push(BADGES.streak_100)

  // Content count badges
  const contentCount = await prisma.generatedContent.count({ where: { userId, status: 'ready' } })
  if (contentCount >= 50 && !earnedBadgeIds.includes('content_50')) toAward.push(BADGES.content_50)
  if (contentCount >= 200 && !earnedBadgeIds.includes('content_200')) toAward.push(BADGES.content_200)
  if (contentCount >= 1000 && !earnedBadgeIds.includes('content_1000')) toAward.push(BADGES.content_1000)

  // Award badges
  for (const badge of toAward) {
    await prisma.creatorBadge.create({
      data: { userId, badgeId: badge.id, xpEarned: badge.xpReward },
    })
    await prisma.creatorStreak.update({
      where: { userId },
      data: { totalXp: { increment: badge.xpReward } },
    })
  }

  return toAward
}