import { Building2 } from 'lucide-react'
import { Hotel } from '@/types/hotel'
import HotelCard from './HotelCard'
import { Skeleton } from '@/components/ui/skeleton'

interface HotelListProps {
  hotels: Hotel[]
  loading: boolean
}

function HotelSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </div>
  )
}

export default function HotelList({ hotels, loading }: HotelListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <HotelSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
          <Building2 className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
        <p className="text-gray-500 max-w-sm">
          Try adjusting your filters or searching for a different destination.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" aria-label="Hotel results">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  )
}
