'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { FlightFilter } from '@/types/flight'
import { PRICE_RANGES } from '@/lib/constants'
import { Button } from '@/components/ui/button'

const AIRLINES = [
  'Emirates', 'Delta Airlines', 'United Airlines', 'British Airways', 'Lufthansa',
  'Singapore Airlines', 'Air France', 'Qatar Airways', 'American Airlines',
]

interface FlightFiltersProps {
  filters: FlightFilter
  onChange: (filters: FlightFilter) => void
}

export default function FlightFilters({ filters, onChange }: FlightFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleStopToggle = (stop: number) => {
    const current = filters.stops
    const updated = current.includes(stop)
      ? current.filter((s) => s !== stop)
      : [...current, stop]
    onChange({ ...filters, stops: updated })
  }

  const handleAirlineToggle = (airline: string) => {
    const current = filters.airlines
    const updated = current.includes(airline)
      ? current.filter((a) => a !== airline)
      : [...current, airline]
    onChange({ ...filters, airlines: updated })
  }

  const resetFilters = () => {
    onChange({
      priceRange: [PRICE_RANGES.FLIGHT.min, PRICE_RANGES.FLIGHT.max],
      stops: [],
      airlines: [],
      departureTimeRange: [0, 24],
    })
  }

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-xs text-blue-600 hover:underline"
        >
          Reset all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-2">
          <input
            type="range"
            min={PRICE_RANGES.FLIGHT.min}
            max={PRICE_RANGES.FLIGHT.max}
            step={50}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onChange({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })
            }
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Number of Stops</h4>
        <div className="space-y-2">
          {[
            { value: 0, label: 'Nonstop' },
            { value: 1, label: '1 Stop' },
            { value: 2, label: '2+ Stops' },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.stops.includes(value)}
                onChange={() => handleStopToggle(value)}
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Airlines</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {AIRLINES.map((airline) => (
            <label key={airline} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => handleAirlineToggle(airline)}
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">{airline}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Mobile drawer */}
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

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-5">
          {content}
        </div>
      </div>
    </>
  )
}
