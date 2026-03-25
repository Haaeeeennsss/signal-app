# Signal

> Your squad vs. your phone. Fight together or wipe together.

Signal is a cooperative screen time accountability app. Instead of battling your phone addiction alone, you form a squad of 3–6 friends and share a single Health Bar. Every day you hit your screen time goal, the bar fills. Every day you miss it, the squad takes damage. Hit zero and the streak resets — for everyone.

Nobody wants to be the one who wiped the team.

---

## How it works

- **Form a squad** — invite 2–5 friends via a link
- **Set your goal** — each member sets their own daily screen time limit
- **Check in daily** — hit or miss, your squad feels it
- **Protect the HP bar** — collective wins fill it, individual failures drain it
- **Build your streak** — how many days can your squad survive?

---

## MVP Features

- Email authentication
- Squad creation and invite system
- Daily check-in (hit / missed goal)
- Shared squad HP bar with real-time updates
- Streak counter
- Member status view (who's checked in today)
- Shareable squad card for TikTok / Instagram stories

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Auth | Supabase Auth |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account

### Local setup
```bash
git clone https://github.com/YOUR_USERNAME/signal-app.git
cd signal-app
npm install
cp .env.example .env
# Fill in your Supabase URL and anon key in .env
npm run dev
```

### Environment variables
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Roadmap

- [ ] MVP web app (self-reported screen time)
- [ ] Shareable achievement cards
- [ ] Squad vs. squad battles
- [ ] Native iOS app with Screen Time API integration
- [ ] Native Android app with Digital Wellbeing API
- [ ] Signal+ subscription (unlimited squads, battle mode, full history)
- [ ] Token system (shield tokens to protect streaks)

---

## Philosophy

Most screen time apps fail because you're both the rule-maker and the rule-breaker. Signal flips the dynamic — your commitment isn't to yourself, it's to your squad. Breaking a promise to yourself is easy. Breaking one to people who are counting on you is a lot harder.

The enemy isn't your friends. The enemy is the algorithm.

---

## License

MIT
