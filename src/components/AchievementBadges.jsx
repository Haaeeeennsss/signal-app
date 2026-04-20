const SQUAD_BADGES = [
  {
    id: 'week_warrior',
    emoji: '📅',
    label: 'Week Warrior',
    desc: '7-day streak',
    check: (squad) => squad.streak >= 7,
  },
  {
    id: 'month_master',
    emoji: '🏆',
    label: 'Month Master',
    desc: '30-day streak',
    check: (squad) => squad.streak >= 30,
  },
  {
    id: 'full_health',
    emoji: '❤️',
    label: 'Full Health',
    desc: 'Squad at 100 HP',
    check: (squad) => squad.hp === 100,
  },
  {
    id: 'on_the_edge',
    emoji: '💀',
    label: 'On the Edge',
    desc: 'Surviving at ≤20 HP',
    check: (squad) => squad.hp <= 20 && squad.hp > 0,
  },
  {
    id: 'perfect_day',
    emoji: '⚡',
    label: 'Perfect Day',
    desc: 'Whole squad hit today',
    check: (squad, todayCheckIns, members) =>
      members.length > 0 &&
      members.every(m => todayCheckIns.some(c => c.user_id === m.user_id && c.status === 'hit')),
  },
]

const PERSONAL_BADGES = [
  {
    id: 'first_hit',
    emoji: '✅',
    label: 'First Hit',
    desc: 'Hit your goal once',
    check: (hits) => hits >= 1,
  },
  {
    id: 'ten_club',
    emoji: '💪',
    label: '10-Hit Club',
    desc: '10 goals hit',
    check: (hits) => hits >= 10,
  },
  {
    id: 'fifty_strong',
    emoji: '🎯',
    label: '50 Strong',
    desc: '50 goals hit',
    check: (hits) => hits >= 50,
  },
  {
    id: 'centurion',
    emoji: '🌟',
    label: 'Centurion',
    desc: '100 goals hit',
    check: (hits) => hits >= 100,
  },
]

export default function AchievementBadges({ squad, todayCheckIns, members, myHitCount }) {
  const earnedSquad    = SQUAD_BADGES.filter(b => b.check(squad, todayCheckIns, members))
  const earnedPersonal = PERSONAL_BADGES.filter(b => b.check(myHitCount))
  const total          = earnedSquad.length + earnedPersonal.length

  if (total === 0) return null

  return (
    <div>
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Achievements
      </h2>
      <div className="flex flex-wrap gap-2">
        {earnedSquad.map(b => (
          <div
            key={b.id}
            title={b.desc}
            className="flex items-center gap-1.5 bg-[#111118] border border-[#1f1f2e] rounded-full px-3 py-1.5"
          >
            <span className="text-sm">{b.emoji}</span>
            <span className="text-xs font-semibold text-gray-300">{b.label}</span>
          </div>
        ))}
        {earnedPersonal.map(b => (
          <div
            key={b.id}
            title={b.desc}
            className="flex items-center gap-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-3 py-1.5"
          >
            <span className="text-sm">{b.emoji}</span>
            <span className="text-xs font-semibold text-indigo-300">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
