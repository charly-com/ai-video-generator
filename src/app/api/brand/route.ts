// src/app/api/brand/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '../../../lib/db/prisma';
import { z } from 'zod'

const BrandKitSchema = z.object({
  name: z.string().min(1).max(50),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  fontPrimary: z.string().max(100).optional(),
  fontSecondary: z.string().max(100).optional(),
  logoUrl: z.string().url().optional(),
  brandVoice: z.string().max(500).optional(),
  tagline: z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = BrandKitSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid', details: parsed.error }, { status: 400 })

  // Check plan limit (free = 0 brand kits, basic = 1, pro = unlimited)
  const subscription = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  const plan = subscription?.plan ?? 'free'

  if (plan === 'free') {
    return NextResponse.json({ error: 'Brand Kit requires Basic plan or higher' }, { status: 403 })
  }

  if (plan === 'basic') {
    const existing = await prisma.brandKit.count({ where: { userId: session.user.id } })
    if (existing >= 1) {
      return NextResponse.json({ error: 'Basic plan allows 1 brand kit. Upgrade to Pro for unlimited.' }, { status: 403 })
    }
  }

  const kit = await prisma.brandKit.create({
    data: { userId: session.user.id, ...parsed.data },
  })

  return NextResponse.json({ success: true, data: kit })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const kits = await prisma.brandKit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, data: kits })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...updates } = body

  const kit = await prisma.brandKit.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!kit) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.brandKit.update({
    where: { id },
    data: updates,
  })

  return NextResponse.json({ success: true, data: updated })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await prisma.brandKit.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ success: true })
}