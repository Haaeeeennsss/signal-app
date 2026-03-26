import { useState } from 'react'

// Used in two ways:
//   compact={true}  → just the "Invite" button (used in dashboard header)
//   compact={false} → full shareable card + invite code section (used at page bottom)

export default function SquadCard({ squad, members, inviteUrl, inviteCode, compact }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for browsers that block clipboard without HTTPS
      prompt('Copy this invite link:', inviteUrl)
    }
  }

  const hpHex =
    squad.hp > 60 ? '#22c55e' :
    squad.hp > 30 ? '#eab308' :
                    '#ef4444'

  // ── Compact mode: just an invite button ─────────────────────────────────────
  if (compact) {
    return (
      <button
        onClick={copyLink}
        className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
          copied
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-[#111118] border-[#1f1f2e] text-gray-300 hover:text-white hover:border-gray-500'
        }`}
      >
        {copied ? '✓ Copied!' : '🔗 Invite'}
      </button>
    )
  }

  // ── Full card ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Invite Your Squad
      </h2>

      {/* Shareable card (styled for screenshots / stories) */}
      <div className="relative bg-gradient-to-br from-[#111118] to-[#0e0e1a] border border-[#1f1f2e] rounded-2xl p-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-600 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs">⚡</span>
                <span className="text-xs font-black text-gray-500 tracking-widest">SIGNAL</span>
              </div>
              <h3 className="text-xl font-black leading-tight">{squad.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black tabular-nums" style={{ color: hpHex }}>
                {squad.hp}
              </div>
              <div className="text-xs text-gray-600">HP</div>
            </div>
          </div>

          <div className="w-full h-2 bg-[#0a0a0f] rounded-full border border-[#1f1f2e] mb-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${squad.hp}%`, backgroundColor: hpHex }}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <span>🔥</span>
              <span className="font-bold tabular-nums">{squad.streak}</span>
              <span className="text-gray-500 text-sm">day streak</span>
            </div>
            <span className="text-gray-500 text-sm">{members.length} / 6 members</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {members.map(m => (
              <span
                key={m.id}
                className="bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-medium"
              >
                {m.display_name.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Invite code + copy button */}
      <div className="bg-[#111118] border border-[#1f1f2e] rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Invite Code
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#0a0a0f] border border-[#1f1f2e] rounded-lg px-4 py-2.5 text-center">
            <span className="font-mono font-bold text-xl tracking-[0.25em] text-white">
              {inviteCode}
            </span>
          </div>
          <button
            onClick={copyLink}
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              copied
                ? 'bg-green-500/20 border border-green-500/20 text-green-400'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-2.5 leading-relaxed">
          Share the code or the link. Friends will enter it when they sign up.
        </p>
      </div>
    </div>
  )
}
