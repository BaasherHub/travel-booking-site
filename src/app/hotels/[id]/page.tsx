import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Star, Wifi, Car, Dumbbell, UtensilsCrossed,
  Waves, Sparkles, CheckCircle2, ArrowRight, Phone
} from 'lucide-react'
import { MOCK_HOTELS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import StarRating from '@/components/shared/StarRating'
import HotelCard from '@/components/hotels/HotelCard'

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  Parking: Car,
  Gym: Dumbbell,
  Restaurant: UtensilsCrossed,
  Pool: Waves,
  Spa: Sparkles,
}

export async function generateStaticParams() {
  return MOCK_HOTELS.map((h) => ({ id: h.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const hotel = MOCK_HOTELS.find((h) => h.id === id)
  if (!hotel) return { title: 'Hotel Not Found' }
  return {
    title: `${hotel.name} — ${hotel.location}`,
    description: hotel.description,
  }
}

export default async function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hotel = MOCK_HOTELS.find((h) => h.id === id)
  if (!hotel) notFound()

  const gradients = [
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-green-400 to-teal-500',
    'from-rose-400 to-red-500',
    'from-cyan-400 to-blue-500',
  ]
  const gradient = gradients[parseInt(hotel.id.replace(/\D/g, '')) % gradients.length]
  const similarHotels = MOCK_HOTELS.filter((h) => h.id !== hotel.id && h.city === hotel.city).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      <div className={`relative h-72 md:h-96 bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
          <Link href="/hotels" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to hotels
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h1 className="text-3xl font-bold text-white">{hotel.name}</h1>
              <div className="flex items-center gap-2 text-white/80 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{hotel.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">{formatPrice(hotel.pricePerNight)}</div>
              <div className="text-white/70 text-sm">per night</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={hotel.rating} size="lg" showValue />
                <span className="text-sm text-gray-500">
                  Based on {hotel.reviewCount.toLocaleString()} reviews
                </span>
                <Badge variant="success">
                  {hotel.rating >= 4.8 ? 'Exceptional' : hotel.rating >= 4.5 ? 'Excellent' : 'Very Good'}
                </Badge>
              </div>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Hotel Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity]
                  return (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                      {Icon ? (
                        <Icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                      {amenity}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Room types */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.roomTypes.map((room) => (
                  <div
                    key={room.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-gray-100 p-4 hover:border-blue-200 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{room.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs">
                          {room.bedType} bed
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs">
                          Up to {room.capacity} guests
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-blue-600">{formatPrice(room.price)}</div>
                      <div className="text-xs text-gray-500">per night</div>
                      <a
                        href={hotel.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="mt-2 block"
                      >
                        <Button size="sm" variant="gradient">Select Room</Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Hotel Policies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Check-in</p>
                  <p className="text-gray-500">{hotel.checkIn}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Check-out</p>
                  <p className="text-gray-500">{hotel.checkOut}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Pets</p>
                  <p className="text-gray-500">{hotel.policies.pets}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t space-y-2 text-sm text-gray-600">
                <p>📋 {hotel.policies.cancellation}</p>
                <p>🍽️ {hotel.policies.breakfast}</p>
              </div>
            </div>

            {/* Similar hotels */}
            {similarHotels.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar Hotels</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarHotels.map((h) => (
                    <HotelCard key={h.id} hotel={h} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Reserve Your Stay</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price from</span>
                    <span className="font-bold text-blue-600">{formatPrice(hotel.pricePerNight)}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & fees (12%)</span>
                    <span>{formatPrice(Math.round(hotel.pricePerNight * 0.12))}/night</span>
                  </div>
                </div>

                <a
                  href={hotel.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <Button variant="gradient" size="xl" className="w-full">
                    Reserve Now <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </a>
                <p className="text-xs text-center text-gray-400 mt-3">
                  No booking fees · Free cancellation available
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-sm">
                <p className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Need help booking?
                </p>
                <p className="text-blue-700">
                  Call us at{' '}
                  <a href="tel:+18005551234" className="font-medium underline">
                    +1 (800) 555-1234
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
