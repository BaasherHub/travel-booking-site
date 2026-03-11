import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { POPULAR_DESTINATIONS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'

export default function PopularDestinations() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
          <p className="mt-3 text-lg text-gray-500">
            Explore the world&apos;s most sought-after travel destinations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DESTINATIONS.slice(0, 8).map((dest) => (
            <Link
              key={dest.id}
              href={`/flights?destination=${dest.code}&destinationCity=${dest.name}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`h-48 bg-gradient-to-br ${dest.gradient} flex items-end`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative p-5 text-white w-full">
                  <h3 className="font-bold text-xl">{dest.name}</h3>
                  <p className="text-sm text-white/80">{dest.country}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">
                      From <strong>{formatPrice(dest.startingPrice)}</strong>
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
