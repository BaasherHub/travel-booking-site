'use client'

import { Minus, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PassengerSelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
}

export default function PassengerSelector({
  value,
  onChange,
  min = 1,
  max = 9,
  label,
}: PassengerSelectorProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="flex items-center gap-3 rounded-md border border-gray-300 bg-white px-3 h-10">
        <Users className="h-4 w-4 text-gray-400" />
        <span className="text-sm flex-1">{value} {value === 1 ? 'Passenger' : 'Passengers'}</span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            aria-label="Decrease passengers"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{value}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            aria-label="Increase passengers"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
