import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: bookings })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { type, details, totalPrice, currency, affiliateId, affiliateUrl, commission, commissionRate, referenceId, travelers, notes } = body

  if (!type || !details || !totalPrice) {
    return NextResponse.json(
      { error: 'Missing required fields: type, details, totalPrice' },
      { status: 400 }
    )
  }

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      type,
      status: 'pending',
      details,
      totalPrice,
      currency: currency || 'USD',
      affiliateId: affiliateId || null,
      affiliateUrl: affiliateUrl || null,
      commission: commission || null,
      commissionRate: commissionRate ?? 0.05,
      referenceId: referenceId || null,
      travelers: travelers || null,
      notes: notes || null,
    },
  })

  return NextResponse.json({ data: booking }, { status: 201 })
}
