import { useState, useCallback } from 'react'
import { Hotel, HotelSearchParams, HotelFilter, HotelSortOption } from '@/types/hotel'

export function useHotelSearch() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (params: HotelSearchParams) => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({
        city: params.city,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: params.guests.toString(),
        rooms: params.rooms.toString(),
      })

      const response = await fetch(`/api/hotels/search?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch hotels')
      }
      const data = await response.json()
      setHotels(data.hotels || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const sortHotels = useCallback(
    (hotelList: Hotel[], sort: HotelSortOption): Hotel[] => {
      return [...hotelList].sort((a, b) => {
        switch (sort) {
          case 'price-asc':
            return a.pricePerNight - b.pricePerNight
          case 'price-desc':
            return b.pricePerNight - a.pricePerNight
          case 'rating-desc':
            return b.rating - a.rating
          case 'name-asc':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
    },
    []
  )

  const filterHotels = useCallback(
    (hotelList: Hotel[], filters: HotelFilter): Hotel[] => {
      return hotelList.filter((hotel) => {
        const inPriceRange =
          hotel.pricePerNight >= filters.priceRange[0] &&
          hotel.pricePerNight <= filters.priceRange[1]
        const matchesStars =
          filters.stars.length === 0 || filters.stars.includes(hotel.stars)
        const matchesAmenities =
          filters.amenities.length === 0 ||
          filters.amenities.every((a) => hotel.amenities.includes(a))
        const meetsRating = hotel.rating >= filters.ratingMin

        return inPriceRange && matchesStars && matchesAmenities && meetsRating
      })
    },
    []
  )

  return { hotels, loading, error, search, sortHotels, filterHotels }
}
