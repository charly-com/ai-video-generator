// src/app/api/admin/content/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('pageSize') ?? '25', 10)),
  )

  const where = status ? { status } : {}

  const [total, content] = await Promise.all([
    prisma.generatedContent.count({ where }),
    prisma.generatedContent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        type: true,
        status: true,
        model: true,
        prompt: true,
        fileUrl: true,
        thumbnailUrl: true,
        createdAt: true,
        user: { select: { id: true, email: true, name: true } },
      },
    }),
  ])

  return NextResponse.json({
    success: true,
    data: content,
    pagination: { total, page, pageSize, pages: Math.ceil(total / pageSize) },
  })
}
