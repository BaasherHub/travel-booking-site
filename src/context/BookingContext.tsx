'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Flight } from '@/types/flight'
import { Hotel } from '@/types/hotel'
import { BookingFormData } from '@/types/booking'

type BookingItem = { type: 'flight'; item: Flight } | { type: 'hotel'; item: Hotel }

interface BookingContextType {
  bookingItem: BookingItem | null
  formData: BookingFormData | null
  currentStep: number
  setBookingItem: (item: BookingItem | null) => void
  setFormData: (data: BookingFormData) => void
  setCurrentStep: (step: number) => void
  clearBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingItem, setBookingItem] = useState<BookingItem | null>(null)
  const [formData, setFormData] = useState<BookingFormData | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const clearBooking = () => {
    setBookingItem(null)
    setFormData(null)
    setCurrentStep(1)
  }

  return (
    <BookingContext.Provider
      value={{
        bookingItem,
        formData,
        currentStep,
        setBookingItem,
        setFormData,
        setCurrentStep,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}
