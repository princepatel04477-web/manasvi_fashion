'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/account')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-peachy"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-cocoa mb-2">Welcome Back</h1>
          <p className="text-peachy text-sm">Please sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-cocoa">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-peachy rounded-lg px-4 py-3 focus:outline-none focus:border-salmon"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-cocoa">Password</label>
              <Link href="#" className="text-sm text-salmon hover:text-cocoa transition-colors">Forgot Password?</Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-peachy rounded-lg px-4 py-3 focus:outline-none focus:border-salmon"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cocoa text-blush py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-salmon hover:text-cocoa transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-cocoa/80 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-salmon font-medium hover:text-cocoa transition-colors">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
