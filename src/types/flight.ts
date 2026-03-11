export interface Flight {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  origin: string
  originCity: string
  destination: string
  destinationCity: string
  departureTime: string
  arrivalTime: string
  duration: string
  durationMinutes: number
  stops: number
  stopCities?: string[]
  price: number
  currency: string
  cabinClass: string
  seatsAvailable: number
  aircraft: string
  baggage: {
    carry_on: string
    checked: string
  }
  amenities: string[]
  affiliateUrl: string
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: string
  tripType: 'one-way' | 'round-trip'
}

export interface FlightFilter {
  priceRange: [number, number]
  stops: number[]
  airlines: string[]
  departureTimeRange: [number, number]
}

export type FlightSortOption = 'price-asc' | 'price-desc' | 'duration-asc' | 'departure-asc'
