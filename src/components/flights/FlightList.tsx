import { Plane } from 'lucide-react'
import { Flight } from '@/types/flight'
import FlightCard from './FlightCard'
import { Skeleton } from '@/components/ui/skeleton'

interface FlightListProps {
  flights: Flight[]
  loading: boolean
}

function FlightSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-center">
          <div className="space-y-1 text-center">
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-px flex-1" />
          <div className="space-y-1 text-center">
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}

export default function FlightList({ flights, loading }: FlightListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FlightSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (flights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
          <Plane className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
        <p className="text-gray-500 max-w-sm">
          Try adjusting your search criteria or browse our popular destinations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4" aria-label="Flight results">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  )
}
