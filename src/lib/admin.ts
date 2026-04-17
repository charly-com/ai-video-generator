// src/lib/admin.ts

import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'

/**
 * Returns the current user if and only if they have admin privileges.
 * Returns null otherwise. Call this at the top of every admin API/page.
 */
export async function getAdminSession() {
  const session = await auth()
  if (!session?.user?.id) return null

  if (session.user.isAdmin) return session

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  })
  if (!dbUser?.isAdmin) return null

  return session
}
