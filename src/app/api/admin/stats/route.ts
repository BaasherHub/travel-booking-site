import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase())
  return adminEmails.includes(email.toLowerCase())
}

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [totalBookings, totalUsers, bookings] = await Promise.all([
    prisma.booking.count(),
    prisma.user.count(),
    prisma.booking.findMany({
      select: { commission: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const totalCommission = bookings.reduce((sum, b) => sum + (b.commission || 0), 0)
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length

  // Recent activity: bookings in last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentSearches = await prisma.searchHistory.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
  })

  return NextResponse.json({
    data: {
      totalBookings,
      totalUsers,
      totalCommission: Math.round(totalCommission * 100) / 100,
      confirmedBookings,
      pendingBookings,
      recentSearches,
    },
  })
}
