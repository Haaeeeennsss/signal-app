import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode]       = useState('signin') // 'signin' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  // After login, go back to wherever the user was trying to go (e.g. a /join link)
  const from = location.state?.from?.pathname || '/dashboard'

  function switchMode(newMode) {
    setMode(newMode)
    setError('')
    setMessage('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else if (data.session) {
        // Email confirmation is disabled in Supabase — user is immediately logged in
        navigate(from, { replace: true })
      } else {
        // Email confirmation is enabled — ask them to check their inbox
        setMessage('Account created! Check your email for a confirmation link, then come back and sign in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        navigate(from, { replace: true })
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">

      {/* Branding */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">⚡</div>
        <h1 className="text-3xl font-black tracking-tight">SIGNAL</h1>
        <p className="text-gray-500 mt-2 text-sm">Your squad vs. your phone.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[#111118] border border-[#1f1f2e] rounded-2xl p-8">

        {/* Sign In / Sign Up tabs */}
        <div className="flex mb-6 bg-[#0a0a0f] rounded-lg p-1">
          <button
            onClick={() => switchMode('signin')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              mode === 'signin'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              mode === 'signup'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-[#0a0a0f] border border-[#1f1f2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 6 characters"
              minLength={6}
              className="w-full bg-[#0a0a0f] border border-[#1f1f2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-sm text-green-400">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-sm tracking-wide mt-2"
          >
            {loading
              ? 'Loading...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'
            }
          </button>
        </form>
      </div>

      <p className="text-gray-700 text-xs mt-8">
        Fight together or wipe together.
      </p>
    </div>
  )
}
