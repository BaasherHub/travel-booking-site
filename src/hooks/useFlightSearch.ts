import { useState, useCallback } from 'react'
import { Flight, FlightSearchParams, FlightFilter, FlightSortOption } from '@/types/flight'

export function useFlightSearch() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (params: FlightSearchParams) => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        passengers: params.passengers.toString(),
        cabinClass: params.cabinClass,
        tripType: params.tripType,
        ...(params.returnDate && { returnDate: params.returnDate }),
      })

      const response = await fetch(`/api/flights/search?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch flights')
      }
      const data = await response.json()
      setFlights(data.flights || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const sortFlights = useCallback(
    (flightList: Flight[], sort: FlightSortOption): Flight[] => {
      return [...flightList].sort((a, b) => {
        switch (sort) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'duration-asc':
            return a.durationMinutes - b.durationMinutes
          case 'departure-asc':
            return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
          default:
            return 0
        }
      })
    },
    []
  )

  const filterFlights = useCallback(
    (flightList: Flight[], filters: FlightFilter): Flight[] => {
      return flightList.filter((flight) => {
        const inPriceRange =
          flight.price >= filters.priceRange[0] && flight.price <= filters.priceRange[1]
        const matchesStops =
          filters.stops.length === 0 || filters.stops.includes(flight.stops)
        const matchesAirline =
          filters.airlines.length === 0 || filters.airlines.includes(flight.airline)

        return inPriceRange && matchesStops && matchesAirline
      })
    },
    []
  )

  return { flights, loading, error, search, sortFlights, filterFlights }
}
