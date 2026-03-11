import Link from 'next/link'
import { ArrowRight, Clock, Plane } from 'lucide-react'
import { Flight } from '@/types/flight'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatTime, getStopLabel } from '@/lib/utils'

interface FlightCardProps {
  flight: Flight
  compact?: boolean
}

export default function FlightCard({ flight, compact = false }: FlightCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Airline info */}
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Plane className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{flight.airline}</p>
            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Route & Times */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
            <p className="text-sm font-medium text-gray-700">{flight.origin}</p>
            <p className="text-xs text-gray-400">{flight.originCity}</p>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1 max-w-[140px]">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {flight.duration}
            </div>
            <div className="relative w-full flex items-center">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="w-2 h-2 rounded-full bg-gray-400 mx-1" />
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <Badge
              variant={flight.stops === 0 ? 'success' : 'secondary'}
              className="text-xs"
            >
              {getStopLabel(flight.stops)}
            </Badge>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
            <p className="text-sm font-medium text-gray-700">{flight.destination}</p>
            <p className="text-xs text-gray-400">{flight.destinationCity}</p>
          </div>
        </div>

        {/* Price & Book */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{formatPrice(flight.price)}</p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/flights/${flight.id}`}>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </Link>
            <a href={flight.affiliateUrl} target="_blank" rel="noopener noreferrer nofollow">
              <Button size="sm" variant="gradient">
                Book Now <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          {flight.amenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
            >
              {amenity}
            </span>
          ))}
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
            Carry-on: {flight.baggage.carry_on}
          </span>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
            Checked: {flight.baggage.checked}
          </span>
          {flight.seatsAvailable <= 5 && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-red-600 font-medium">
              Only {flight.seatsAvailable} seats left!
            </span>
          )}
        </div>
      )}
    </div>
  )
}
