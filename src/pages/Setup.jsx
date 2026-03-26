import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Generates a random 8-character invite code like "A1B2C3D4"
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export default function Setup() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Which sub-screen: 'choice' | 'create' | 'join'
  const [view, setView] = useState('choice')

  // Create squad form
  const [squadName, setSquadName]   = useState('')
  const [displayName, setDisplayName] = useState('')
  const [goalHours, setGoalHours]   = useState('2')
  const [creating, setCreating]     = useState(false)

  // Join squad form
  const [joinCode, setJoinCode] = useState('')
  const [joining, setJoining]   = useState(false)

  const [error, setError] = useState('')

  // Default to the part of their email before the @ sign
  const defaultName = user?.email?.split('@')[0] || ''

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    setError('')

    const inviteCode    = generateInviteCode()
    const goalMinutes   = Math.round(parseFloat(goalHours) * 60)
    const name          = displayName.trim() || defaultName

    // Step 1: create the squad row
    const { data: squad, error: squadError } = await supabase
      .from('squads')
      .insert({ name: squadName.trim(), invite_code: inviteCode })
      .select()
      .single()

    if (squadError) {
      setError(squadError.message)
      setCreating(false)
      return
    }

    // Step 2: add the creator as a member
    const { error: memberError } = await supabase
      .from('squad_members')
      .insert({
        squad_id:         squad.id,
        user_id:          user.id,
        display_name:     name,
        screen_time_goal: goalMinutes,
      })

    if (memberError) {
      setError(memberError.message)
      setCreating(false)
      return
    }

    navigate('/dashboard')
  }

  function handleJoin(e) {
    e.preventDefault()
    if (!joinCode.trim()) return
    setJoining(true)
    navigate(`/join/${joinCode.trim().toUpperCase()}`)
  }

  // ── CREATE SQUAD SCREEN ──────────────────────────────────────────────────────
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <button
            onClick={() => { setView('choice'); setError('') }}
            className="text-gray-500 hover:text-white text-sm mb-8 flex items-center gap-1.5 transition-colors"
          >
            ← Back
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-black">Create Your Squad</h2>
            <p className="text-gray-500 text-sm mt-1">
              You'll get an invite link to share with 2–5 friends.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Squad Name
              </label>
              <input
                type="text"
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                required
                placeholder="e.g. The Grind Squad"
                maxLength={30}
                className="w-full bg-[#111118] border border-[#1f1f2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

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
              <p className="text-gray-600 text-xs mt-1.5">
                Leave blank to use "{defaultName}"
              </p>
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
                You want to spend less than this on your phone each day.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={creating || !squadName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-sm tracking-wide"
            >
              {creating ? 'Creating...' : 'Create Squad ⚡'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── JOIN SQUAD SCREEN ────────────────────────────────────────────────────────
  if (view === 'join') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <button
            onClick={() => { setView('choice'); setError('') }}
            className="text-gray-500 hover:text-white text-sm mb-8 flex items-center gap-1.5 transition-colors"
          >
            ← Back
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-black">Join a Squad</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter the invite code your friend shared with you.
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Invite Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                required
                placeholder="e.g. A1B2C3D4"
                maxLength={8}
                className="w-full bg-[#111118] border border-[#1f1f2e] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono tracking-widest text-center text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={joining || joinCode.length < 6}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-sm tracking-wide"
            >
              {joining ? 'Finding squad...' : 'Find Squad →'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── CHOICE SCREEN (default) ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">⚡</div>
        <h1 className="text-3xl font-black">SIGNAL</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Hey {defaultName}. Let's get you into a squad.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => setView('create')}
          className="w-full bg-[#111118] hover:bg-[#1a1a26] border border-[#1f1f2e] hover:border-indigo-500/40 rounded-2xl p-6 text-left transition-all"
        >
          <div className="text-2xl mb-2">🛡️</div>
          <div className="font-bold text-white text-lg">Create a Squad</div>
          <div className="text-gray-500 text-sm mt-1">
            Start a new squad and invite your friends via link.
          </div>
        </button>

        <button
          onClick={() => setView('join')}
          className="w-full bg-[#111118] hover:bg-[#1a1a26] border border-[#1f1f2e] hover:border-indigo-500/40 rounded-2xl p-6 text-left transition-all"
        >
          <div className="text-2xl mb-2">🔗</div>
          <div className="font-bold text-white text-lg">Join a Squad</div>
          <div className="text-gray-500 text-sm mt-1">
            Have an invite code? Enter it here to join your friends.
          </div>
        </button>
      </div>

      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-10 text-gray-600 hover:text-gray-400 text-sm transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
