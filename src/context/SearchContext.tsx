'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { FlightSearchParams, Flight } from '@/types/flight'
import { HotelSearchParams, Hotel } from '@/types/hotel'

interface SearchContextType {
  flightSearch: FlightSearchParams | null
  hotelSearch: HotelSearchParams | null
  selectedFlight: Flight | null
  selectedHotel: Hotel | null
  setFlightSearch: (params: FlightSearchParams) => void
  setHotelSearch: (params: HotelSearchParams) => void
  setSelectedFlight: (flight: Flight | null) => void
  setSelectedHotel: (hotel: Hotel | null) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [flightSearch, setFlightSearch] = useState<FlightSearchParams | null>(null)
  const [hotelSearch, setHotelSearch] = useState<HotelSearchParams | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)

  return (
    <SearchContext.Provider
      value={{
        flightSearch,
        hotelSearch,
        selectedFlight,
        selectedHotel,
        setFlightSearch,
        setHotelSearch,
        setSelectedFlight,
        setSelectedHotel,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}
