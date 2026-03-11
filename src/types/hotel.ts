export interface Hotel {
  id: string
  name: string
  description: string
  location: string
  city: string
  country: string
  address: string
  stars: number
  rating: number
  reviewCount: number
  pricePerNight: number
  currency: string
  amenities: string[]
  images: string[]
  roomTypes: RoomType[]
  coordinates: {
    lat: number
    lng: number
  }
  affiliateUrl: string
  checkIn: string
  checkOut: string
  policies: {
    cancellation: string
    breakfast: string
    pets: string
  }
}

export interface RoomType {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  bedType: string
  amenities: string[]
}

export interface HotelSearchParams {
  city: string
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
}

export interface HotelFilter {
  priceRange: [number, number]
  stars: number[]
  amenities: string[]
  ratingMin: number
}

export type HotelSortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc'
