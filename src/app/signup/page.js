'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error || 'Signup failed')
      }
    } catch (error) {
      console.error('Error signing up:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-black mb-4">
            Join BlogSpace
          </h2>
          <p className="text-black/60 text-lg">
            Create your account
          </p>
          <p className="mt-4 text-sm text-black/60">
            Or{' '}
            <Link href="/login" className="font-medium text-black hover:text-black/80 transition-colors underline">
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="border border-black/20 bg-black/5 text-black px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="border border-black/20 bg-black/5 text-black px-4 py-3 rounded-xl">
              Account created successfully! Redirecting to login...
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-black mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-black mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                placeholder="••••••••"
                minLength={6}
              />
              <p className="text-xs text-black/50 mt-1">Password must be at least 6 characters</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-black text-white py-4 px-4 rounded-xl hover:bg-black/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : success ? 'Account Created!' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



