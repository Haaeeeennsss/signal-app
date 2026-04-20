import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import HPBar        from '../components/HPBar'
import MemberStatus from '../components/MemberStatus'
import SquadCard    from '../components/SquadCard'
import CheckInModal from '../components/CheckInModal'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [squad, setSquad]               = useState(null)
  const [members, setMembers]           = useState([])
  const [todayCheckIns, setTodayCheckIns] = useState([])
  const [todayCallouts, setTodayCallouts] = useState([])
  const [loading, setLoading]           = useState(true)
  const [showCheckIn, setShowCheckIn]   = useState(false)
  const [wipedMessage, setWipedMessage] = useState(false)

  // Today's date in YYYY-MM-DD (local timezone, not UTC — avoids midnight edge cases)
  const today = new Date().toLocaleDateString('en-CA')

  const myMember  = members.find(m => m.user_id === user?.id)
  const myCheckIn = todayCheckIns.find(c => c.user_id === user?.id)
  const alreadyCheckedIn = !!myCheckIn

  // ── Fetch all data ───────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!user) return

    // Find which squad this user belongs to
    const { data: memberRow, error } = await supabase
      .from('squad_members')
      .select('squad_id, squads(*)')
      .eq('user_id', user.id)
      .single()

    if (error || !memberRow) {
      // No squad yet — send them to setup
      navigate('/setup', { replace: true })
      return
    }

    setSquad(memberRow.squads)

    // All members of this squad
    const { data: membersData } = await supabase
      .from('squad_members')
      .select('*')
      .eq('squad_id', memberRow.squad_id)
      .order('joined_at')

    setMembers(membersData || [])

    // Today's check-ins for this squad
    const { data: checkIns } = await supabase
      .from('check_ins')
      .select('*')
      .eq('squad_id', memberRow.squad_id)
      .eq('check_in_date', today)

    setTodayCheckIns(checkIns || [])

    // Today's callouts for this squad
    const { data: callouts } = await supabase
      .from('callouts')
      .select('*')
      .eq('squad_id', memberRow.squad_id)
      .eq('check_in_date', today)

    setTodayCallouts(callouts || [])
    setLoading(false)
  }, [user, navigate, today])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Real-time: watch for HP changes & new check-ins ─────────────────────────
  useEffect(() => {
    if (!squad) return

    const channel = supabase
      .channel(`squad-${squad.id}`)
      // When HP / streak updates on the squad row
      .on('postgres_changes', {
        event:  'UPDATE',
        schema: 'public',
        table:  'squads',
        filter: `id=eq.${squad.id}`,
      }, (payload) => {
        setSquad(payload.new)
      })
      // When a teammate submits their check-in
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'check_ins',
        filter: `squad_id=eq.${squad.id}`,
      }, (payload) => {
        if (payload.new.check_in_date === today) {
          setTodayCheckIns(prev => {
            if (prev.some(c => c.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        }
      })
      // When someone issues a callout
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'callouts',
        filter: `squad_id=eq.${squad.id}`,
      }, (payload) => {
        if (payload.new.check_in_date === today) {
          setTodayCallouts(prev => {
            if (prev.some(c => c.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [squad?.id, today])

  // ── Check-in handler ─────────────────────────────────────────────────────────
  async function handleCheckIn(status) {
    if (!squad || !user) return

    // 1. Record the check-in
    const { error: checkInError } = await supabase
      .from('check_ins')
      .insert({
        squad_id:       squad.id,
        user_id:        user.id,
        check_in_date:  today,
        status,
      })

    if (checkInError) {
      console.error('Check-in failed:', checkInError.message)
      setShowCheckIn(false)
      return
    }

    // 2. Calculate new HP
    //    Hit  → +10 HP (capped at 100)
    //    Miss → -20 HP (minimum 0, then wipe triggers)
    const hpChange = status === 'hit' ? 10 : -20
    let newHp      = Math.min(100, Math.max(0, squad.hp + hpChange))

    // 3. Calculate new streak
    let newStreak         = squad.streak
    let newLastStreakDate  = squad.last_streak_date
    let wiped             = false
    const yesterday       = new Date(Date.now() - 86_400_000).toLocaleDateString('en-CA')

    if (newHp <= 0) {
      // Squad wiped! Reset HP to 50 as a "respawn" and clear the streak
      newHp             = 50
      newStreak         = 0
      newLastStreakDate  = null
      wiped             = true
    } else if (status === 'hit') {
      // A "hit" extends the streak — but only once per day per squad
      if (!squad.last_streak_date || squad.last_streak_date < yesterday) {
        // First hit in a new streak (or after a gap)
        newStreak        = 1
        newLastStreakDate = today
      } else if (squad.last_streak_date === yesterday) {
        // Consecutive day hit
        newStreak        = squad.streak + 1
        newLastStreakDate = today
      }
      // If last_streak_date === today, streak already updated today — no change
    }

    // 4. Save to database (real-time subscription will push this to teammates)
    await supabase
      .from('squads')
      .update({ hp: newHp, streak: newStreak, last_streak_date: newLastStreakDate })
      .eq('id', squad.id)

    setShowCheckIn(false)

    if (wiped) {
      setWipedMessage(true)
      setTimeout(() => setWipedMessage(false), 6000)
    }
  }

  async function handleCallOut(targetUserId) {
    if (!squad || !user) return

    const { error } = await supabase
      .from('callouts')
      .insert({
        squad_id:       squad.id,
        caller_id:      user.id,
        target_user_id: targetUserId,
        check_in_date:  today,
      })

    if (error) {
      console.error('Callout failed:', error.message)
      return
    }

    // Calling someone out costs the squad -10 HP regardless of guilt
    const newHp = Math.max(0, squad.hp - 10)
    await supabase
      .from('squads')
      .update({ hp: newHp })
      .eq('id', squad.id)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/auth', { replace: true })
  }

  const inviteUrl = squad ? `${window.location.origin}/join/${squad.invite_code}` : ''

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">⚡</div>
          <p className="text-gray-600 text-sm">Loading your squad...</p>
        </div>
      </div>
    )
  }

  if (!squad) return null

  const hpTextColor =
    squad.hp > 60 ? 'text-green-400' :
    squad.hp > 30 ? 'text-yellow-400' :
                    'text-red-400'

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Wipe banner */}
      {wipedMessage && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-3 px-4 font-bold text-sm">
          💀 SQUAD WIPED — Streak gone. HP reset to 50. Bounce back.
        </div>
      )}

      {/* Top nav */}
      <nav className="border-b border-[#1f1f2e] px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-black text-lg tracking-tight">SIGNAL</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-xs hidden sm:block truncate max-w-[160px]">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-white text-xs border border-[#1f1f2e] hover:border-gray-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* Squad name + invite button */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black leading-tight">{squad.name}</h1>
            <p className="text-gray-600 text-sm mt-0.5">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
          </div>
          <SquadCard
            squad={squad}
            members={members}
            inviteUrl={inviteUrl}
            inviteCode={squad.invite_code}
            compact
          />
        </div>

        {/* HP card */}
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Squad HP
            </span>
            <span className={`text-3xl font-black tabular-nums ${hpTextColor}`}>
              {squad.hp}
              <span className="text-sm text-gray-600 font-normal"> / 100</span>
            </span>
          </div>
          <HPBar hp={squad.hp} />
          <div className="mt-4 flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-white tabular-nums">{squad.streak}</span>
            <span className="text-gray-500 text-sm">
              day{squad.streak !== 1 ? 's' : ''} streak
            </span>
          </div>
        </div>

        {/* Check-in button or status */}
        {!alreadyCheckedIn ? (
          <button
            onClick={() => setShowCheckIn(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all text-base tracking-wide"
          >
            ⚡ Check In Today
          </button>
        ) : (
          <div
            className={`w-full text-center py-4 rounded-xl text-sm font-semibold border ${
              myCheckIn?.status === 'hit'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10  border-red-500/20  text-red-400'
            }`}
          >
            {myCheckIn?.status === 'hit'
              ? '✓ You hit your goal today — nice work.'
              : "✗ You missed today. Get 'em tomorrow."}
          </div>
        )}

        {/* Member status list */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Squad Status — Today
          </h2>
          <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl overflow-hidden">
            {members.map((member, i) => {
              const checkIn       = todayCheckIns.find(c => c.user_id === member.user_id)
              const isMe          = member.user_id === user?.id
              const calledOut     = todayCallouts.some(c => c.target_user_id === member.user_id)
              const iAlreadyCalled = todayCallouts.some(c => c.caller_id === user?.id)
              const canCallOut    = !isMe && checkIn?.status === 'hit' && !calledOut && !iAlreadyCalled
              return (
                <MemberStatus
                  key={member.id}
                  member={member}
                  checkIn={checkIn}
                  isLast={i === members.length - 1}
                  isMe={isMe}
                  calledOut={calledOut}
                  canCallOut={canCallOut}
                  onCallOut={handleCallOut}
                />
              )
            })}
          </div>
        </div>

        {/* Invite / shareable squad card */}
        <SquadCard
          squad={squad}
          members={members}
          inviteUrl={inviteUrl}
          inviteCode={squad.invite_code}
        />

        <div className="h-8" />
      </div>

      {/* Check-in modal overlay */}
      {showCheckIn && (
        <CheckInModal
          goalMinutes={myMember?.screen_time_goal ?? 120}
          onCheckIn={handleCheckIn}
          onClose={() => setShowCheckIn(false)}
        />
      )}
    </div>
  )
}
