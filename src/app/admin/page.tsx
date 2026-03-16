'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface AdminStats {
  totalBookings: number
  totalUsers: number
  totalCommission: number
  confirmedBookings: number
  pendingBookings: number
  recentSearches: number
}

interface AdminBooking {
  id: string
  type: string
  status: string
  totalPrice: number
  currency: string
  commission: number | null
  commissionRate: number | null
  affiliateUrl: string | null
  createdAt: string
  user: { id: string; name: string | null; email: string | null }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'confirmed') return <CheckCircle className="h-3 w-3" />
  if (status === 'pending') return <Clock className="h-3 w-3" />
  if (status === 'cancelled') return <XCircle className="h-3 w-3" />
  return <CheckCircle className="h-3 w-3" />
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.status === 403) {
        setAuthorized(false)
        router.push('/')
        return
      }
      if (res.ok) {
        const json = await res.json()
        setStats(json.data)
        setAuthorized(true)
      }
    } catch {
      // ignore
    }
  }, [router])

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' })
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/admin/bookings?${params}`)
      if (res.status === 403) {
        setAuthorized(false)
        router.push('/')
        return
      }
      if (res.ok) {
        const json = await res.json()
        setBookings(json.data)
        setTotalPages(json.pagination?.pages || 1)
        setAuthorized(true)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetchStats()
    fetchBookings()
  }, [status, fetchStats, fetchBookings])

  async function updateStatus(id: string, newStatus: string) {
    setUpdating(id)
    try {
      await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      await fetchBookings()
      await fetchStats()
    } finally {
      setUpdating(null)
    }
  }

  if (status === 'loading' || authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  const statCards = stats
    ? [
        {
          label: 'Total Bookings',
          value: stats.totalBookings,
          icon: BookOpen,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
        },
        {
          label: 'Total Commission',
          value: formatPrice(stats.totalCommission),
          icon: DollarSign,
          color: 'text-green-600',
          bg: 'bg-green-50',
        },
        {
          label: 'Active Users',
          value: stats.totalUsers,
          icon: Users,
          color: 'text-purple-600',
          bg: 'bg-purple-50',
        },
        {
          label: 'Recent Searches (30d)',
          value: stats.recentSearches,
          icon: Search,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Manage bookings and track commissions</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchStats()
              fetchBookings()
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Commission Summary */}
        {stats && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Booking Status Overview</h2>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="font-semibold">{stats.pendingBookings}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Confirmed:</span>
                <span className="font-semibold">{stats.confirmedBookings}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Est. Total Commission:</span>
                <span className="font-semibold text-green-600">
                  {formatPrice(stats.totalCommission)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-semibold text-gray-900">Bookings</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-500">ID</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">User</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Type</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500">Commission</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {booking.id.slice(0, 8)}…
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.user.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{booking.user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-700">{booking.type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <StatusIcon status={booking.status} />
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {formatPrice(booking.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-right text-green-600 font-medium">
                        {booking.commission
                          ? formatPrice(booking.commission)
                          : booking.commissionRate
                          ? formatPrice(booking.totalPrice * booking.commissionRate)
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          disabled={updating === booking.id}
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
