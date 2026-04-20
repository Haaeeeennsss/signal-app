// Modal that slides up when the user clicks "Check In Today".
// Two options: hit their goal, or missed it. Honest is the only rule.

function formatGoal(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h} hour${h !== 1 ? 's' : ''}`
  return `${h}h ${m}m`
}

export default function CheckInModal({ goalMinutes, onCheckIn, onClose }) {
  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel */}
      <div className="w-full max-w-sm bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📱</div>
          <h3 className="text-xl font-black">Time to Check In</h3>
          <p className="text-gray-400 text-sm mt-1.5">
            Your goal:{' '}
            <span className="text-white font-semibold">
              under {formatGoal(goalMinutes)}
            </span>{' '}
            of screen time today
          </p>
        </div>

        <p className="text-gray-400 text-sm text-center mb-6">How'd you do?</p>

        <div className="space-y-3">
          <button
            onClick={() => onCheckIn('hit')}
            className="w-full flex items-center justify-center gap-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/60 text-green-400 font-bold py-4 rounded-xl transition-all text-base"
          >
            <span className="text-xl">✓</span>
            I Hit My Goal
          </button>

          <button
            onClick={() => onCheckIn('missed')}
            className="w-full flex items-center justify-center gap-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 text-red-400 font-bold py-4 rounded-xl transition-all text-base"
          >
            <span className="text-xl">✗</span>
            I Missed Today
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors"
        >
          Cancel
        </button>

        <div className="mt-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
          <p className="text-yellow-600 text-xs text-center leading-relaxed">
            ⚠️ Teammates can flag your check-in if they think you're lying.
            Getting called out costs the squad <strong>−10 HP</strong>.
            Not worth it.
          </p>
        </div>
      </div>
    </div>
  )
}
