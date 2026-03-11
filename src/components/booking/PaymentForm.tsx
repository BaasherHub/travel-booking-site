'use client'

import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PaymentFormProps {
  onSubmit: () => void
  loading?: boolean
  amount?: number
}

export default function PaymentForm({ onSubmit, loading, amount }: PaymentFormProps) {
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16)
    return cleaned.replace(/(.{4})/g, '$1 ').trim()
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (card.number.replace(/\s/g, '').length < 16) e.number = 'Invalid card number'
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Format: MM/YY'
    if (card.cvv.length < 3) e.cvv = 'Invalid CVV'
    if (!card.name) e.name = 'Name required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit()
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Lock className="h-5 w-5 text-green-600" />
        <p className="text-sm text-gray-600">Your payment is secured with 256-bit SSL encryption</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number*
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={card.number}
              onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
              placeholder="1234 5678 9012 3456"
              className={`pl-9 ${errors.number ? 'border-red-500' : ''}`}
              maxLength={19}
            />
          </div>
          {errors.number && <p className="mt-1 text-xs text-red-500">{errors.number}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry*</label>
            <Input
              value={card.expiry}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '').slice(0, 4)
                if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2)
                setCard({ ...card, expiry: val })
              }}
              placeholder="MM/YY"
              maxLength={5}
              className={errors.expiry ? 'border-red-500' : ''}
            />
            {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
            <Input
              value={card.cvv}
              onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              placeholder="123"
              maxLength={4}
              className={errors.cvv ? 'border-red-500' : ''}
            />
            {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name*</label>
          <Input
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            placeholder="John Doe"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <Button type="submit" variant="gradient" size="xl" className="w-full mt-2" disabled={loading}>
          {loading ? 'Processing...' : `Complete Booking${amount ? ` · $${amount}` : ''}`}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-3 mt-4">
        {['VISA', 'MC', 'AMEX', 'DISC'].map((card) => (
          <span key={card} className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500 font-mono">
            {card}
          </span>
        ))}
      </div>
    </div>
  )
}
