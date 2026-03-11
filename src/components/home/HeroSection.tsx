'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plane, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import FlightSearchForm from '@/components/flights/FlightSearchForm'
import HotelSearchForm from '@/components/hotels/HotelSearchForm'

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights')
  const router = useRouter()

  return (
    <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-20 left-1/4 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Hero headline */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Find Your{' '}
            <span className="text-yellow-300">Perfect Trip</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Search and compare hundreds of airlines and hotels. Book the best deals and start your adventure.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {[
              { value: '500+', label: 'Airlines' },
              { value: '200K+', label: 'Hotels' },
              { value: '100K+', label: 'Happy Travelers' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Panel */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('flights')}
              className={cn(
                'flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors flex-1 justify-center',
                activeTab === 'flights'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
              aria-pressed={activeTab === 'flights'}
            >
              <Plane className="h-4 w-4" />
              Flights
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={cn(
                'flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors flex-1 justify-center',
                activeTab === 'hotels'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
              aria-pressed={activeTab === 'hotels'}
            >
              <Building2 className="h-4 w-4" />
              Hotels
            </button>
          </div>

          {/* Search Form */}
          <div className="p-6">
            {activeTab === 'flights' ? (
              <FlightSearchForm
                onSearch={(params) => {
                  const qs = new URLSearchParams(params as Record<string, string>)
                  router.push(`/flights?${qs.toString()}`)
                }}
              />
            ) : (
              <HotelSearchForm
                onSearch={(params) => {
                  const qs = new URLSearchParams(params as Record<string, string>)
                  router.push(`/hotels?${qs.toString()}`)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
