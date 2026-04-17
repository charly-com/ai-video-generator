// src/app/dashboard/admin/page.tsx

import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getAdminSession()
  if (!session) redirect('/dashboard')

  return <AdminDashboard />
}
