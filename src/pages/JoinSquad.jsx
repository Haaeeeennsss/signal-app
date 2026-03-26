import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function JoinSquad() {
  const { code }    = useParams()
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [squad, setSquad]           = useState(null)
  const [memberCount, setMemberCount] = useState(0)
  const [loadError, setLoadError]   = useState('')
  const [loading, setLoading]       = useState(true)

  // Join form
  const [displayName, setDisplayName] = useState('')
  const [goalHours, setGoalHours]     = useState('2')
  const [joining, setJoining]         = useState(false)
  const [joinError, setJoinError]     = useState('')

  const defaultName = user?.email?.split('@')[0] || ''

  useEffect(() => {
    async function lookupSquad() {
      setLoading(true)

      // If user already belongs to a squad, go straight to dashboard
      const { data: existing } = await supabase
        .from('squad_members')
        .select('squad_id')
        .eq('user_id', user.id)
        .single()

      if (existing) {
        navigate('/dashboard', { replace: true })
        return
      }

      // Look up squad by invite code
      const { data: squadData, error: squadError } = await supabase
        .from('squads')
        .select('*')
        .eq('invite_code', code)
        .single()

      if (squadError || !squadData) {
        setLoadError("We couldn't find that squad. Double-check the invite code or link.")
        setLoading(false)
        return
      }

      // Count current members
      const { count } = await supabase
        .from('squad_members')
        .select('*', { count: 'exact', head: true })
        .eq('squad_id', squadData.id)

      if (count >= 6) {
        setLoadError('This squad is already full (max 6 members). Ask your friend to create a new one.')
        setLoading(false)
        return
      }

      setSquad(squadData)
      setMemberCount(count || 0)
      setLoading(false)
    }

    lookupSquad()
  }, [code, user.id, navigate])

  async function handleJoin(e) {
    e.preventDefault()
    setJoining(true)
    setJoinError('')

    const goalMinutes = Math.round(parseFloat(goalHours) * 60)
    const name        = displayName.trim() || defaultName

    const { error } = await supabase
      .from('squad_members')
      .insert({
        squad_id:         squad.id,
        user_id:          user.id,
        display_name:     name,
        screen_time_goal: goalMinutes,
      })

    if (error) {
      setJoinError(error.message)
      setJoining(false)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔍</div>
          <p className="text-gray-500 text-sm">Finding your squad...</p>
        </div>
      </div>
    )
  }

  // ── Error (squad not found / full) ──────────────────────────────────────────
  if (loadError) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="font-bold text-lg mb-2">Couldn't join squad</h2>
          <p className="text-gray-400 text-sm mb-6">{loadError}</p>
          <button
            onClick={() => navigate('/setup')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors"
          >
            Back to Setup
          </button>
        </div>
      </div>
    )
  }

  // ── Join form ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Squad preview */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🛡️</div>
          <h2 className="text-2xl font-black">{squad?.name}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {memberCount} member{memberCount !== 1 ? 's' : ''} ·{' '}
            {squad?.hp} HP ·{' '}
            {squad?.streak} day streak
          </p>
        </div>

        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl px-5 py-4 mb-6 text-center">
          <p className="text-gray-300 text-sm">
            You've been invited to join this squad. Set your details below to get started.
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Your Name in the Squad
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={defaultName}
              maxLength={20}
              className="w-full bg-[#111118] border border-[#1f1f2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Your Daily Screen Time Goal (hours)
            </label>
            <input
              type="number"
              value={goalHours}
              onChange={(e) => setGoalHours(e.target.value)}
              required
              min="0.5"
              max="16"
              step="0.5"
              className="w-full bg-[#111118] border border-[#1f1f2e] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <p className="text-gray-600 text-xs mt-1.5">
              You aim to spend less than this on your phone per day.
            </p>
          </div>

          {joinError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {joinError}
            </div>
          )}

          <button
            type="submit"
            disabled={joining}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors text-sm tracking-wide"
          >
            {joining ? 'Joining...' : `Join ${squad?.name} ⚡`}
          </button>
        </form>
      </div>
    </div>
  )
}
