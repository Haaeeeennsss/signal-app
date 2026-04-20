import { useState } from 'react'

export default function ShareModal({ squad, members, weekHits, weekPossible, inviteUrl, onClose }) {
  const [copied, setCopied] = useState(false)

  const shareText =
    `⚡ ${squad.name} — Week on Signal\n` +
    `🔥 ${squad.streak}-day streak\n` +
    `❤️ ${squad.hp}/100 HP\n` +
    `📊 ${weekHits}/${weekPossible} squad check-ins hit this week\n\n` +
    `We're holding each other accountable. Join us 👇\n` +
    inviteUrl

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      prompt('Copy this:', shareText)
    }
  }

  const twitterUrl =
    `https://twitter.com/intent/tweet?text=` +
    encodeURIComponent(
      `⚡ ${squad.name} on Signal — ${squad.streak}-day streak, ${squad.hp} HP\n` +
      `${weekHits}/${weekPossible} squad goals hit this week 💪\n` +
      inviteUrl
    )

  const whatsappUrl =
    `https://wa.me/?text=` + encodeURIComponent(shareText)

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-black mb-1">Share This Week</h3>
        <p className="text-gray-500 text-sm mb-5">Show your squad's progress.</p>

        {/* Preview card */}
        <div className="bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl p-4 mb-5 text-sm space-y-1.5">
          <p className="font-black text-white">{squad.name} ⚡</p>
          <p className="text-gray-400">🔥 {squad.streak}-day streak</p>
          <p className="text-gray-400">❤️ {squad.hp}/100 HP</p>
          <p className="text-gray-400">📊 {weekHits}/{weekPossible} squad hits this week</p>
          <p className="text-indigo-400 text-xs mt-2 truncate">{inviteUrl}</p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={copyText}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border ${
              copied
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-[#1a1a26] border-[#1f1f2e] text-white hover:border-gray-500'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy Text'}
          </button>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#1a1a26] border border-[#1f1f2e] text-white hover:border-gray-500 transition-all"
          >
            𝕏 Share on X / Twitter
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all"
          >
            💬 Share on WhatsApp
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
