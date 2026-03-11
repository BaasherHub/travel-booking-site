import Link from 'next/link'
import { MapPin, ArrowRight, Wifi, Car, Dumbbell, UtensilsCrossed, Waves, Sparkles } from 'lucide-react'
import { Hotel } from '@/types/hotel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StarRating from '@/components/shared/StarRating'
import { formatPrice } from '@/lib/utils'

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  Parking: Car,
  Gym: Dumbbell,
  Restaurant: UtensilsCrossed,
  Pool: Waves,
  Spa: Sparkles,
}

interface HotelCardProps {
  hotel: Hotel
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const gradients = [
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-green-400 to-teal-500',
    'from-rose-400 to-red-500',
    'from-cyan-400 to-blue-500',
  ]
  const gradient = gradients[parseInt(hotel.id.replace(/\D/g, '')) % gradients.length]

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-48 bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute top-3 right-3">
          <Badge className="bg-white text-gray-800 border-0 font-bold text-sm">
            {hotel.stars}★
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full bg-black/50 px-2.5 py-1 text-xs text-white font-medium">
            {hotel.reviewCount.toLocaleString()} reviews
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{hotel.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{hotel.location}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-blue-600">{formatPrice(hotel.pricePerNight)}</div>
            <div className="text-xs text-gray-500">per night</div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={hotel.rating} showValue />
          <span className="text-xs text-gray-500">
            {hotel.rating >= 4.8 ? 'Exceptional' : hotel.rating >= 4.5 ? 'Excellent' : 'Very Good'}
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities.slice(0, 5).map((amenity) => {
            const Icon = amenityIcons[amenity]
            return (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
              >
                {Icon && <Icon className="h-3 w-3" />}
                {amenity}
              </span>
            )
          })}
          {hotel.amenities.length > 5 && (
            <span className="text-xs text-gray-400">+{hotel.amenities.length - 5} more</span>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          <Link href={`/hotels/${hotel.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <a
            href={hotel.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-1"
          >
            <Button variant="gradient" size="sm" className="w-full">
              Reserve <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
