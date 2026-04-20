import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useParams, useNavigate } from 'react-router-dom'

export default function JoinSquad() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [squad, setSquad] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [goalHours, setGoalHours] = useState(2)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSquad()
  }, [code])

  const loadSquad = async () => {
    const { data, error } = await supabase
      .from('squads').select('*').eq('invite_code', code.toUpperCase()).single()
    if (error) setError('Invalid invite code')
    else setSquad(data)
    setLoading(false)
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    setJoining(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error: memberError } = await supabase.from('squad_members').insert({
        squad_id: squad.id,
        user_id: user.id,
        display_name: displayName,
        screen_time_goal: goalHours * 60
      })
      if (memberError) throw memberError
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setJoining(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  )

  if (error && !squad) return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <a href="/setup" className="text-green-500 hover:text-green-400">Go back</a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Join {squad?.name}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Set your daily screen time goal to join the squad.
        </p>
        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text" placeholder="Your display name" value={displayName}
            onChange={e => setDisplayName(e.target.value)} required
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          />
          <div>
            <label className="text-gray-400 text-sm block mb-2">
              Daily screen time goal: {goalHours}h
            </label>
            <input
              type="range" min="1" max="8" value={goalHours}
              onChange={e => setGoalHours(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={joining}
            className="w-full bg-green-500 text-black font-bold py-3 rounded-lg hover:bg-green-400 disabled:opacity-50">
            {joining ? 'Joining...' : 'Join squad'}
          </button>
        </form>
      </div>
    </div>
  )
}
