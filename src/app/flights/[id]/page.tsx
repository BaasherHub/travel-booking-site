import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Plane, Luggage, CheckCircle2, ArrowRight } from 'lucide-react'
import { MOCK_FLIGHTS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatTime, formatDate, getStopLabel } from '@/lib/utils'
import FlightCard from '@/components/flights/FlightCard'

export async function generateStaticParams() {
  return MOCK_FLIGHTS.map((f) => ({ id: f.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const flight = MOCK_FLIGHTS.find((f) => f.id === id)
  if (!flight) return { title: 'Flight Not Found' }
  return {
    title: `${flight.airline} ${flight.flightNumber} — ${flight.origin} to ${flight.destination}`,
    description: `Book ${flight.airline} flight from ${flight.originCity} to ${flight.destinationCity} for ${formatPrice(flight.price)}`,
  }
}

export default async function FlightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const flight = MOCK_FLIGHTS.find((f) => f.id === id)
  if (!flight) notFound()

  const similarFlights = MOCK_FLIGHTS.filter((f) => f.id !== flight.id).slice(0, 3)
  const taxes = Math.round(flight.price * 0.12)
  const fees = 25

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/flights" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to flights
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <Plane className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{flight.airline}</h1>
                  <p className="text-blue-100">{flight.flightNumber} · {flight.aircraft}</p>
                </div>
              </div>
            </div>
            <div className="text-right text-white">
              <div className="text-3xl font-bold">{formatPrice(flight.price)}</div>
              <div className="text-blue-100 text-sm">per person</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Route */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-6">Flight Details</h2>
              <div className="flex items-center justify-between gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{formatTime(flight.departureTime)}</div>
                  <div className="text-lg font-semibold mt-1">{flight.origin}</div>
                  <div className="text-sm text-gray-500">{flight.originCity}</div>
                  <div className="text-sm text-gray-400 mt-1">{formatDate(flight.departureTime)}</div>
                </div>

                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {flight.duration}
                  </div>
                  <div className="relative w-full flex items-center">
                    <div className="flex-1 h-0.5 bg-gray-300" />
                    <Plane className="h-5 w-5 text-blue-600 mx-2" />
                    <div className="flex-1 h-0.5 bg-gray-300" />
                  </div>
                  <Badge variant={flight.stops === 0 ? 'success' : 'secondary'}>
                    {getStopLabel(flight.stops)}
                  </Badge>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</div>
                  <div className="text-lg font-semibold mt-1">{flight.destination}</div>
                  <div className="text-sm text-gray-500">{flight.destinationCity}</div>
                  <div className="text-sm text-gray-400 mt-1">{formatDate(flight.arrivalTime)}</div>
                </div>
              </div>
            </div>

            {/* Baggage */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Luggage className="h-5 w-5 text-blue-600" />
                Baggage Allowance
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-600 font-medium">Carry-on</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{flight.baggage.carry_on}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-600 font-medium">Checked Baggage</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{flight.baggage.checked}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">In-flight Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {flight.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Similar flights */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Flights</h2>
              <div className="space-y-4">
                {similarFlights.map((f) => (
                  <FlightCard key={f.id} flight={f} compact />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base fare</span>
                  <span>{formatPrice(flight.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & fees (12%)</span>
                  <span>{formatPrice(taxes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking fee</span>
                  <span>{formatPrice(fees)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-3 mt-1">
                  <span>Total per person</span>
                  <span className="text-blue-600">{formatPrice(flight.price + taxes + fees)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500">
                  {flight.seatsAvailable <= 5
                    ? `⚠️ Only ${flight.seatsAvailable} seats remaining!`
                    : `✓ ${flight.seatsAvailable} seats available`}
                </p>
              </div>

              <a
                href={flight.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block mt-6"
              >
                <Button variant="gradient" size="xl" className="w-full">
                  Book This Flight <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </a>

              <p className="text-xs text-center text-gray-400 mt-3">
                You will be redirected to the airline&apos;s booking page
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
