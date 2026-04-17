// scripts/seed-users.ts
//
// Creates a test user and an admin user for local development.
// Run with: npx tsx scripts/seed-users.ts
//
// Credentials:
//   Test user:  test@viralmint.app  / test1234
//   Admin user: admin@viralmint.app / admin1234
//
// Override emails/passwords via env vars:
//   TEST_USER_EMAIL, TEST_USER_PASSWORD, ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface SeedUser {
  email: string
  password: string
  name: string
  isAdmin?: boolean
  plan?: string
}

const USERS: SeedUser[] = [
  {
    email: process.env.TEST_USER_EMAIL ?? 'test@viralmint.app',
    password: process.env.TEST_USER_PASSWORD ?? 'test1234',
    name: 'Test User',
    isAdmin: false,
    plan: 'free',
  },
  {
    email: process.env.ADMIN_USER_EMAIL ?? 'admin@viralmint.app',
    password: process.env.ADMIN_USER_PASSWORD ?? 'admin1234',
    name: 'Admin User',
    isAdmin: true,
    plan: 'agency',
  },
]

async function upsertUser(u: SeedUser) {
  const hashed = await bcrypt.hash(u.password, 10)
  const email = u.email.toLowerCase()

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: u.name,
      password: hashed,
      isAdmin: u.isAdmin ?? false,
      emailVerified: new Date(),
    },
    update: {
      name: u.name,
      password: hashed,
      isAdmin: u.isAdmin ?? false,
    },
  })

  const now = new Date()
  const end = new Date(now)
  end.setMonth(end.getMonth() + 1)

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan: u.plan ?? 'free',
      billingCycle: 'monthly',
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: end,
    },
    update: {
      plan: u.plan ?? 'free',
      status: 'active',
      currentPeriodEnd: end,
    },
  })

  const existingUsage = await prisma.usageRecord.findFirst({
    where: { userId: user.id, periodEnd: { gte: now } },
  })
  if (!existingUsage) {
    await prisma.usageRecord.create({
      data: {
        userId: user.id,
        videosUsed: 0,
        imagesUsed: 0,
        periodStart: now,
        periodEnd: end,
      },
    })
  }

  return user
}

async function main() {
  console.log('Seeding users...\n')
  for (const u of USERS) {
    const user = await upsertUser(u)
    console.log(
      `  ${u.isAdmin ? '👑' : '👤'}  ${user.email.padEnd(30)}  password: ${u.password}  id: ${user.id}`,
    )
  }
  console.log('\nDone. Sign in at /auth/login with the credentials above.')
}

main()
  .catch(err => {
    console.error('Seeding failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
