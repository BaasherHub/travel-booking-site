'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Session } from 'next-auth'
import {
  Plane,
  Building2,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice, formatDate } from '@/lib/utils'

interface BookingRecord {
  id: string
  type: 'flight' | 'hotel'
  status: 'pending' | 'confirmed' | 'cancelled'
  totalPrice: number
  currency: string
  details: Record<string, unknown>
  createdAt: string
}

const statusConfig = {
  confirmed: { icon: CheckCircle2, label: 'Confirmed', variant: 'success' as const, color: 'text-green-600' },
  pending: { icon: AlertCircle, label: 'Pending', variant: 'warning' as const, color: 'text-amber-600' },
  cancelled: { icon: XCircle, label: 'Cancelled', variant: 'destructive' as const, color: 'text-red-500' },
}

interface Props {
  session: Session
}

export default function DashboardClient({ session }: Props) {
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.data || [])
      })
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const flights = bookings.filter((b) => b.type === 'flight')
  const hotels = bookings.filter((b) => b.type === 'hotel')

  const BookingCard = ({ booking }: { booking: BookingRecord }) => {
    const status = statusConfig[booking.status] || statusConfig.pending
    const StatusIcon = status.icon
    const details = booking.details as Record<string, Record<string, string>>

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              {booking.type === 'flight' ? (
                <Plane className="h-5 w-5 text-blue-600" />
              ) : (
                <Building2 className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {booking.type === 'flight'
                  ? `${(details?.flight as Record<string, string>)?.airline || 'Flight'} — ${(details?.flight as Record<string, string>)?.origin || ''} → ${(details?.flight as Record<string, string>)?.destination || ''}`
                  : `${(details?.hotel as Record<string, string>)?.name || 'Hotel'}`}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3 w-3" />
                Booked {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
            <span className={status.color}>{status.label}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
          <span className="text-gray-500">
            Ref: <span className="font-mono text-gray-700 text-xs">{booking.id.slice(-8).toUpperCase()}</span>
          </span>
          <span className="font-bold text-blue-600">{formatPrice(booking.totalPrice)}</span>
        </div>
      </div>
    )
  }

  const EmptyState = ({ type }: { type: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">{type === 'flight' ? '✈️' : type === 'hotel' ? '🏨' : '🗺️'}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No {type} bookings yet</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        {type === 'all'
          ? "You haven't made any bookings yet. Start exploring!"
          : `No ${type} bookings found. Book your first ${type} now.`}
      </p>
      <div className="flex gap-3">
        <Link href="/flights">
          <Button variant="gradient" size="sm">
            <Plane className="h-4 w-4 mr-1" /> Find Flights
          </Button>
        </Link>
        <Link href="/hotels">
          <Button variant="outline" size="sm">
            <Building2 className="h-4 w-4 mr-1" /> Find Hotels
          </Button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {session.user?.name?.split(' ')[0] || 'Traveler'}!
              </h1>
              <p className="text-blue-100 text-sm mt-0.5">{session.user?.email}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Total Bookings', value: bookings.length },
              { label: 'Flights', value: flights.length },
              { label: 'Hotels', value: hotels.length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-blue-100 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
          <div className="flex gap-2">
            <Link href="/flights">
              <Button variant="outline" size="sm">
                <Plane className="h-4 w-4 mr-1" /> Book Flight
              </Button>
            </Link>
            <Link href="/hotels">
              <Button variant="gradient" size="sm">
                <Building2 className="h-4 w-4 mr-1" /> Book Hotel
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-4 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All Bookings{' '}
                {bookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {bookings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="flights">
                Flights{' '}
                {flights.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {flights.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="hotels">
                Hotels{' '}
                {hotels.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {hotels.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {bookings.length === 0 ? (
                <EmptyState type="all" />
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="flights">
              {flights.length === 0 ? (
                <EmptyState type="flight" />
              ) : (
                <div className="space-y-4">
                  {flights.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hotels">
              {hotels.length === 0 ? (
                <EmptyState type="hotel" />
              ) : (
                <div className="space-y-4">
                  {hotels.map((b) => (
                    <BookingCard key={b.id} booking={b} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
