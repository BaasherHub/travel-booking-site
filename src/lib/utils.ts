import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy')
  } catch {
    return dateString
  }
}

export function formatTime(timeString: string): string {
  try {
    return format(parseISO(timeString), 'HH:mm')
  } catch {
    return timeString
  }
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function getNightCount(checkIn: string, checkOut: string): number {
  try {
    return differenceInDays(parseISO(checkOut), parseISO(checkIn))
  } catch {
    return 0
  }
}

export function getStopLabel(stops: number): string {
  if (stops === 0) return 'Nonstop'
  if (stops === 1) return '1 Stop'
  return `${stops} Stops`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateAffiliateUrl(
  type: 'flight' | 'hotel',
  params: Record<string, string>
): string {
  const marker = process.env.TRAVELPAYOUTS_MARKER || 'demo'
  if (type === 'flight') {
    const { origin, destination, date } = params
    return `https://www.aviasales.com/search/${origin}${destination}${date}1?marker=${marker}`
  }
  return `https://www.booking.com/hotel/${params.id}.html?aid=${marker}`
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
}
