// src/app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.trim() ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10)),
  )

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { name: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isAdmin: true,
        createdAt: true,
        subscription: { select: { plan: true, status: true } },
        _count: {
          select: {
            generatedContent: true,
            publishJobs: true,
            socialAccounts: true,
          },
        },
      },
    }),
  ])

  return NextResponse.json({
    success: true,
    data: users,
    pagination: { total, page, pageSize, pages: Math.ceil(total / pageSize) },
  })
}

const PatchSchema = z.object({
  userId: z.string().min(1),
  isAdmin: z.boolean().optional(),
  plan: z.string().optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input' },
      { status: 400 },
    )
  }

  const { userId, isAdmin, plan } = parsed.data

  if (typeof isAdmin === 'boolean') {
    await prisma.user.update({ where: { id: userId }, data: { isAdmin } })
  }
  if (plan) {
    await prisma.subscription.update({
      where: { userId },
      data: { plan },
    })
  }

  return NextResponse.json({ success: true })
}

const DeleteSchema = z.object({ userId: z.string().min(1) })

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = DeleteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input' },
      { status: 400 },
    )
  }

  if (parsed.data.userId === session.user.id) {
    return NextResponse.json(
      { success: false, error: 'Cannot delete your own admin account' },
      { status: 400 },
    )
  }

  await prisma.user.delete({ where: { id: parsed.data.userId } })
  return NextResponse.json({ success: true })
}
