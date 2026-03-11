import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  label?: string
}

export default function PriceDisplay({
  amount,
  currency = 'USD',
  size = 'md',
  className,
  label,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {label && <span className="text-xs text-gray-500 mb-0.5">{label}</span>}
      <span className={cn('font-bold text-gray-900', sizeClasses[size])}>
        {formatPrice(amount, currency)}
      </span>
    </div>
  )
}
