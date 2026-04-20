// Shows one squad member row: avatar, name, goal, check-in status, and callout button.

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

export default function MemberStatus({ member, checkIn, isLast, isMe, calledOut, canCallOut, onCallOut }) {
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
      } ${calledOut ? 'bg-red-500/5' : ''}`}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-indigo-300">{initials}</span>
      </div>

      {/* Name + goal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-white truncate">{member.display_name}</span>
          {isMe && <span className="text-indigo-400 text-xs">(you)</span>}
          {calledOut && <span className="text-red-400 text-xs font-semibold">🚩 Called out</span>}
        </div>
        <span className="text-gray-600 text-xs">Goal: under {formatGoal(member.screen_time_goal)}</span>
      </div>

      {/* Status + callout button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {statusEl}
        {canCallOut && (
          <button
            onClick={() => onCallOut(member.user_id)}
            className="text-xs px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-all font-semibold"
            title="Flag this check-in as suspicious (costs squad −10 HP)"
          >
            🚩 Sus?
          </button>
        )}
      </div>
    </div>
  )
}
