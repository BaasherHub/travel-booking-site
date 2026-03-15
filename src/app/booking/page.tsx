'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  CheckCircle2,
  Plane,
  Building2,
  ArrowRight,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import BookingForm from '@/components/booking/BookingForm'
import PaymentForm from '@/components/booking/PaymentForm'
import BookingSummary from '@/components/booking/BookingSummary'
import { useBooking } from '@/context/BookingContext'
import { MOCK_FLIGHTS } from '@/lib/mock-data'
import { MOCK_HOTELS } from '@/lib/mock-data'
import { Flight } from '@/types/flight'
import { Hotel } from '@/types/hotel'
import { BookingFormData } from '@/types/booking'
import { formatPrice } from '@/lib/utils'

const STEPS = ['Traveler Details', 'Payment', 'Confirmation']

export default function BookingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { bookingItem, setBookingItem, formData, setFormData, currentStep, setCurrentStep } =
    useBooking()

  const [loading, setLoading] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)

  const type = searchParams.get('type') as 'flight' | 'hotel' | null
  const id = searchParams.get('id')
  const passengers = parseInt(searchParams.get('passengers') || '1')
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''

  useEffect(() => {
    if (!bookingItem && type && id) {
      if (type === 'flight') {
        const flight = MOCK_FLIGHTS.find((f) => f.id === id)
        if (flight) setBookingItem({ type: 'flight', item: flight })
      } else if (type === 'hotel') {
        const hotel = MOCK_HOTELS.find((h) => h.id === id)
        if (hotel) setBookingItem({ type: 'hotel', item: hotel })
      }
    }
  }, [type, id, bookingItem, setBookingItem])

  useEffect(() => {
    if (status === 'unauthenticated') {
      const callbackUrl = encodeURIComponent(window.location.href)
      router.push(`/login?callbackUrl=${callbackUrl}`)
    }
  }, [status, router])

  const computeTotal = () => {
    if (!bookingItem) return 0
    if (bookingItem.type === 'flight') {
      const flight = bookingItem.item as Flight
      const base = flight.price * passengers
      return base + Math.round(base * 0.12) + 25
    } else {
      const hotel = bookingItem.item as Hotel
      const nights =
        checkIn && checkOut
          ? Math.max(
              1,
              (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
            )
          : 1
      const base = hotel.pricePerNight * nights
      return base + Math.round(base * 0.12) + 25
    }
  }

  const handleTravelerSubmit = (data: BookingFormData) => {
    setFormData(data)
    setTotalPrice(computeTotal())
    setCurrentStep(2)
  }

  const handlePaymentSubmit = async () => {
    setLoading(true)
    try {
      const details =
        bookingItem?.type === 'flight'
          ? {
              flight: bookingItem.item,
              passengers: formData?.travelers || [],
              departureDate: searchParams.get('departureDate') || '',
              cabinClass: searchParams.get('cabinClass') || 'economy',
            }
          : {
              hotel: bookingItem?.item,
              roomType: searchParams.get('roomType') || 'Standard Room',
              checkIn,
              checkOut,
              guests: formData?.travelers || [],
              rooms: parseInt(searchParams.get('rooms') || '1'),
            }

      const price = computeTotal()

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: bookingItem?.type,
          details,
          totalPrice: price,
          currency: 'USD',
        }),
      })

      const data = await res.json()
      const ref = data.data?.id?.slice(-8).toUpperCase() || Math.random().toString(36).slice(2, 10).toUpperCase()
      setBookingRef(ref)
      setTotalPrice(price)
      setCurrentStep(3)
    } catch {
      setCurrentStep(3)
      setBookingRef(Math.random().toString(36).slice(2, 10).toUpperCase())
      setTotalPrice(computeTotal())
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!bookingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No booking selected</h2>
        <p className="text-gray-500 mb-6">Please select a flight or hotel to book.</p>
        <div className="flex gap-3">
          <Button variant="gradient" onClick={() => router.push('/flights')}>
            <Plane className="h-4 w-4 mr-1" /> Find Flights
          </Button>
          <Button variant="outline" onClick={() => router.push('/hotels')}>
            <Building2 className="h-4 w-4 mr-1" /> Find Hotels
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            {bookingItem.type === 'flight' ? 'Flight Booking' : 'Hotel Booking'}
          </h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => {
              const stepNum = i + 1
              const isCompleted = currentStep > stepNum
              const isActive = currentStep === stepNum
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-white text-blue-700'
                          : 'bg-white/20 text-white/60'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:block ${
                        isActive ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 3 ? (
          // Confirmation step
          <div className="max-w-xl mx-auto text-center py-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">
              Your booking has been successfully confirmed. A confirmation email will be sent
              shortly.
            </p>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="text-sm text-gray-500 mb-1">Booking Reference</div>
              <div className="text-2xl font-bold font-mono text-blue-600">{bookingRef}</div>
              <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="gradient" onClick={() => router.push('/dashboard')}>
                View My Bookings
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(bookingItem.type === 'flight' ? '/flights' : '/hotels')
                }
              >
                {bookingItem.type === 'flight' ? 'Find More Flights' : 'Find More Hotels'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                {currentStep === 1 && (
                  <BookingForm
                    passengerCount={passengers || 1}
                    onSubmit={handleTravelerSubmit}
                  />
                )}
                {currentStep === 2 && (
                  <>
                    <div className="mb-6">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        ← Back to traveler details
                      </button>
                    </div>
                    <PaymentForm
                      onSubmit={handlePaymentSubmit}
                      loading={loading}
                      amount={computeTotal()}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <BookingSummary
                  type={bookingItem.type}
                  item={bookingItem.item}
                  passengers={passengers}
                  checkIn={checkIn}
                  checkOut={checkOut}
                />
                {currentStep === 1 && (
                  <p className="text-xs text-center text-gray-400 mt-3">
                    No payment taken yet — complete the next step to confirm.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
