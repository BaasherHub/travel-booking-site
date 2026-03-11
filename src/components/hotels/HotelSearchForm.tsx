'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LocationSearch from '@/components/shared/LocationSearch'
import DatePicker from '@/components/shared/DatePicker'
import { Input } from '@/components/ui/input'

interface HotelSearchFormProps {
  onSearch?: (params: Record<string, string>) => void
  initialValues?: Record<string, string>
}

export default function HotelSearchForm({ onSearch, initialValues }: HotelSearchFormProps) {
  const [city, setCity] = useState(initialValues?.city || '')
  const [checkIn, setCheckIn] = useState(initialValues?.checkIn || '')
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut || '')
  const [guests, setGuests] = useState(initialValues?.guests || '2')
  const [rooms, setRooms] = useState(initialValues?.rooms || '1')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!city) newErrors.city = 'Please enter a city'
    if (!checkIn) newErrors.checkIn = 'Please select check-in date'
    if (!checkOut) newErrors.checkOut = 'Please select check-out date'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const params: Record<string, string> = {
      city,
      checkIn,
      checkOut,
      guests,
      rooms,
    }
    if (onSearch) {
      onSearch(params)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* City */}
        <div className="lg:col-span-2">
          <LocationSearch
            value={city}
            onChange={setCity}
            placeholder="Where are you going?"
            label="Destination"
            id="hotel-city"
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>

        {/* Check-in */}
        <div>
          <DatePicker
            value={checkIn}
            onChange={setCheckIn}
            label="Check-in"
            id="checkIn"
          />
          {errors.checkIn && <p className="mt-1 text-xs text-red-500">{errors.checkIn}</p>}
        </div>

        {/* Check-out */}
        <div>
          <DatePicker
            value={checkOut}
            onChange={setCheckOut}
            label="Check-out"
            id="checkOut"
            min={checkIn}
          />
          {errors.checkOut && <p className="mt-1 text-xs text-red-500">{errors.checkOut}</p>}
        </div>

        {/* Guests & Rooms */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <Input
              id="guests"
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">
              Rooms
            </label>
            <Input
              id="rooms"
              type="number"
              min={1}
              max={10}
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
          </div>
        </div>

        {/* Search */}
        <div className="flex items-end">
          <Button type="submit" variant="gradient" size="lg" className="w-full h-10">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}
