<div align="center">

# 🚆 RailRoute

### Find every possible multi-leg train route across India — ranked, plain-language, offline-first.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/5amkhaled/Railroute)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Made for Bharat](https://img.shields.io/badge/Made%20for-Bharat%20🇮🇳-orange)](https://github.com/5amkhaled/Railroute)

**[Live App](https://railroute.pages.dev)** · **[Report a Bug](https://github.com/5amkhaled/Railroute/issues)** · **[Request a Feature](https://github.com/5amkhaled/Railroute/discussions)**

</div>

---

## The Problem

India has 14,000 trains and 8,000 stations. But there is no direct train between thousands of city pairs.

A traveller going from **Dimapur → Gorakhpur** has to:

1. Search for the first train leg on IRCTC
2. Note the arrival time at the connecting station
3. Search for the next train from there
4. Mentally calculate if there's enough connection time
5. Check seat availability on every train separately
6. Repeat for every leg — and hope they got it right

This takes 20–40 minutes. It breaks completely when there's no internet — which is exactly where multi-leg journeys are most common: remote stations, Northeast India, rural Bihar, hill states.

**Existing apps fail here.** IRCTC only shows direct trains. Ixigo needs good internet. RailYatri rate-limits aggressively. None of them work offline.

---

## The Solution

RailRoute automatically finds **every possible connecting route** between any two stations in India, ranks them by what matters to the traveller, and shows real-time seat availability — all in plain language that anyone can understand.

The most important design decision: **the entire route-finding engine runs offline.** The full Indian Railways timetable lives on the user's device as a 14 MB SQLite database. Search results appear in under 1 second with zero internet.

```
User types: Dimapur → Gorakhpur

RailRoute finds:

  Route 1 — Best match · 31h 20m · ₹1,240
  ┌─────────────────────────────────────────────────────┐
  │ 15904 Dibrugarh–Chandigarh Exp                      │
  │ Dimapur → Guwahati  ·  Leaves 6:10 AM, arrives 2:40 PM │
  │                                                     │
  │ ⏱ 55 min wait at Guwahati — safe                   │
  │                                                     │
  │ 12506 North East Express                            │
  │ Guwahati → Gorakhpur  ·  Leaves 3:35 PM             │
  │ Arrives next day, Thursday 18 April at 1:30 PM      │
  └─────────────────────────────────────────────────────┘
  SL: Available ✓    3AC: Available ✓

  Route 2 — Cheaper option · 34h 55m · ₹980
  Route 3 — Via Lumding · 38h 15m · ₹870
  ... and every other valid combination
```

---

## What Makes RailRoute Different

| Feature | RailRoute | Ixigo | RailYatri | IRCTC |
|---|---|---|---|---|
| Multi-leg route finding | ✓ | ~ | ~ | ✗ |
| All combinations shown | ✓ | ✗ | ✗ | ✗ |
| **Works fully offline** | ✓ | ✗ | ✗ | ✗ |
| Works on 2G / no signal | ✓ | ✗ | ✗ | ✗ |
| Plain-language output | ✓ | ~ | ~ | ✗ |
| On-time % per train | ✓ | ✓ | ✓ | ✗ |
| WhatsApp bot | ✓ | ✗ | ✗ | ✗ |
| Open source | ✓ | ✗ | ✗ | ✗ |

---

## Architecture — Three Layers of Survival

RailRoute is designed so each layer can fail independently without breaking the user experience.

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1 — Always works (on device)                         │
│  SQLite timetable · Route engine · Delay history cache      │
│  Cannot fail. Lives on the user's phone.                    │
└─────────────────────────────────────────────────────────────┘
                           ↕ online only
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2 — Usually works (edge)                             │
│  Cloudflare Workers proxy · Turso edge DB · Shadow cache    │
│  If this fails → Layer 1 still works                        │
└─────────────────────────────────────────────────────────────┘
                           ↕ live calls
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3 — Live data                                        │
│  RailwayAPI (seats) · RapidAPI (failover) · Live location   │
│  If this fails → Layers 1+2 still work                      │
└─────────────────────────────────────────────────────────────┘
```

**The key principle:** the browser never touches any third-party domain directly. All external calls go through a Cloudflare Worker proxy on our own domain. This makes the app resilient to ISP-level blocks.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js + Tailwind | App Router, TypeScript, fast |
| Hosting | Cloudflare Pages | Mumbai + Chennai edge, India-proof |
| Proxy | Cloudflare Workers | 100k free req/day, all external calls go here |
| Offline DB | SQLite (sql.js) | Full timetable on device, 14 MB compressed |
| Edge cache | Turso (libSQL) | Mumbai replicas, shadow API cache |
| User data | Neon Postgres | AWS ap-south-1 Mumbai, cannot be blocked |
| Auth | Better Auth (v2) | Self-hosted, open source, added in v2 |
| Live API | RailwayAPI + RapidAPI | Dual provider failover, 2s timeout auto-switch |
| WhatsApp | Meta Cloud API | 1,000 free conversations/month |
| Analytics | Umami (self-hosted) | 1 KB script, no cookies, open source |

**Monthly running cost: ₹0** (domain ~₹67/month when registered)

---

## Offline Capabilities

Everything below works with **zero internet** — on 2G, in airplane mode, or at a station with no signal:

- Search any route across India — results in under 1 second
- Browse all trains passing through any station
- View full schedule of any train — every stop, timing, distance
- See on-time percentage for any train (synced weekly on Wi-Fi)
- Calculate connection safety at any junction
- View saved trips and booked legs
- See last search result even after losing signal
- Generate WhatsApp-shareable route text

When live data is unavailable, the app shows stale data with a clear timestamp — never a blank screen, never an error page.

---

## Project Structure

```
railroute/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home / search screen
│   ├── results/            # Route results page
│   └── train/[id]/         # Individual train details
├── components/             # Reusable UI components
│   ├── SearchBar.tsx
│   ├── RouteCard.tsx
│   └── LegTimeline.tsx
├── lib/                    # Core logic
│   ├── db/                 # SQLite query functions
│   ├── route-engine/       # Dijkstra route finder
│   ├── cache/              # Turso shadow cache
│   └── api/                # Worker proxy calls
├── workers/                # Cloudflare Worker code
│   ├── proxy.ts            # Main API proxy + failover
│   └── domain-ping.ts      # Multi-domain health check
├── data/                   # Railway timetable data
│   ├── railroute.db        # SQLite database (generated)
│   └── scripts/            # Data import scripts
└── public/
    └── db/                 # Static SQLite file for download
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Cloudflare account (free)
- RailwayAPI key from RapidAPI (free tier)

### Local Development

```bash
# Clone the repo
git clone https://github.com/5amkhaled/Railroute.git
cd Railroute

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Add your RailwayAPI key to .env.local

# Download the timetable database
npm run db:download

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
RAILWAY_API_KEY=your_rapidapi_key_here
RAPIDAPI_BACKUP_KEY=your_backup_key_here
TURSO_DATABASE_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token
NEON_DATABASE_URL=your_neon_postgres_url
```

---

## Contributing

RailRoute is built for Bharat and needs contributors who know India's railways firsthand.

### Where help is needed most

**🗄️ Data quality** — If you know trains in your region with wrong timings or missing stops, fix them in `data/` and submit a PR. Most impactful contribution possible.

**🔤 Station name fuzzy matching** — Users type "dimpur", "dimapur jn", "Dimapur" — all should resolve to DMV. Improving this, especially for Hindi transliterations, is high value.

**🌐 Hindi + regional translations** — All UI strings are in `lib/i18n/`. Translating requires zero code. Even partial translations are merged immediately.

**📱 Testing on low-end devices** — If you have a phone under ₹6,000 or a 2G SIM, testing and reporting what breaks is extremely valuable. Our target user has exactly this device.

**⏱️ Delay history data** — Historical delay datasets from NTES or crowd-sourced sources can improve on-time percentage accuracy significantly.

### How to contribute

1. Fork the repo
2. Create a branch: `git checkout -b my-fix`
3. Make your change
4. Open a pull request with a clear description

For larger changes, open a [GitHub Discussion](https://github.com/5amkhaled/Railroute/discussions) first.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## Roadmap

**v0.1 — Working (Week 1)**
- [ ] Offline route search — all connecting combinations
- [ ] Basic UI — search bar + route cards
- [ ] Cloudflare Worker proxy — live seat availability
- [ ] SQLite timetable on device

**v0.2 — Good (Week 2–3)**
- [ ] Full prototype UI with timeline view
- [ ] Shadow API cache in Turso
- [ ] Plain-language time formatting
- [ ] Dead Mode — graceful offline degradation
- [ ] On-time % per train
- [ ] Delay risk indicator per connection

**v0.3 — Spread (Week 4)**
- [ ] PWA — installable on Android
- [ ] WhatsApp bot
- [ ] Shareable route text

**v1.0 — Scale (Month 2+)**
- [ ] Hindi + regional languages
- [ ] Optional login with saved trips
- [ ] Live delay alerts
- [ ] Android app on Play Store

---

## License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE).

---

<div align="center">

Built with ❤️ for the 23 million Indians who travel by train every day.

**[⭐ Star this repo](https://github.com/5amkhaled/Railroute)** if you find it useful — it helps others discover the project.

</div>
