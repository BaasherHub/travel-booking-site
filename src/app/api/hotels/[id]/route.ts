import { NextRequest, NextResponse } from 'next/server'
import { MOCK_HOTELS } from '@/lib/mock-data'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const hotel = MOCK_HOTELS.find((h) => h.id === params.id)

  if (!hotel) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
  }

  return NextResponse.json({ data: hotel })
}
