import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase())
  return adminEmails.includes(email.toLowerCase())
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const status = searchParams.get('status') || undefined

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: status ? { status } : undefined,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where: status ? { status } : undefined }),
  ])

  return NextResponse.json({
    data: bookings,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { id, status } = body

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  }

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json({ data: booking })
}
