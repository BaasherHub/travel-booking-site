import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import PopularDestinations from '@/components/home/PopularDestinations'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import TravelDeals from '@/components/home/TravelDeals'
import Testimonials from '@/components/home/Testimonials'
import Newsletter from '@/components/home/Newsletter'

export const metadata: Metadata = {
  title: 'AlterTravel — Find Your Perfect Trip',
  description:
    'Search and compare hundreds of flights and hotels worldwide. Find the best travel deals and book with confidence.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularDestinations />
      <WhyChooseUs />
      <TravelDeals />
      <Testimonials />
      <Newsletter />
    </>
  )
}
