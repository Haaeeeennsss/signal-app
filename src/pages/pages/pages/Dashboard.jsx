import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import HPBar from '../components/HPBar'
import MemberStatus from '../components/MemberStatus'
import CheckInModal from '../components/CheckInModal'
import SquadCard from '../components/SquadCard'

export default function Dashboard() {
  const [squad, setSquad] = useState(null)
  const [members, setMembers] = useState([])
  const [checkins, setCheckins] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [loading, setLoading] = useState(true)

  const today = new Date().toLocaleDateString('en-CA')

  useEffect(() => {
    loadData()
    const channel = supabase.channel('squad-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'squads' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'check_ins' }, loadData)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    const { data: member } = await supabase
      .from('squad_members').select('*, squads(*)').eq('user_id', user.id).single()
    if (!member) { setLoading(false); return }
    setSquad(member.squads)
    const { data: allMembers } = await supabase
      .from('squad_members').select('*').eq('squad_id', member.squads.id)
    setMembers(allMembers || [])
    const { data: todayCheckins } = await supabase
      .from('check_ins').select('*').eq('squad_id', member.squads.id).eq('check_in_date', today)
    setCheckins(todayCheckins || [])
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  )

  if (!squad) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">No squad found. <a href="/setup" className="text-green-500">Join one</a></p>
    </div>
  )

  const myCheckin = checkins.find(c => c.user_id === currentUser?.id)
  const checkedInCount = checkins.length
  const totalMembers = members.length

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{squad.name}</h1>
        <button onClick={handleSignOut} className="text-gray-400 text-sm hover:text-white">Sign out</button>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-green-400">
          {squad.streak > 0 ? `🔥 Day ${squad.streak}` : 'Day 0'}
        </div>
        <p className="text-gray-400 mt-1">squad streak</p>
      </div>

      <HPBar hp={squad.hp} checkedIn={checkedInCount} total={totalMembers} />

      <div className="mt-6">
        <h3 className="text-gray-400 text-sm mb-3">Squad members</h3>
        {members.map(member => (
          <MemberStatus
            key={member.id}
            member={member}
            checkin={checkins.find(c => c.user_id === member.user_id)}
            isCurrentUser={member.user_id === currentUser?.id}
          />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {!myCheckin ? (
          <button onClick={() => setShowCheckIn(true)}
            className="w-full bg-green-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-green-400">
            Check in today
          </button>
        ) : (
          <div className={`w-full py-4 rounded-xl text-center font-bold text-lg ${myCheckin.status === 'hit' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
            {myCheckin.status === 'hit' ? 'You hit your goal today' : 'You missed today'}
          </div>
        )}
        <button onClick={() => setShowCard(true)}
          className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700">
          Share squad card
        </button>
      </div>

      {showCheckIn && (
        <CheckInModal
          squad={squad}
          currentUser={currentUser}
          members={members}
          checkins={checkins}
          today={today}
          onClose={() => { setShowCheckIn(false); loadData() }}
        />
      )}
      {showCard && <SquadCard squad={squad} members={members} onClose={() => setShowCard(false)} />}
    </div>
  )
}
