import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const booking = await prisma.booking.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  return NextResponse.json({ data: booking })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { status, notes } = body
  const { id } = await params

  const existing = await prisma.booking.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
    },
  })

  return NextResponse.json({ data: updated })
}
