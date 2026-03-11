export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SkyVoyager'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const CABIN_CLASSES = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium-economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
]

export const POPULAR_AIRPORTS = [
  { code: 'JFK', city: 'New York', country: 'US' },
  { code: 'LAX', city: 'Los Angeles', country: 'US' },
  { code: 'LHR', city: 'London', country: 'GB' },
  { code: 'CDG', city: 'Paris', country: 'FR' },
  { code: 'DXB', city: 'Dubai', country: 'AE' },
  { code: 'SIN', city: 'Singapore', country: 'SG' },
  { code: 'NRT', city: 'Tokyo', country: 'JP' },
  { code: 'SYD', city: 'Sydney', country: 'AU' },
  { code: 'ORD', city: 'Chicago', country: 'US' },
  { code: 'AMS', city: 'Amsterdam', country: 'NL' },
  { code: 'FRA', city: 'Frankfurt', country: 'DE' },
  { code: 'HKG', city: 'Hong Kong', country: 'HK' },
  { code: 'BKK', city: 'Bangkok', country: 'TH' },
  { code: 'MAD', city: 'Madrid', country: 'ES' },
  { code: 'FCO', city: 'Rome', country: 'IT' },
  { code: 'BCN', city: 'Barcelona', country: 'ES' },
  { code: 'MIA', city: 'Miami', country: 'US' },
  { code: 'SFO', city: 'San Francisco', country: 'US' },
  { code: 'ICN', city: 'Seoul', country: 'KR' },
  { code: 'DEL', city: 'Delhi', country: 'IN' },
]

export const HOTEL_AMENITIES = [
  'WiFi',
  'Pool',
  'Parking',
  'Gym',
  'Restaurant',
  'Spa',
  'Bar',
  'Concierge',
  'Room Service',
  'Business Center',
  'Airport Shuttle',
  'Pet Friendly',
]

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const

export const MAX_PASSENGERS = 9
export const MAX_ROOMS = 10
export const MAX_GUESTS_PER_ROOM = 4

export const PRICE_RANGES = {
  FLIGHT: { min: 50, max: 5000 },
  HOTEL: { min: 20, max: 1000 },
}
