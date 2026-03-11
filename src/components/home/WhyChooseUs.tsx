import { Shield, Clock, Tag, HeadphonesIcon } from 'lucide-react'

const features = [
  {
    icon: Tag,
    title: 'Best Price Guarantee',
    description:
      "We compare hundreds of travel sites to find you the best prices. Found it cheaper? We'll match it.",
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description:
      'Our travel experts are available around the clock to help with any questions or booking changes.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description:
      'Book with confidence. All transactions are secured with industry-standard SSL encryption.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: HeadphonesIcon,
    title: 'Easy Booking',
    description:
      'Our streamlined booking process gets you from search to confirmation in just a few clicks.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose SkyVoyager?</h2>
          <p className="mt-3 text-lg text-gray-500">
            Millions of travelers trust us to find and book the perfect trip
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center group">
              <div
                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
