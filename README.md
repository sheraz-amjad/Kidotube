# 🌟 KidoTube — Safe, Educational Video, Games & Learning Platform for Kids

![KidoTube Banner](public/globe.svg)

KidoTube is a colorful, kid-friendly streaming, educational mini-game, and creative learning platform designed specifically for children, parents, and platform administrators. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Vanilla CSS Modules**.

---

## ✨ Features

### 👶 1. Child Experience (Safe & Engaging)
- **5 Theme Color Presets**: Switch instantly between ☀️ Sunshine Day, 🌌 Cosmic Galaxy, 🌿 Jungle Safari, 🍬 Cotton Candy, and 🌊 Ocean Splash.
- **Instant Kid Search & Filters**: Search videos by name, topic, or tag, with filter chips for categories, languages (English & Urdu), and age groups (6–7, 8–10).
- **Mascot Avatar Picker**: Children can pick their own friendly companion (🦄 Sparkle Unicorn, 🦁 Leo, 🚀 Astro, 🐼 Panda, 🦖 Rex, 🐰 Bunny, 🐶 Puppy).
- **💖 My Favorite Videos Shelf**: Click the heart button on any video card or player to save it to your personal favorites shelf!
- **Web Audio Sound Effects**: Cheerful popping, sparkling star chimes, and victory fanfare synthesized via browser Web Audio API with a one-click mute/unmute toggle (🔊 / 🔇).
- **Safe Emoji Reactions**: Kids can express love, laughter, intelligence, and excitement (❤️, 😂, 💡, 🌟) on watched videos.
- **Eye Rest & Stretch Prompts**: Gentle friendly reminders encouraging kids to blink and stretch their eyes.
- **Bedtime Sleep Mode**: Soothing night mode lock when nighttime arrives with a soothing lullaby player.

### 📓 2. My Notebook (`/notebook`)
- **Handwriting Pad with Letter Tracing**: English (A–Z) and Urdu (حروف تہجی) tracing with dotted guide overlays and text-to-speech letter pronunciation.
- **Draw Along Step-by-Step Templates**: 4-step progressive drawing templates for Kitten 🐱, Star 🌟, Tree 🌳, Butterfly 🦋, House 🏠, and Car 🚗.
- **Lined Learning Notes**: Notebook-ruled paper for typing study notes and stories.
- **Private Keepsake Gallery & PDF Export**: Automatically saves creations locally with 🖨️ "Print & PDF Keepsake Export" and a direct share button to the Safe Kids Corner.

### ⏰ 3. Smart Study Alarms & Reminders
- **Parent-Configured Daily Routines**: Parents schedule study alarms (e.g., "Poem practice at 5:00 PM") in the Parent Dashboard.
- **Friendly Child Top-Bar Alert**: Friendly notification banner with "🚀 Start Now" and "⏳ Snooze (5m)".
- **Streaks & Stars**: Completing reminded tasks earns stars toward the daily study streak (`🔥 X days`).
- **Sleep & Screen-Time Respect**: Reminders remain quiet during screen-time lockout and bedtime quiet hours.

### 🛡️ 4. Safe Kids Corner (`/corner`)
- **Safe Creative Community Wall**: A safe social sharing alternative free from bullying, stranger danger, and photo leaks.
- **Parent Opt-In Required**: Parents control sharing permission via the Parent Dashboard.
- **100% In-App Art Only**: No camera or photo uploads; creations come solely from the in-app Notebook.
- **Nicknames & Avatars Only**: Zero personal information or real names.
- **Preset Sticker Reactions**: Reactions only via `🎨 Artist`, `🌟 Super Star`, `👏 Bravo`, and `💖 Love` (no comments, no direct messages).
- **Pre-Moderated Safeguard**: Automated AI safe scans + Admin approval in `/admin`.
- **Effort-Based Rewards**: Highlights "Featured of the Week" and weekly creative challenges instead of like rankings or follower counts.

### 🎮 5. 9 Interactive Mini-Games (`/games`)
- **🃏 Memory Match (`/games/memory-match`)**: 3D card flip memory game with emojis.
- **🧮 Math Quiz (`/games/math-quiz`)**: Fun arithmetic questions with audio feedback and score tracking.
- **🐝 Spelling Bee (`/games/spelling-bee`)**: Interactive letter tile puzzle to unscramble vocabulary words.
- **🎨 Coloring Book (`/games/coloring-book`)**: Drawing canvas with 12 colors, 4 brushes, templates, stamps, and PNG download.
- **🦁 Animal Puzzle (`/games/animal-puzzle`)**: 3x3 sliding/tile-swap jigsaw puzzle with cute animals.
- **🎈 Balloon Pop (`/games/balloon-pop`)**: Reflex arcade game popping balloons in the sky.
- **🎹 Magic Piano (`/games/magic-piano`)**: Playable 8-key keyboard with real frequencies and rhyme guides.
- **🦖 Dino Runner (`/games/dino-runner`)**: Prehistoric 2D obstacle jumper with jump physics.
- **🍓 Fruit Catcher (`/games/fruit-catcher`)**: Moveable basket catching fruits and avoiding storm clouds.

### 🛡️ 6. Parental Control Portal (`/parent`)
- **PIN Protected**: 4-digit keypad protection (configurable PIN with demo default: `1234`).
- **Screen Time & +15m Bonus**: Set daily limits and reward children with +15m bonus screen time.
- **Bedtime Sleep Lock Schedule**: Configure evening bedtime hours (7 PM, 8 PM, 9 PM, 10 PM) or disable.
- **Study Alarms & Kids Corner Controls**: Manage study schedules and grant/revoke Kids Corner sharing rights.
- **Child Age Filtering & Category Blocking**: Filter age group (6–7, 8–10, all) and hide entire subjects.
- **Learning Analytics & History**: Time spent per subject and timestamped watch history.

### 🛠️ 7. Admin Management Dashboard (`/admin`)
- **Admin Authentication**: Secure login portal (Demo: `admin` / `kidotube2024`).
- **+ Add Video Modal**: Add videos by YouTube ID or link with category, age group, language, and duration.
- **Kids Corner Moderation Queue**: Inspect AI safety scan scores, approve/reject submissions, and toggle "Featured of the Week".
- **Catalog & Game Stats**: Visual distribution and usage analytics.

---

## 🔑 Demo Credentials

| Role | Route | Credentials |
|---|---|---|
| **Parent Portal** | `/parent` | PIN: **`1234`** |
| **Admin Portal** | `/admin` | Username: **`admin`** &nbsp;\|&nbsp; Password: **`kidotube2024`** |

---

## 🗺️ Application Routes

| Route | Description |
|---|---|
| `/` | Kid-friendly home screen with featured categories & videos |
| `/category/[slug]` | Category-specific video catalog |
| `/watch/[id]` | Safe video player with screen time limits & star awards |
| `/notebook` | My Notebook (Handwriting tracing, Draw Along, Notes, PDF export) |
| `/corner` | Safe Kids Corner (Weekly challenge, safe wall, sticker cheers) |
| `/games` | Interactive educational games hub (9 playable games) |
| `/games/[slug]` | Playable mini-game |
| `/parent` | PIN-protected parent controls, study alarms & permission dashboard |
| `/admin` | Administrative content library, analytics & Kids Corner moderation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation
```bash
# Clone or navigate into directory
cd kidotube

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```
