import { NextRequest, NextResponse } from 'next/server'
import { MOCK_FLIGHTS } from '@/lib/mock-data'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const flight = MOCK_FLIGHTS.find((f) => f.id === id)

  if (!flight) {
    return NextResponse.json({ error: 'Flight not found' }, { status: 404 })
  }

  return NextResponse.json({ data: flight })
}
