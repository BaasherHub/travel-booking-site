'use client'

import { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How do I cancel or change a booking?',
    answer:
      'Cancellations and changes depend on the fare rules of your ticket. Visit your Dashboard to view booking details and cancellation options. For tickets with free cancellation, you can cancel directly from your account. For other tickets, contact the airline or hotel directly.',
  },
  {
    question: 'Are there hidden fees on SkyVoyager?',
    answer:
      'No hidden fees — ever. The price you see is the price you pay. We earn a small affiliate commission from airlines and hotels when you complete a booking, but this never affects the price you see.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Yes. All payments are processed through PCI-compliant payment gateways with 256-bit SSL encryption. We never store your full card details on our servers.',
  },
  {
    question: 'How far in advance can I book flights?',
    answer:
      'Most airlines allow bookings up to 11 months in advance. The best prices are typically found 6–8 weeks before departure for domestic flights and 3–5 months ahead for international.',
  },
  {
    question: 'Do you offer travel insurance?',
    answer:
      'We currently don\'t sell travel insurance directly, but we strongly recommend purchasing it. Many credit cards also offer complimentary travel protection — check your card benefits.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => { const { [field]: _, ...rest } = prev; return rest })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-blue-100 text-lg">
            We&apos;d love to hear from you. Send us a message and we&apos;ll get back within 24 hours.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Send a Message
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-gray-500 max-w-sm">
                    Thanks for reaching out. Our team will respond to <strong>{form.email}</strong>{' '}
                    within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSubmitted(false)
                      setForm({ name: '', email: '', subject: '', message: '' })
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <Input
                        value={form.name}
                        onChange={set('name')}
                        placeholder="John Doe"
                        className={cn(errors.name && 'border-red-500')}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="you@example.com"
                        className={cn(errors.email && 'border-red-500')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      value={form.subject}
                      onChange={set('subject')}
                      className={cn(
                        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                        errors.subject && 'border-red-500'
                      )}
                    >
                      <option value="">Select a subject...</option>
                      <option value="booking">Booking issue</option>
                      <option value="cancellation">Cancellation / Refund</option>
                      <option value="payment">Payment question</option>
                      <option value="technical">Technical problem</option>
                      <option value="partnership">Partnership inquiry</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={set('message')}
                      rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className={cn(
                        'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none',
                        errors.message && 'border-red-500'
                      )}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Contact info sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-5">Get in Touch</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 flex-shrink-0">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <a
                      href="mailto:support@skyvoyager.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@skyvoyager.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 flex-shrink-0">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <a href="tel:+18005551234" className="text-blue-600 hover:underline">
                      +1 (800) 555-1234
                    </a>
                    <p className="text-gray-400 text-xs mt-0.5">Mon–Fri, 9 AM–6 PM EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 flex-shrink-0">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Office</p>
                    <p className="text-gray-500">
                      123 Travel Street
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 flex-shrink-0">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Response Time</p>
                    <p className="text-gray-500">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500">Quick answers to common questions.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
