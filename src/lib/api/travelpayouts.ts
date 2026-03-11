import { Flight, FlightSearchParams } from '@/types/flight'
import { MOCK_FLIGHTS } from '../mock-data'

interface TravelpayoutsResponse {
  data: Array<{
    origin: string
    destination: string
    price: number
    airline: string
    flight_number: string
    departure_at: string
    return_at?: string
    duration: number
    transfers: number
  }>
}

const cache = new Map<string, { data: Flight[]; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000

/**
 * Search flights using the Travelpayouts API with mock data fallback.
 */
export async function searchFlightsTravelpayouts(
  params: FlightSearchParams
): Promise<Flight[]> {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  const marker = process.env.TRAVELPAYOUTS_MARKER || 'demo'

  if (!token) {
    return filterMockFlights(params)
  }

  const cacheKey = JSON.stringify(params)
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  try {
    const url = new URL('https://api.travelpayouts.com/aviasales/v3/prices_for_dates')
    url.searchParams.set('origin', params.origin)
    url.searchParams.set('destination', params.destination)
    url.searchParams.set('departure_at', params.departureDate)
    if (params.returnDate) {
      url.searchParams.set('return_at', params.returnDate)
    }
    url.searchParams.set('currency', 'USD')
    url.searchParams.set('token', token)
    url.searchParams.set('limit', '20')

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return filterMockFlights(params)
    }

    const json = (await response.json()) as TravelpayoutsResponse
    const flights = json.data.map((item, index) =>
      mapTravelpayoutsToFlight(item, index, marker)
    )

    cache.set(cacheKey, { data: flights, timestamp: Date.now() })
    return flights
  } catch {
    return filterMockFlights(params)
  }
}

function mapTravelpayoutsToFlight(
  item: TravelpayoutsResponse['data'][0],
  index: number,
  marker: string
): Flight {
  const date = item.departure_at.split('T')[0].replace(/-/g, '')
  return {
    id: `tp-${index}-${item.flight_number}`,
    airline: item.airline,
    airlineCode: item.airline,
    flightNumber: item.flight_number,
    origin: item.origin,
    originCity: item.origin,
    destination: item.destination,
    destinationCity: item.destination,
    departureTime: item.departure_at,
    arrivalTime: item.departure_at,
    duration: `${Math.floor(item.duration / 60)}h ${item.duration % 60}m`,
    durationMinutes: item.duration,
    stops: item.transfers,
    price: item.price,
    currency: 'USD',
    cabinClass: 'economy',
    seatsAvailable: 10,
    aircraft: 'Commercial Aircraft',
    baggage: { carry_on: '10 kg', checked: '23 kg' },
    amenities: [],
    affiliateUrl: `https://www.aviasales.com/search/${item.origin}${item.destination}${date}1?marker=${marker}`,
  }
}

function filterMockFlights(params: FlightSearchParams): Flight[] {
  return MOCK_FLIGHTS.filter((flight) => {
    const originMatch =
      flight.origin.toLowerCase() === params.origin.toLowerCase() ||
      flight.originCity.toLowerCase().includes(params.origin.toLowerCase())
    const destMatch =
      flight.destination.toLowerCase() === params.destination.toLowerCase() ||
      flight.destinationCity.toLowerCase().includes(params.destination.toLowerCase())
    return originMatch || destMatch
  }).length > 0
    ? MOCK_FLIGHTS.filter((flight) => {
        const originMatch =
          flight.origin.toLowerCase() === params.origin.toLowerCase() ||
          flight.originCity.toLowerCase().includes(params.origin.toLowerCase())
        const destMatch =
          flight.destination.toLowerCase() === params.destination.toLowerCase() ||
          flight.destinationCity.toLowerCase().includes(params.destination.toLowerCase())
        return originMatch || destMatch
      })
    : MOCK_FLIGHTS
}
