import { Flight } from '@/types/flight'
import { Hotel } from '@/types/hotel'
import { formatPrice, formatDate, getNightCount } from '@/lib/utils'
import { Plane, Building2, Calendar, Users, Clock } from 'lucide-react'

interface BookingSummaryProps {
  type: 'flight' | 'hotel'
  item: Flight | Hotel
  passengers?: number
  checkIn?: string
  checkOut?: string
}

export default function BookingSummary({
  type,
  item,
  passengers = 1,
  checkIn,
  checkOut,
}: BookingSummaryProps) {
  const flight = type === 'flight' ? (item as Flight) : null
  const hotel = type === 'hotel' ? (item as Hotel) : null
  const nights = checkIn && checkOut ? getNightCount(checkIn, checkOut) : 0
  const basePrice = type === 'flight' ? (flight?.price || 0) * passengers : (hotel?.pricePerNight || 0) * nights
  const taxes = Math.round(basePrice * 0.12)
  const fees = 25
  const total = basePrice + taxes + fees

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

      {flight && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Plane className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{flight.airline}</span>
            <span className="text-gray-500">{flight.flightNumber}</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{flight.origin}</span>
            {' → '}
            <span className="font-medium">{flight.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {flight.duration} • {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop`}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            {passengers} {passengers === 1 ? 'passenger' : 'passengers'} • {flight.cabinClass}
          </div>
        </div>
      )}

      {hotel && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{hotel.name}</span>
          </div>
          <div className="text-sm text-gray-500">{hotel.location}</div>
          {checkIn && checkOut && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {formatDate(checkIn)} → {formatDate(checkOut)} ({nights} nights)
            </div>
          )}
        </div>
      )}

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {type === 'flight'
              ? `${formatPrice(flight?.price || 0)} × ${passengers} passenger${passengers > 1 ? 's' : ''}`
              : `${formatPrice(hotel?.pricePerNight || 0)} × ${nights} night${nights !== 1 ? 's' : ''}`}
          </span>
          <span>{formatPrice(basePrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes (12%)</span>
          <span>{formatPrice(taxes)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service fee</span>
          <span>{formatPrice(fees)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
