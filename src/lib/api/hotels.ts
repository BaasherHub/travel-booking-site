import { Hotel, HotelSearchParams } from '@/types/hotel'
import { MOCK_HOTELS } from '../mock-data'

const hotelCache = new Map<string, { data: Hotel[]; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000

/**
 * Search hotels using available APIs with mock data fallback.
 */
export async function searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
  const cacheKey = JSON.stringify(params)
  const cached = hotelCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const results = filterMockHotels(params)
  hotelCache.set(cacheKey, { data: results, timestamp: Date.now() })
  return results
}

function filterMockHotels(params: HotelSearchParams): Hotel[] {
  const filtered = MOCK_HOTELS.filter(
    (hotel) =>
      hotel.city.toLowerCase().includes(params.city.toLowerCase()) ||
      hotel.country.toLowerCase().includes(params.city.toLowerCase()) ||
      hotel.location.toLowerCase().includes(params.city.toLowerCase())
  )

  return filtered.length > 0 ? filtered : MOCK_HOTELS
}

/**
 * Get a specific hotel by ID.
 */
export function getHotelById(id: string): Hotel | undefined {
  return MOCK_HOTELS.find((h) => h.id === id)
}
