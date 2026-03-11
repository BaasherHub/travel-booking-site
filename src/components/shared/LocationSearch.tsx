'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { POPULAR_AIRPORTS } from '@/lib/constants'
import { useDebounce } from '@/hooks/useDebounce'
import { MapPin } from 'lucide-react'

interface LocationSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  id?: string
}

export default function LocationSearch({
  value,
  onChange,
  placeholder = 'City or airport',
  label,
  id,
}: LocationSearchProps) {
  const [open, setOpen] = useState(false)
  const debouncedValue = useDebounce(value, 200)

  const suggestions = POPULAR_AIRPORTS.filter(
    (airport) =>
      debouncedValue.length >= 1 &&
      (airport.city.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        airport.code.toLowerCase().includes(debouncedValue.toLowerCase()))
  ).slice(0, 6)

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          className="pl-9"
          autoComplete="off"
        />
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg">
          {suggestions.map((airport) => (
            <button
              key={airport.code}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              onMouseDown={() => {
                onChange(`${airport.city} (${airport.code})`)
                setOpen(false)
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                {airport.code}
              </div>
              <div>
                <div className="text-sm font-medium">{airport.city}</div>
                <div className="text-xs text-gray-500">{airport.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
