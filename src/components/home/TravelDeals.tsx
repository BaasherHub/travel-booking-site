import Link from 'next/link'
import { Tag, ArrowRight } from 'lucide-react'
import { TRAVEL_DEALS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function TravelDeals() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Hot Travel Deals</h2>
            <p className="mt-1 text-gray-500">Limited-time offers — grab them before they&apos;re gone!</p>
          </div>
          <Link
            href="/flights"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAVEL_DEALS.map((deal) => (
            <Link
              key={deal.id}
              href={deal.type === 'flight' ? '/flights' : '/hotels'}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`h-40 bg-gradient-to-br ${deal.gradient}`}>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white border-0 text-xs font-bold">
                    -{deal.discount}% OFF
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                    {deal.type === 'flight' ? 'Flight Deal' : 'Hotel Deal'} • {deal.destination}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{deal.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(deal.discountedPrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(deal.originalPrice)}
                  </span>
                </div>
                <p className="text-xs text-red-500 mt-1">Valid until {deal.validUntil}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
