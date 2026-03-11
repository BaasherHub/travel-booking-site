'use client'

import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Mail className="h-7 w-7 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">Get Exclusive Travel Deals</h2>
        <p className="mt-3 text-lg text-blue-100">
          Subscribe to our newsletter and be the first to know about flash sales, exclusive deals, and travel inspiration.
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center justify-center gap-3 text-white">
            <CheckCircle2 className="h-6 w-6 text-green-300" />
            <span className="text-lg font-medium">You&apos;re subscribed! Check your inbox soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white border-0 h-12 text-base"
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold whitespace-nowrap h-12"
            >
              {loading ? 'Subscribing...' : (
                <>
                  Subscribe <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </form>
        )}
        <p className="mt-3 text-xs text-blue-200">
          No spam ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
