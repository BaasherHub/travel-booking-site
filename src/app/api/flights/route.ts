import { NextRequest, NextResponse } from 'next/server'
import { MOCK_FLIGHTS } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get('origin')?.toUpperCase()
  const destination = searchParams.get('destination')?.toUpperCase()
  const passengers = parseInt(searchParams.get('passengers') || '1')
  const cabinClass = searchParams.get('cabinClass') || 'economy'
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null
  const stops = searchParams.get('stops') ? searchParams.get('stops')!.split(',').map(Number) : null
  const airlines = searchParams.get('airlines') ? searchParams.get('airlines')!.split(',') : null

  let flights = [...MOCK_FLIGHTS]

  if (origin) {
    flights = flights.filter(
      (f) =>
        f.origin.toUpperCase().includes(origin) ||
        f.originCity.toUpperCase().includes(origin)
    )
  }

  if (destination) {
    flights = flights.filter(
      (f) =>
        f.destination.toUpperCase().includes(destination) ||
        f.destinationCity.toUpperCase().includes(destination)
    )
  }

  if (cabinClass && cabinClass !== 'any') {
    flights = flights.filter((f) => f.cabinClass === cabinClass)
  }

  if (maxPrice) {
    flights = flights.filter((f) => f.price <= maxPrice)
  }

  if (stops && stops.length > 0) {
    flights = flights.filter((f) => stops.includes(f.stops))
  }

  if (airlines && airlines.length > 0) {
    flights = flights.filter((f) => airlines.includes(f.airline))
  }

  return NextResponse.json({
    data: flights,
    total: flights.length,
    passengers,
  })
}
