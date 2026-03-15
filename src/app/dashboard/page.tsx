import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'View and manage your flight and hotel bookings.',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <DashboardClient session={session} />
}
