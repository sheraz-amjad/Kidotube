# 🧠 Project Memory — KidoTube

## Project Identity & Architecture
- **Name**: KidoTube
- **Purpose**: Safe, curated, educational streaming & interactive 9-game portal for kids with parent controls, custom color themes, achievement trophies, an administrative management dashboard, **My Notebook** for handwriting and drawing, **Smart Reminders & Study Alarms**, and **Safe Kids Corner** for safe creative sharing.
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Scoped CSS Modules (`*.module.css`) + CSS Custom Properties supporting 5 dynamic theme presets in `src/app/globals.css`.
- **State Management**: Root `AppProvider` in `src/app/layout.tsx` via `src/components/Providers.tsx`, persisting state to `localStorage` (`kidotube_state_v4`).
- **Sound & Voice Engine**: `src/lib/sound.ts` zero-asset Web Audio API synthesizer (pops, star chimes, win fanfare, musical piano frequencies, bedtime lullaby) + SpeechSynthesis text-to-speech engine with pronunciation support.
- **Data Model**: `src/lib/data.ts` containing videos, categories, 9 playable games, reminders, notebook entries, safe corner posts, and query selectors.

---

## 🎨 Color Theme Presets
- **☀️ Sunshine Day** (`sunshine`): Warm honey background, coral and violet accents (default).
- **🌌 Cosmic Galaxy** (`cosmic`): Dark starry night space mode with neon cyan and magenta accents.
- **🌿 Jungle Safari** (`safari`): Fresh emerald and mint green nature theme with bamboo styling.
- **🍬 Cotton Candy** (`candy`): Sweet dreamy baby pink, lavender, and sky blue pastels.
- **🌊 Ocean Splash** (`ocean`): Deep turquoise, marine cyan, and seafoam tropical theme.

---

## Key Credentials & Defaults
- **Parent PIN**: `1234` (configurable & persisted in Parent Dashboard)
- **Admin Login**: `admin` / `kidotube2024`
- **Default Screen Time**: 60 minutes / day (with +15m bonus award button for parents)
- **Bedtime Schedule**: Configurable sleep lock (Off, 7 PM, 8 PM, 9 PM, 10 PM)

---

## Directory Map
```
kidotube/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with Google Fonts + root Providers wrapper
│   │   ├── globals.css            # 5 Theme color tokens, typography, utilities
│   │   ├── page.tsx               # Child Home Page (search, favorite shelf, categories, 9 games row)
│   │   ├── page.module.css
│   │   ├── category/[slug]/       # Category-filtered video list + language & age filters
│   │   ├── watch/[id]/            # YouTube player + voice narration + reactions + theater mode
│   │   ├── games/                 # Interactive games hub with 5 category filter tabs
│   │   │   └── [slug]/            # 9 Full Interactive Games
│   │   ├── notebook/              # My Notebook (Letter tracing, Draw Along, Notes, PDF export)
│   │   │   ├── page.tsx
│   │   │   └── page.module.css
│   │   ├── corner/                # Safe Kids Corner (Weekly challenge, safe wall, sticker reactions)
│   │   │   ├── page.tsx
│   │   │   └── page.module.css
│   │   ├── parent/                # Parent PIN pad, study alarms, screen time, Kids Corner permissions
│   │   │   ├── page.tsx
│   │   │   └── page.module.css
│   │   └── admin/                 # Add Video modal, database, stats, and Kids Corner Moderation Queue
│   │       ├── page.tsx
│   │       └── page.module.css
│   ├── components/
│   │   ├── Providers.tsx          # Client wrapper for AppProvider at root
│   │   ├── ChildHeader.tsx        # Top navigation with avatar picker, theme switcher, streak, alarms banner
│   │   ├── ChildHeader.module.css
│   │   ├── VideoCard.tsx          # Card with thumbnail, favorite button, language badge, views
│   │   ├── CategoryCard.tsx       # Vibrant category tiles with video count
│   │   └── GameCard.tsx           # Colorful game card with play button
│   └── lib/
│       ├── data.ts                # Curated mock dataset, 9 game definitions & query helpers
│       ├── sound.ts               # Web Audio API sound synthesizer, piano notes & SpeechSynthesis
│       └── context.tsx            # Global state (study reminders, notebook entries, corner posts, streak, etc.)
├── README.md                      # Public project documentation & quickstart
├── FEATURES.md                    # In-depth features guide
├── ARCHITECTURE.md                # Technical implementation documentation
├── CHANGELOG.md                   # Chronological updates history
├── MEMORY.md                      # Project architecture & design choices (this file)
└── package.json
```

---

## 3 Core New Systems Added

### 1. 📓 My Notebook (`/notebook`)
- **Handwriting Pad & Alphabet Tracing**:
  - English uppercase & lowercase letters (A–Z) with phonics pronunciation using SpeechSynthesis.
  - Urdu letters (حروف تہجی: ا، ب، پ، ت، ٹ، ث، ج، چ، ح، خ...) with Urdu pronunciation guide.
  - Ghost-tracing canvas overlay showing dotted guide letters that children trace over.
- **Draw Along Step-by-Step Templates**:
  - Interactive drawing templates (Cat 🐱, Star 🌟, Tree 🌳, Butterfly 🦋, House 🏠, Car 🚗).
  - 4-step progressive drawing instructions guiding children from simple shapes to complete art.
- **Lined Learning Notes**:
  - Notebook-ruled lined paper for typing study summaries, stories, or spellings.
- **Color & Brush Tools**:
  - 12 kid-friendly colors, eraser, 4 brush thicknesses, and canvas clear button.
- **Private Keepsake Gallery & PDF Export**:
  - Local private gallery saving all drawings with timestamps.
  - 🖨️ "Print & Export PDF Keepsake" button formatted with dedicated `@media print` styles for memory albums.
- **Direct Submission to Safe Kids Corner**:
  - "Share to Safe Kids Corner" button that converts canvas artwork to image and submits to moderation queue.

### 2. ⏰ Smart Study Alarms & Reminders
- **Parent PIN Protection**:
  - Configurable strictly inside Parent Dashboard (`/parent`).
  - Set custom task title (e.g., "🎵 Daily Poem Practice", "🔢 Math Fun Quiz"), time (e.g. 17:00), subject category, and stars reward (+5 ⭐).
- **Child-Friendly Top-Bar Alert**:
  - Automatically pops up in `ChildHeader` when system clock matches the scheduled reminder.
  - **Start Now button**: Awards stars, completes task, increments daily streak, and plays celebratory fanfare.
  - **Limited Snooze (5m)**: Holds the reminder for 5 minutes before gently re-alerting.
- **Safety & Quiet Hours**:
  - Automatically respects screen-time limits and quiet bedtime hours (alarms remain silent during sleep lock).
- **Daily Study Streak (`🔥 X days`)**:
  - Consecutive daily study completion tracked and celebrated on the header bar.

### 3. 🛡️ Safe Kids Corner (`/corner`)
- **Zero Social Media Hazards**:
  - **Parent Opt-In Required**: Parents can enable/disable posting rights in the Parent Dashboard.
  - **In-App Art Only**: Submissions originate exclusively from the child's in-app Notebook canvas (zero camera access, zero file uploads, no risk of leaking faces or locations).
  - **Nicknames & Avatars Only**: No real names, emails, or personal identification.
  - **Preset Sticker Reactions**: No comments, no text input, no private messages. Reactions are limited to 4 uplifting stickers: `🎨 Artist`, `🌟 Super Star`, `👏 Bravo`, `💖 Love`.
  - **Pre-Moderated Safeguard**: Submissions are scanned by AI safety checks (100% Kid Safe Art verification) and held in the Admin Moderation Queue (`/admin`) until human approved.
  - **No Followers or Like Rankings**: Children are recognized for creative effort through the "Featured of the Week" showcase and weekly creative challenges (e.g. "Draw Your Dream Treehouse").
