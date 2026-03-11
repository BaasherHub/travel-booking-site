import { Flight } from './flight'
import { Hotel } from './hotel'

export interface Booking {
  id: string
  userId: string
  type: 'flight' | 'hotel'
  status: 'pending' | 'confirmed' | 'cancelled'
  details: FlightBookingDetails | HotelBookingDetails
  totalPrice: number
  currency: string
  affiliateId?: string
  commission?: number
  createdAt: string
  updatedAt: string
}

export interface FlightBookingDetails {
  flight: Flight
  passengers: Passenger[]
  departureDate: string
  returnDate?: string
  cabinClass: string
}

export interface HotelBookingDetails {
  hotel: Hotel
  roomType: string
  checkIn: string
  checkOut: string
  guests: GuestInfo[]
  rooms: number
}

export interface Passenger {
  firstName: string
  lastName: string
  dateOfBirth: string
  passportNumber?: string
  nationality: string
  email: string
  phone: string
}

export interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface BookingFormData {
  travelers: Passenger[]
  contactEmail: string
  contactPhone: string
  specialRequests?: string
  paymentMethod?: PaymentMethod
}

export interface PaymentMethod {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardholderName: string
}
