import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    question: "How much screen time do you average each day?",
    options: [
      { label: "Under 2 hours",  emoji: "😇", value: "low" },
      { label: "2–4 hours",      emoji: "📱", value: "medium" },
      { label: "4–6 hours",      emoji: "😬", value: "high" },
      { label: "6+ hours",       emoji: "💀", value: "very_high" },
    ],
  },
  {
    question: "How does your phone use make you feel?",
    options: [
      { label: "Fine — it's under control",         emoji: "🤷", value: "fine" },
      { label: "A bit guilty",                       emoji: "😔", value: "guilty" },
      { label: "It's hurting my focus or sleep",     emoji: "😤", value: "affecting" },
      { label: "It's genuinely out of control",      emoji: "🔥", value: "out_of_control" },
    ],
  },
  {
    question: "Have you tried cutting back before?",
    options: [
      { label: "Never really tried",                 emoji: "🙈", value: "never" },
      { label: "Tried solo — didn't stick",          emoji: "😮‍💨", value: "solo_failed" },
      { label: "Made progress but keep slipping",    emoji: "📉", value: "slipping" },
      { label: "Tried everything, nothing works",    emoji: "😩", value: "nothing_works" },
    ],
  },
  {
    question: "What would actually keep you accountable?",
    options: [
      { label: "Friends who can see if I slip",      emoji: "👀", value: "social" },
      { label: "A streak I don't want to break",     emoji: "🔥", value: "streak" },
      { label: "Real consequences for failing",      emoji: "💥", value: "consequences" },
      { label: "All of the above",                   emoji: "⚡", value: "all" },
    ],
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)

  function handleSelect(value) {
    setSelected(value)
  }

  function handleNext() {
    if (selected === null) return
    const next = [...answers, selected]
    setAnswers(next)
    setSelected(null)

    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  const progress = ((step) / STEPS.length) * 100

  if (done) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-3xl font-black mb-3">You're a good fit.</h1>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Signal is a squad-based accountability app. Your group shares a health bar —
            everyone checks in daily, and if someone slips, the whole squad takes damage.
            Miss too many days and you wipe. Stay consistent and your streak grows.
          </p>

          <div className="space-y-3 mb-8">
            {[
              { icon: "🛡️", text: "Your squad lives and dies together" },
              { icon: "🔥", text: "Daily streaks reward consistency" },
              { icon: "📊", text: "See your whole squad's status in real time" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 bg-[#111118] border border-[#1f1f2e] rounded-xl px-4 py-3"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all text-base tracking-wide"
          >
            Create Your Account →
          </button>
          <p className="text-gray-700 text-xs mt-4">Free. No credit card. Just accountability.</p>
        </div>
      </div>
    )
  }

  const current = STEPS[step]

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl">⚡</span>
          <span className="font-black text-lg tracking-tight">SIGNAL</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#1f1f2e] rounded-full mb-8">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step counter */}
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3">
          Question {step + 1} of {STEPS.length}
        </p>

        {/* Question */}
        <h2 className="text-2xl font-black leading-tight mb-6">
          {current.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                selected === opt.value
                  ? 'bg-indigo-600/20 border-indigo-500/60 text-white'
                  : 'bg-[#111118] border-[#1f1f2e] text-gray-300 hover:border-gray-500'
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={selected === null}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-base"
        >
          {step === STEPS.length - 1 ? 'See My Results →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
