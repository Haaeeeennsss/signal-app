// The squad's health bar — colour shifts from green → yellow → red as HP drops.
// The transition is animated so it visually "drains" when someone misses.
export default function HPBar({ hp }) {
  const barColor =
    hp > 60 ? 'from-green-500 to-green-400' :
    hp > 30 ? 'from-yellow-500 to-yellow-400' :
              'from-red-600 to-red-500'

  const glowColor =
    hp > 60 ? 'shadow-[0_0_14px_rgba(34,197,94,0.35)]' :
    hp > 30 ? 'shadow-[0_0_14px_rgba(234,179,8,0.35)]' :
              'shadow-[0_0_14px_rgba(239,68,68,0.35)]'

  return (
    <div className="w-full">
      {/* Track */}
      <div className="w-full h-5 bg-[#0a0a0f] border border-[#1f1f2e] rounded-full overflow-hidden">
        {/* Fill */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} ${glowColor} transition-all duration-700 ease-out`}
          style={{ width: `${hp}%` }}
        />
      </div>

      {/* Critical warning */}
      {hp <= 20 && (
        <p className="text-red-400 text-xs font-semibold text-center mt-2 animate-pulse">
          ⚠️ CRITICAL — One more miss and the squad wipes!
        </p>
      )}
    </div>
  )
}
