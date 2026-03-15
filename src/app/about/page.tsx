import type { Metadata } from 'next'
import { Plane, Users, Globe, Award, Heart, Zap, Shield, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about SkyVoyager — our mission to make travel accessible and enjoyable for everyone.',
}

const stats = [
  { label: 'Airlines', value: '500+', icon: Plane },
  { label: 'Hotels', value: '200K+', icon: Globe },
  { label: 'Happy Travelers', value: '100K+', icon: Users },
  { label: 'Countries', value: '150+', icon: Award },
]

const team = [
  {
    name: 'Sarah Mitchell',
    role: 'CEO & Co-Founder',
    bio: 'Former travel consultant with 15 years of experience building travel tech products.',
    initials: 'SM',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'James Chen',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer passionate about building scalable platforms that delight users.',
    initials: 'JC',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    name: 'Priya Patel',
    role: 'Head of Product',
    bio: 'Product strategist who has led teams at Booking.com and Airbnb.',
    initials: 'PP',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Marcus Williams',
    role: 'Head of Design',
    bio: 'Award-winning UX designer focused on crafting intuitive travel experiences.',
    initials: 'MW',
    gradient: 'from-green-400 to-teal-500',
  },
]

const values = [
  {
    icon: Heart,
    title: 'Traveler First',
    description:
      'Every decision we make starts with the traveler. We relentlessly optimize for the best booking experience possible.',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description:
      'No hidden fees, no surprises. We show you real prices and clearly disclose how we earn our commission.',
  },
  {
    icon: Zap,
    title: 'Speed & Simplicity',
    description:
      'Find and book flights or hotels in under 2 minutes. We cut complexity so you can focus on the adventure.',
  },
  {
    icon: Star,
    title: 'Quality Curation',
    description:
      'We partner only with reputable airlines and hotels, ensuring every booking meets our quality standards.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About SkyVoyager
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We believe every journey should start with a great booking experience. Since 2020,
            we&apos;ve been helping travelers find their perfect flights and hotels worldwide.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                SkyVoyager was born from frustration. Our founders, avid travelers themselves,
                were tired of jumping between dozens of travel sites to compare prices, only to be
                ambushed by hidden fees at checkout.
              </p>
              <p>
                In 2020, we set out to build a travel booking platform that actually puts travelers
                first — transparent pricing, a clean interface, and access to hundreds of airlines
                and hotels in one place.
              </p>
              <p>
                Today, SkyVoyager helps over 100,000 travelers every month find and book their
                perfect trips. We&apos;re proud to be the travel companion people trust for their
                adventures, from weekend city breaks to round-the-world journeys.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { year: '2020', event: 'Founded in San Francisco' },
              { year: '2021', event: 'Launched flight search with 100+ airlines' },
              { year: '2022', event: 'Added hotel search — 50K+ properties' },
              { year: '2023', event: 'Reached 100K happy travelers' },
            ].map(({ year, event }) => (
              <div key={year} className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                <div className="text-2xl font-bold text-blue-600">{year}</div>
                <div className="text-sm text-gray-600 mt-1">{event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What We Stand For</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our values guide every product decision and customer interaction.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mb-4">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet the Team</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We&apos;re a small, passionate team of travel lovers and tech builders.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(({ name, role, bio, initials, gradient }) => (
            <div key={name} className="text-center">
              <div
                className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4`}
              >
                <span className="text-2xl font-bold text-white">{initials}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-blue-600 mb-2">{role}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
