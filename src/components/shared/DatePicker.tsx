'use client'

import { Input } from '@/components/ui/input'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  id?: string
  min?: string
  placeholder?: string
}

export default function DatePicker({
  value,
  onChange,
  label,
  id,
  min,
  placeholder,
}: DatePickerProps) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Input
        type="date"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min || today}
        placeholder={placeholder}
        className="cursor-pointer"
      />
    </div>
  )
}
