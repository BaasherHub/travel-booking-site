'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Plane, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    const result = schema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData
        if (!fieldErrors[field]) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Registration failed. Please try again.')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AlterTravel
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500">Start planning your perfect trip today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900">Account created!</h2>
              <p className="text-sm text-gray-500 mt-1">Redirecting you to sign in...</p>
            </div>
          ) : (
            <>
              {serverError && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={form.name}
                      onChange={set('name')}
                      placeholder="John Doe"
                      className={`pl-9 ${errors.name ? 'border-red-500' : ''}`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="you@example.com"
                      className={`pl-9 ${errors.email ? 'border-red-500' : ''}`}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Min. 8 characters"
                      className={`pl-9 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      placeholder="Repeat your password"
                      className={`pl-9 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
