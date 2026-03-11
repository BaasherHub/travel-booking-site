import { Flight, FlightSearchParams } from '@/types/flight'
import { MOCK_FLIGHTS } from '../mock-data'

interface AmadeusToken {
  access_token: string
  expires_in: number
  expiresAt: number
}

let cachedToken: AmadeusToken | null = null

/**
 * Fetch an OAuth2 token from Amadeus with auto-refresh logic.
 */
async function getAmadeusToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.access_token
  }

  const apiKey = process.env.AMADEUS_API_KEY
  const apiSecret = process.env.AMADEUS_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('Amadeus API credentials not configured')
  }

  const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get Amadeus token')
  }

  const data = (await response.json()) as AmadeusToken
  cachedToken = {
    ...data,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.access_token
}

/**
 * Search flights via the Amadeus Flight Offers API with retry logic and mock fallback.
 */
export async function searchFlightsAmadeus(
  params: FlightSearchParams,
  retries = 3
): Promise<Flight[]> {
  const apiKey = process.env.AMADEUS_API_KEY
  if (!apiKey) {
    return MOCK_FLIGHTS
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const token = await getAmadeusToken()

      const url = new URL('https://api.amadeus.com/v2/shopping/flight-offers')
      url.searchParams.set('originLocationCode', params.origin)
      url.searchParams.set('destinationLocationCode', params.destination)
      url.searchParams.set('departureDate', params.departureDate)
      url.searchParams.set('adults', params.passengers.toString())
      url.searchParams.set('travelClass', params.cabinClass.toUpperCase())
      url.searchParams.set('max', '20')

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
      })

      if (!response.ok) {
        throw new Error(`Amadeus API error: ${response.status}`)
      }

      const json = await response.json()
      return mapAmadeusFlights(json.data || [])
    } catch (error) {
      lastError = error as Error
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  console.error('Amadeus API failed after retries:', lastError?.message)
  return MOCK_FLIGHTS
}

function mapAmadeusFlights(offers: Array<Record<string, unknown>>): Flight[] {
  return offers.map((offer, index) => {
    const itinerary = (offer.itineraries as Array<Record<string, unknown>>)?.[0]
    const segment = (itinerary?.segments as Array<Record<string, unknown>>)?.[0]
    const price = offer.price as Record<string, unknown>

    return {
      id: `am-${index}-${offer.id}`,
      airline: String(segment?.carrierCode || 'Unknown'),
      airlineCode: String(segment?.carrierCode || 'XX'),
      flightNumber: `${segment?.carrierCode} ${segment?.number}`,
      origin: String((segment?.departure as Record<string, unknown>)?.iataCode || ''),
      originCity: String((segment?.departure as Record<string, unknown>)?.iataCode || ''),
      destination: String((segment?.arrival as Record<string, unknown>)?.iataCode || ''),
      destinationCity: String((segment?.arrival as Record<string, unknown>)?.iataCode || ''),
      departureTime: String((segment?.departure as Record<string, unknown>)?.at || ''),
      arrivalTime: String((segment?.arrival as Record<string, unknown>)?.at || ''),
      duration: String(itinerary?.duration || ''),
      durationMinutes: 0,
      stops: ((itinerary?.segments as unknown[])?.length || 1) - 1,
      price: Number(price?.grandTotal || 0),
      currency: String(price?.currency || 'USD'),
      cabinClass: 'economy',
      seatsAvailable: Number((offer.numberOfBookableSeats as number) || 10),
      aircraft: 'Commercial Aircraft',
      baggage: { carry_on: '10 kg', checked: '23 kg' },
      amenities: [],
      affiliateUrl: `https://www.amadeus.com/`,
    }
  })
}
