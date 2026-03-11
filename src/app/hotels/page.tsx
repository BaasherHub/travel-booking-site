'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import HotelSearchForm from '@/components/hotels/HotelSearchForm'
import HotelList from '@/components/hotels/HotelList'
import HotelFilters from '@/components/hotels/HotelFilters'
import { useHotelSearch } from '@/hooks/useHotelSearch'
import { HotelFilter, HotelSortOption } from '@/types/hotel'
import { PRICE_RANGES } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ErrorMessage from '@/components/shared/ErrorMessage'

const DEFAULT_FILTERS: HotelFilter = {
  priceRange: [PRICE_RANGES.HOTEL.min, PRICE_RANGES.HOTEL.max],
  stars: [],
  amenities: [],
  ratingMin: 0,
}

export default function HotelsPage() {
  const searchParams = useSearchParams()
  const { hotels, loading, error, search, sortHotels, filterHotels } = useHotelSearch()
  const [filters, setFilters] = useState<HotelFilter>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<HotelSortOption>('price-asc')
  const [hasSearched, setHasSearched] = useState(false)

  const initialValues = Object.fromEntries(searchParams.entries())

  useEffect(() => {
    if (searchParams.get('city')) {
      search({
        city: searchParams.get('city') || '',
        checkIn: searchParams.get('checkIn') || '',
        checkOut: searchParams.get('checkOut') || '',
        guests: parseInt(searchParams.get('guests') || '2'),
        rooms: parseInt(searchParams.get('rooms') || '1'),
      })
      setHasSearched(true)
    }
  }, [searchParams, search])

  const handleSearch = (params: Record<string, string>) => {
    search({
      city: params.city,
      checkIn: params.checkIn || '',
      checkOut: params.checkOut || '',
      guests: parseInt(params.guests || '2'),
      rooms: parseInt(params.rooms || '1'),
    })
    setHasSearched(true)
  }

  const displayHotels = sortHotels(filterHotels(hotels, filters), sort)

  return (
    <div>
      {/* Search header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <HotelSearchForm onSearch={handleSearch} initialValues={initialValues} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorMessage message={error} className="mb-6" />}

        <div className="flex gap-8">
          <HotelFilters filters={filters} onChange={setFilters} />

          <div className="flex-1 min-w-0">
            {hasSearched && !loading && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{displayHotels.length}</span>{' '}
                  hotels found
                </p>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                  <Select
                    value={sort}
                    onValueChange={(v) => setSort(v as HotelSortOption)}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating-desc">Highest Rated</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {!hasSearched && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🏨</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Search for Hotels</h2>
                <p className="text-gray-500">
                  Enter your destination and dates above to find the perfect hotel.
                </p>
              </div>
            )}

            <HotelList hotels={displayHotels} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
