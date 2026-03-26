// Shows one squad member row: their avatar, name, goal, and today's check-in status.

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatGoal(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export default function MemberStatus({ member, checkIn, isLast, isMe }) {
  const initials = getInitials(member.display_name)

  let statusEl
  if (!checkIn) {
    statusEl = <span className="text-gray-600 text-xs">Waiting...</span>
  } else if (checkIn.status === 'hit') {
    statusEl = <span className="text-green-400 text-xs font-semibold">✓ Hit</span>
  } else {
    statusEl = <span className="text-red-400 text-xs font-semibold">✗ Missed</span>
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${
        !isLast ? 'border-b border-[#1f1f2e]' : ''
      }`}
    >
      {/* Avatar circle with initials */}
      <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-indigo-300">{initials}</span>
      </div>

      {/* Name + goal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white truncate">{member.display_name}</span>
          {isMe && <span className="text-indigo-400 text-xs">(you)</span>}
        </div>
        <span className="text-gray-600 text-xs">Goal: under {formatGoal(member.screen_time_goal)}</span>
      </div>

      {/* Check-in status */}
      <div className="flex-shrink-0">{statusEl}</div>
    </div>
  )
}
