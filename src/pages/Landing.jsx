import { useNavigate } from 'react-router-dom'

const HOW_IT_WORKS = [
  {
    step: '01',
    emoji: '📋',
    title: 'Take the quiz',
    desc: 'Answer 4 quick questions about your screen time habits. Takes 60 seconds.',
  },
  {
    step: '02',
    emoji: '🛡️',
    title: 'Build your squad',
    desc: 'Create a squad and invite 1–5 friends. You share a health bar. Everyone\'s on the hook.',
  },
  {
    step: '03',
    emoji: '⚡',
    title: 'Check in every day',
    desc: 'Did you hit your goal or not? Be honest — your squad sees everything.',
  },
]

const MECHANICS = [
  {
    emoji: '❤️',
    title: 'Shared HP Bar',
    desc: 'Your squad has one health bar. Every hit adds +10 HP. Every miss costs −20. Hit zero and the whole squad wipes — streak gone, back to square one.',
    color: 'border-red-500/20 bg-red-500/5',
    accent: 'text-red-400',
  },
  {
    emoji: '🔥',
    title: 'Daily Streaks',
    desc: 'Every day everyone hits their goal, your streak grows. 7 days. 30 days. The longer it goes, the more you have to lose.',
    color: 'border-orange-500/20 bg-orange-500/5',
    accent: 'text-orange-400',
  },
  {
    emoji: '🚩',
    title: 'Call Out Liars',
    desc: 'Think someone\'s lying? Flag them. If they get called out, the squad loses −10 HP. It makes honesty the only real option.',
    color: 'border-yellow-500/20 bg-yellow-500/5',
    accent: 'text-yellow-400',
  },
  {
    emoji: '🏆',
    title: 'Achievements',
    desc: 'Unlock badges for hitting milestones — Week Warrior, Month Master, Perfect Day. Flex on your squad.',
    color: 'border-indigo-500/20 bg-indigo-500/5',
    accent: 'text-indigo-400',
  },
]

const FAQS = [
  {
    q: 'How does it actually keep me accountable?',
    a: 'Your friends see your check-in every single day. When you slip, the whole squad loses HP. There\'s no hiding. That social pressure is the point.',
  },
  {
    q: 'What if someone lies?',
    a: 'Anyone in your squad can hit the 🚩 Sus button on a check-in they don\'t believe. Getting flagged costs the squad HP — so lying hurts everyone, including the liar.',
  },
  {
    q: 'Do I need to download anything?',
    a: 'Nope. Signal runs entirely in your browser. Open it on your phone and add it to your home screen for the full app feel.',
  },
  {
    q: 'What\'s the right squad size?',
    a: '3–5 people is the sweet spot. Small enough that everyone knows each other, big enough that missing a day actually matters to the group.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Fully free right now. No credit card, no trial, no catch.',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-24 sm:pb-0">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-black text-lg tracking-tight">SIGNAL</span>
        </div>
        <button
          onClick={() => navigate('/quiz')}
          className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
        >
          Get started →
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-5 pt-8 pb-14 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-3 py-1.5 text-indigo-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-7">
          ⚡ Squad-based screen time accountability
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-5">
          Your phone is
          <br />
          <span className="text-indigo-400">winning.</span>
          <br />
          Beat it together.
        </h1>

        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
          Signal turns screen time into a squad game. You and your friends share a
          health bar, check in every day, and keep each other honest.
          Miss too many days — the whole squad wipes.
        </p>

        <button
          onClick={() => navigate('/quiz')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-black py-4 px-8 rounded-xl transition-all text-base sm:text-lg tracking-wide"
        >
          Take the quiz — 60 seconds ⚡
        </button>
        <p className="text-gray-700 text-xs mt-3">Free. No app download. No credit card.</p>
      </section>

      {/* Problem */}
      <section className="max-w-2xl mx-auto px-5 pb-14">
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-5 sm:p-8">
          <p className="text-xl sm:text-2xl font-black leading-snug mb-5">
            You've tried screen time limits.<br />
            You've tried deleting apps.<br />
            <span className="text-gray-500">It didn't stick. Here's why:</span>
          </p>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
            Willpower is a terrible strategy. It works for a few days, then life
            gets stressful and you're back to 6 hours a day wondering where the
            afternoon went.
          </p>
          <p className="text-gray-300 text-sm sm:text-base font-semibold leading-relaxed">
            What actually works is accountability — specifically, knowing that real
            people you care about will see if you slip. Signal makes that happen automatically.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-2xl mx-auto px-5 pb-14">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">
          How it works
        </p>
        <div className="space-y-3">
          {HOW_IT_WORKS.map(({ step, emoji, title, desc }) => (
            <div key={step} className="flex items-start gap-4 bg-[#111118] border border-[#1f1f2e] rounded-2xl p-4 sm:p-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-xl">
                {emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-indigo-500 text-xs font-black tracking-widest">{step}</span>
                  <h3 className="font-black text-white text-sm sm:text-base">{title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Game mechanics */}
      <section className="max-w-2xl mx-auto px-5 pb-14">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          The game
        </p>
        <h2 className="text-xl sm:text-2xl font-black mb-5">
          Designed to make quitting feel like losing.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MECHANICS.map(({ emoji, title, desc, color, accent }) => (
            <div key={title} className={`border rounded-2xl p-4 sm:p-5 ${color}`}>
              <div className="text-2xl mb-2">{emoji}</div>
              <h3 className={`font-black mb-1.5 text-sm sm:text-base ${accent}`}>{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-2xl mx-auto px-5 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { stat: '< 5 min', label: 'to set up your squad' },
            { stat: '2–6',     label: 'people per squad' },
            { stat: '100%',    label: 'browser-based, no download' },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-4 flex sm:flex-col items-center gap-3 sm:gap-1 sm:text-center">
              <div className="text-xl sm:text-2xl font-black text-indigo-400 min-w-[60px]">{stat}</div>
              <div className="text-gray-500 text-xs leading-snug">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-5 pb-14">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">
          Common questions
        </p>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-4 sm:p-5">
              <p className="font-bold text-white text-sm sm:text-base mb-2">{q}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-2xl mx-auto px-5 pb-16 text-center">
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-6 sm:p-10">
          <div className="text-4xl sm:text-5xl mb-3">⚡</div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to stop losing?</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-7 leading-relaxed">
            Take the 60-second quiz and find out if Signal is right for you.
            Then build your squad and start today.
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-black py-4 px-8 rounded-xl transition-all text-base tracking-wide"
          >
            Start the quiz →
          </button>
          <p className="text-gray-700 text-xs mt-4">Free. No credit card. No download.</p>
        </div>
      </section>

      {/* Sticky bottom bar — mobile only */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0f]/95 backdrop-blur-sm border-t border-[#1f1f2e] z-40">
        <button
          onClick={() => navigate('/quiz')}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all text-base tracking-wide"
        >
          Take the quiz — it's free ⚡
        </button>
      </div>

    </div>
  )
}
