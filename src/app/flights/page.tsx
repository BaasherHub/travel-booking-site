'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import FlightSearchForm from '@/components/flights/FlightSearchForm'
import FlightList from '@/components/flights/FlightList'
import FlightFilters from '@/components/flights/FlightFilters'
import { useFlightSearch } from '@/hooks/useFlightSearch'
import { FlightFilter, FlightSortOption } from '@/types/flight'
import { PRICE_RANGES } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ErrorMessage from '@/components/shared/ErrorMessage'

const DEFAULT_FILTERS: FlightFilter = {
  priceRange: [PRICE_RANGES.FLIGHT.min, PRICE_RANGES.FLIGHT.max],
  stops: [],
  airlines: [],
  departureTimeRange: [0, 24],
}

export default function FlightsPage() {
  const searchParams = useSearchParams()
  const { flights, loading, error, search, sortFlights, filterFlights } = useFlightSearch()
  const [filters, setFilters] = useState<FlightFilter>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<FlightSortOption>('price-asc')
  const [hasSearched, setHasSearched] = useState(false)

  const initialValues = Object.fromEntries(searchParams.entries())

  useEffect(() => {
    if (searchParams.get('origin') || searchParams.get('destination')) {
      const params = {
        origin: searchParams.get('origin') || '',
        destination: searchParams.get('destination') || searchParams.get('destinationCity') || '',
        departureDate: searchParams.get('departureDate') || new Date().toISOString().split('T')[0],
        passengers: parseInt(searchParams.get('passengers') || '1'),
        cabinClass: searchParams.get('cabinClass') || 'economy',
        tripType: (searchParams.get('tripType') || 'one-way') as 'one-way' | 'round-trip',
      }
      search(params)
      setHasSearched(true)
    }
  }, [searchParams, search])

  const handleSearch = (params: Record<string, string>) => {
    search({
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      passengers: parseInt(params.passengers || '1'),
      cabinClass: params.cabinClass || 'economy',
      tripType: (params.tripType || 'one-way') as 'one-way' | 'round-trip',
      returnDate: params.returnDate,
    })
    setHasSearched(true)
  }

  const displayFlights = sortFlights(filterFlights(flights, filters), sort)

  return (
    <div>
      {/* Search form header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <FlightSearchForm onSearch={handleSearch} initialValues={initialValues} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorMessage message={error} className="mb-6" />}

        <div className="flex gap-8">
          {/* Filters */}
          <FlightFilters filters={filters} onChange={setFilters} />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            {hasSearched && !loading && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{displayFlights.length}</span>{' '}
                  flights found
                </p>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                  <Select
                    value={sort}
                    onValueChange={(v) => setSort(v as FlightSortOption)}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="duration-asc">Shortest Duration</SelectItem>
                      <SelectItem value="departure-asc">Earliest Departure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {!hasSearched && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">✈️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Search for Flights</h2>
                <p className="text-gray-500">
                  Enter your origin, destination, and travel dates above to find the best deals.
                </p>
              </div>
            )}

            <FlightList flights={displayFlights} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
