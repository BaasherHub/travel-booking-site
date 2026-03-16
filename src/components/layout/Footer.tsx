import Link from 'next/link'
import { Plane, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AlterTravel</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your trusted travel partner for booking flights and hotels worldwide. Find the best
              deals and start your adventure today.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Search Flights', href: '/flights' },
                { label: 'Search Hotels', href: '/hotels' },
                { label: 'My Bookings', href: '/dashboard' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Help Center', href: '/contact' },
                { label: 'Cancellation Policy', href: '/about' },
                { label: 'Baggage Information', href: '/flights' },
                { label: 'Privacy Policy', href: '/about' },
                { label: 'Terms of Service', href: '/about' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:support@altertravel.com" className="hover:text-white transition-colors">
                  support@altertravel.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+18005551234" className="hover:text-white transition-colors">
                  +1 (800) 555-1234
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>123 Travel Street, San Francisco, CA 94105</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AlterTravel. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            We earn commission from partner bookings. Prices include all taxes and fees.
          </p>
        </div>
      </div>
    </footer>
  )
}
