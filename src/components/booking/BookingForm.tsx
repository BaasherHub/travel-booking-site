'use client'

import { useState } from 'react'
import { User, Mail, Phone, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookingFormData, Passenger } from '@/types/booking'
import { cn } from '@/lib/utils'

interface BookingFormProps {
  passengerCount?: number
  onSubmit: (data: BookingFormData) => void
  loading?: boolean
}

export default function BookingForm({ passengerCount = 1, onSubmit, loading }: BookingFormProps) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', nationality: '',
    contactEmail: '', contactPhone: '', specialRequests: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName) e.firstName = 'First name is required'
    if (!form.lastName) e.lastName = 'Last name is required'
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required'
    if (!form.nationality) e.nationality = 'Nationality is required'
    if (!form.contactEmail) e.contactEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) e.contactEmail = 'Invalid email'
    if (!form.contactPhone) e.contactPhone = 'Phone is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const passenger: Passenger = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.contactEmail,
      phone: form.contactPhone,
      nationality: form.nationality,
      dateOfBirth: form.dateOfBirth,
    }
    onSubmit({
      travelers: Array.from({ length: passengerCount }, () => passenger),
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      specialRequests: form.specialRequests,
    })
  }

  return (
    <form onSubmit={onFormSubmit} className="space-y-6" noValidate>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Traveler Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
            <Input
              value={form.firstName}
              onChange={set('firstName')}
              placeholder="John"
              className={cn(errors.firstName && 'border-red-500')}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
            <Input
              value={form.lastName}
              onChange={set('lastName')}
              placeholder="Doe"
              className={cn(errors.lastName && 'border-red-500')}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={set('dateOfBirth')}
              className={cn(errors.dateOfBirth && 'border-red-500')}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality*</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={form.nationality}
                onChange={set('nationality')}
                placeholder="United States"
                className={cn('pl-9', errors.nationality && 'border-red-500')}
              />
            </div>
            {errors.nationality && (
              <p className="mt-1 text-xs text-red-500">{errors.nationality}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                value={form.contactEmail}
                onChange={set('contactEmail')}
                placeholder="john@example.com"
                className={cn('pl-9', errors.contactEmail && 'border-red-500')}
              />
            </div>
            {errors.contactEmail && (
              <p className="mt-1 text-xs text-red-500">{errors.contactEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                value={form.contactPhone}
                onChange={set('contactPhone')}
                placeholder="+1 234 567 8900"
                className={cn('pl-9', errors.contactPhone && 'border-red-500')}
              />
            </div>
            {errors.contactPhone && (
              <p className="mt-1 text-xs text-red-500">{errors.contactPhone}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (optional)
          </label>
          <textarea
            value={form.specialRequests}
            onChange={set('specialRequests')}
            rows={3}
            placeholder="Dietary requirements, accessibility needs, etc."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Processing...' : 'Continue to Review'}
      </Button>
    </form>
  )
}
