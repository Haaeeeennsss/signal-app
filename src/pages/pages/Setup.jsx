import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Setup() {
  const [mode, setMode] = useState(null)
  const [squadName, setSquadName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [goalHours, setGoalHours] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const createSquad = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      const { data: squad, error: squadError } = await supabase
        .from('squads').insert({ name: squadName, invite_code: code }).select().single()
      if (squadError) throw squadError
      const { error: memberError } = await supabase.from('squad_members').insert({
        squad_id: squad.id, user_id: user.id,
        display_name: displayName, screen_time_goal: goalHours * 60
      })
      if (memberError) throw memberError
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const joinSquad = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: squad, error: squadError } = await supabase
        .from('squads').select().eq('invite_code', inviteCode.toUpperCase()).single()
      if (squadError) throw new Error('Invalid invite code')
      const { error: memberError } = await supabase.from('squad_members').insert({
        squad_id: squad.id, user_id: user.id,
        display_name: displayName, screen_time_goal: goalHours * 60
      })
      if (memberError) throw memberError
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Join a squad</h2>
        <p className="text-gray-400 text-center mb-8">You can't do this alone.</p>
        {!mode ? (
          <div className="space-y-3">
            <button onClick={() => setMode('create')}
              className="w-full bg-green-500 text-black font-bold py-3 rounded-lg hover:bg-green-400">
              Create a squad
            </button>
            <button onClick={() => setMode('join')}
              className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700">
              Join with invite code
            </button>
          </div>
        ) : (
          <form onSubmit={mode === 'create' ? createSquad : joinSquad} className="space-y-4">
            <input type="text" placeholder="Your display name" value={displayName}
              onChange={e => setDisplayName(e.target.value)} required
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
            />
            {mode === 'create' ? (
              <input type="text" placeholder="Squad name" value={squadName}
                onChange={e => setSquadName(e.target.value)} required
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
              />
            ) : (
              <input type="text" placeholder="Invite code" value={inviteCode}
                onChange={e => setInviteCode(e.target.value)} required
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
              />
            )}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Daily screen time goal: {goalHours}h</label>
              <input type="range" min="1" max="8" value={goalHours}
                onChange={e => setGoalHours(Number(e.target.value))}
                className="w-full"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-green-500 text-black font-bold py-3 rounded-lg hover:bg-green-400 disabled:opacity-50">
              {loading ? 'Loading...' : mode === 'create' ? 'Create squad' : 'Join squad'}
            </button>
            <button type="button" onClick={() => setMode(null)}
              className="w-full text-gray-400 text-sm hover:text-white">
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
