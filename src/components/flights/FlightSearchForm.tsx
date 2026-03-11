'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LocationSearch from '@/components/shared/LocationSearch'
import DatePicker from '@/components/shared/DatePicker'
import PassengerSelector from '@/components/shared/PassengerSelector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CABIN_CLASSES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface FlightSearchFormProps {
  onSearch?: (params: Record<string, string>) => void
  initialValues?: Record<string, string>
  compact?: boolean
}

export default function FlightSearchForm({
  onSearch,
  initialValues,
  compact = false,
}: FlightSearchFormProps) {
  const router = useRouter()
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(
    (initialValues?.tripType as 'one-way' | 'round-trip') || 'round-trip'
  )
  const [origin, setOrigin] = useState(initialValues?.origin || '')
  const [destination, setDestination] = useState(
    initialValues?.destination || initialValues?.destinationCity || ''
  )
  const [departureDate, setDepartureDate] = useState(initialValues?.departureDate || '')
  const [returnDate, setReturnDate] = useState(initialValues?.returnDate || '')
  const [passengers, setPassengers] = useState(
    parseInt(initialValues?.passengers || '1')
  )
  const [cabinClass, setCabinClass] = useState(initialValues?.cabinClass || 'economy')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!origin) newErrors.origin = 'Please enter origin'
    if (!destination) newErrors.destination = 'Please enter destination'
    if (!departureDate) newErrors.departureDate = 'Please select departure date'
    if (tripType === 'round-trip' && !returnDate) {
      newErrors.returnDate = 'Please select return date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSwap = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const params: Record<string, string> = {
      origin,
      destination,
      departureDate,
      passengers: passengers.toString(),
      cabinClass,
      tripType,
      ...(tripType === 'round-trip' && returnDate ? { returnDate } : {}),
    }
    if (onSearch) {
      onSearch(params)
    } else {
      const qs = new URLSearchParams(params)
      router.push(`/flights?${qs.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Trip type selector */}
      <div className="flex gap-4 mb-4">
        {(['round-trip', 'one-way'] as const).map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value={type}
              checked={tripType === type}
              onChange={() => setTripType(type)}
              className="text-blue-600"
            />
            <span className="text-sm font-medium capitalize">{type.replace('-', ' ')}</span>
          </label>
        ))}
      </div>

      <div className={cn('grid gap-3', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-12')}>
        {/* Origin */}
        <div className={compact ? '' : 'lg:col-span-3'}>
          <LocationSearch
            value={origin}
            onChange={setOrigin}
            placeholder="From where?"
            label="Origin"
            id="origin"
          />
          {errors.origin && <p className="mt-1 text-xs text-red-500">{errors.origin}</p>}
        </div>

        {/* Swap button */}
        {!compact && (
          <div className="hidden lg:flex lg:col-span-1 items-end justify-center pb-0.5">
            <button
              type="button"
              onClick={handleSwap}
              className="rounded-full border p-2 hover:bg-gray-100 transition-colors"
              aria-label="Swap origin and destination"
            >
              <ArrowLeftRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}

        {/* Destination */}
        <div className={compact ? '' : 'lg:col-span-3'}>
          <LocationSearch
            value={destination}
            onChange={setDestination}
            placeholder="Where to?"
            label="Destination"
            id="destination"
          />
          {errors.destination && (
            <p className="mt-1 text-xs text-red-500">{errors.destination}</p>
          )}
        </div>

        {/* Departure date */}
        <div className={compact ? '' : 'lg:col-span-2'}>
          <DatePicker
            value={departureDate}
            onChange={setDepartureDate}
            label="Departure"
            id="departureDate"
          />
          {errors.departureDate && (
            <p className="mt-1 text-xs text-red-500">{errors.departureDate}</p>
          )}
        </div>

        {/* Return date */}
        {tripType === 'round-trip' && (
          <div className={compact ? '' : 'lg:col-span-2'}>
            <DatePicker
              value={returnDate}
              onChange={setReturnDate}
              label="Return"
              id="returnDate"
              min={departureDate}
            />
            {errors.returnDate && (
              <p className="mt-1 text-xs text-red-500">{errors.returnDate}</p>
            )}
          </div>
        )}

        {/* Passengers */}
        <div className={compact ? '' : 'lg:col-span-2'}>
          <PassengerSelector value={passengers} onChange={setPassengers} label="Passengers" />
        </div>

        {/* Cabin class */}
        <div className={compact ? '' : 'lg:col-span-2'}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <Select value={cabinClass} onValueChange={setCabinClass}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CABIN_CLASSES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search button */}
        <div className={compact ? '' : 'lg:col-span-2 flex items-end'}>
          <Button type="submit" variant="gradient" size="lg" className="w-full h-10">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}
