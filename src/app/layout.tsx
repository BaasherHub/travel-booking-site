import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from './SessionProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SearchProvider } from '@/context/SearchContext'
import { BookingProvider } from '@/context/BookingContext'

export const metadata: Metadata = {
  title: {
    default: 'AlterTravel — Find Flights & Hotels',
    template: '%s | AlterTravel',
  },
  description:
    'AlterTravel helps you search and compare hundreds of flights and hotels worldwide. Find the best deals and book your perfect trip today.',
  keywords: ['flights', 'hotels', 'travel', 'booking', 'cheap flights', 'travel deals'],
  authors: [{ name: 'AlterTravel Team' }],
  creator: 'AlterTravel',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://altertravel.com',
    title: 'AlterTravel — Find Flights & Hotels',
    description: 'Search and compare hundreds of flights and hotels. Book the best travel deals.',
    siteName: 'AlterTravel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlterTravel — Find Flights & Hotels',
    description: 'Search and compare hundreds of flights and hotels worldwide.',
    creator: '@altertravel',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SessionProvider session={session}>
          <SearchProvider>
            <BookingProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1" id="main-content">
                  {children}
                </main>
                <Footer />
              </div>
            </BookingProvider>
          </SearchProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
