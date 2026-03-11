export interface Destination {
  id: string
  name: string
  country: string
  code: string
  description: string
  startingPrice: number
  currency: string
  gradient: string
  imageUrl?: string
}

export interface Deal {
  id: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  discount: number
  type: 'flight' | 'hotel'
  destination: string
  validUntil: string
  gradient: string
}

export interface Testimonial {
  id: string
  name: string
  initials: string
  location: string
  rating: number
  review: string
  tripType: string
  date: string
}

export interface NavItem {
  label: string
  href: string
  icon?: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first'
