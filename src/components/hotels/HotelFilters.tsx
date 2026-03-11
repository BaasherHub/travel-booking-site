'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { HotelFilter } from '@/types/hotel'
import { PRICE_RANGES, HOTEL_AMENITIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'

interface HotelFiltersProps {
  filters: HotelFilter
  onChange: (filters: HotelFilter) => void
}

export default function HotelFilters({ filters, onChange }: HotelFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleStarToggle = (star: number) => {
    const updated = filters.stars.includes(star)
      ? filters.stars.filter((s) => s !== star)
      : [...filters.stars, star]
    onChange({ ...filters, stars: updated })
  }

  const handleAmenityToggle = (amenity: string) => {
    const updated = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    onChange({ ...filters, amenities: updated })
  }

  const resetFilters = () => {
    onChange({
      priceRange: [PRICE_RANGES.HOTEL.min, PRICE_RANGES.HOTEL.max],
      stars: [],
      amenities: [],
      ratingMin: 0,
    })
  }

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline">
          Reset all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Per Night</h4>
        <input
          type="range"
          min={PRICE_RANGES.HOTEL.min}
          max={PRICE_RANGES.HOTEL.max}
          step={10}
          value={filters.priceRange[1]}
          onChange={(e) =>
            onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })
          }
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Star Rating</h4>
        <div className="flex gap-2 flex-wrap">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarToggle(star)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                filters.stars.includes(star)
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {star}★
            </button>
          ))}
        </div>
      </div>

      {/* Guest Rating */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Minimum Guest Rating: {filters.ratingMin.toFixed(1)}
        </h4>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.ratingMin}
          onChange={(e) => onChange({ ...filters, ratingMin: Number(e.target.value) })}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>5.0</span>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {HOTEL_AMENITIES.slice(0, 8).map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden mb-4">
        <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)} className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}

      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-5">
          {content}
        </div>
      </div>
    </>
  )
}
