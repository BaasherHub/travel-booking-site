import { NextRequest, NextResponse } from 'next/server'
import { MOCK_HOTELS } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')?.toLowerCase()
  const guests = parseInt(searchParams.get('guests') || '1')
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null
  const stars = searchParams.get('stars') ? searchParams.get('stars')!.split(',').map(Number) : null
  const amenities = searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : null
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : null

  let hotels = [...MOCK_HOTELS]

  if (city) {
    hotels = hotels.filter(
      (h) =>
        h.city.toLowerCase().includes(city) ||
        h.country.toLowerCase().includes(city) ||
        h.location.toLowerCase().includes(city)
    )
  }

  if (maxPrice) {
    hotels = hotels.filter((h) => h.pricePerNight <= maxPrice)
  }

  if (stars && stars.length > 0) {
    hotels = hotels.filter((h) => stars.includes(h.stars))
  }

  if (amenities && amenities.length > 0) {
    hotels = hotels.filter((h) =>
      amenities.every((a) => h.amenities.includes(a))
    )
  }

  if (minRating) {
    hotels = hotels.filter((h) => h.rating >= minRating)
  }

  return NextResponse.json({
    data: hotels,
    total: hotels.length,
    guests,
  })
}
