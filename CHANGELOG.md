# 📝 KidoTube — Changelog & Updates

All notable changes and technical enhancements to the KidoTube project are documented in this file.

---

## [v2.2.0] - My Notebook, Smart Study Alarms & Safe Kids Corner

### 📓 1. My Notebook (`/notebook`)
- **Dual-Language Handwriting & Alphabet Tracing**:
  - Full English alphabet (A–Z) tracing with upper/lower case toggle and Web Speech phonics pronunciation.
  - Urdu alphabet (حروف تہجی: ا، ب، پ، ت، ٹ، ث، ج، چ...) tracing with Urdu pronunciation audio.
  - Dotted letter guide background canvas that children can trace over directly with responsive mouse/touch.
- **Draw Along Step-by-Step Guides**:
  - Step-by-step drawing templates for 6 cute items: Kitten 🐱, Star 🌟, Tree 🌳, Butterfly 🦋, House 🏠, and Car 🚗.
  - 4-step progressive visual cards showing exact geometric shapes to sketch.
- **Lined Learning Notes**:
  - Digital lined notebook paper for typing summaries, poems, and vocabulary notes with lined ruling.
- **Drawing Tools & Keepsake Gallery**:
  - 12 vibrant kid-friendly color swatches, 4 brush thicknesses, eraser, and clear board.
  - Local keepsake gallery saving drawings with timestamps.
  - **PDF Keepsake & Printable Export**: 🖨️ Formatted `@media print` sheet for parents to print keepsakes or save as PDF.
  - **One-Tap Share to Safe Kids Corner**: Direct bridge allowing children to submit their drawing to the community moderation queue.

### ⏰ 2. Smart Reminders & Study Alarms
- **PIN-Protected Parent Scheduler**:
  - Configurable in the Parent Dashboard with 4-digit PIN protection.
  - Set custom task titles (e.g., "🎵 Daily Poem Practice", "🔢 Math Fun Quiz"), time of day, target subject, and star reward (+5 ⭐).
- **Child-Friendly Study Alerts**:
  - Real-time periodic check interval displays a top-bar banner when study time arrives.
  - **Start Now button**: Awards bonus stars, increments the daily study streak, and triggers audio victory chimes.
  - **Limited Snooze (5m)**: Snoozes reminder for 5 minutes before gently re-alerting.
- **Screen Time & Bedtime Respect**:
  - Reminders automatically stay silent during locked screen time or nighttime bedtime quiet hours.
- **Daily Study Streak Counter**:
  - Displayed on the child header (`🔥 X days`) to celebrate consistent learning habits.

### 🛡️ 3. Safe Kids Corner (`/corner`)
- **Safety First Architecture (No Social Media Risks)**:
  - **Parent Opt-In Required**: Parents explicitly grant or revoke posting permission from the Parent Dashboard.
  - **100% In-App Art Only**: Creations originate solely from the in-app Notebook canvas (zero camera permissions, zero photo uploads; faces and private locations never leak).
  - **Nicknames & Avatars Only**: No real names, emails, or personal identities.
  - **Preset Sticker Reactions Only**: No comment textboxes and no private messaging. Other kids react using 4 preset stickers: `🎨 Artist`, `🌟 Super Star`, `👏 Bravo`, `💖 Love`.
  - **Pre-Moderation Queue (`/admin`)**: All posts are pre-scanned by AI safety checks (100% Kid Safe Art) and held for human administrator approval before going public.
  - **No Followers or Like Ranking**: Rewarding effort rather than popularity through weekly challenges (e.g. "🌳 Dream Treehouse") and the "🌟 Featured of the Week" showcase.

---

## [v2.1.0] - Theme Presets, Expanded Games Suite & Trophy Achievements

### 🎨 5 Color Theme Presets
- Added dynamic theme switcher in the header:
  - ☀️ **Sunshine Day** (`sunshine`): Warm honey & violet (default)
  - 🌌 **Cosmic Galaxy** (`cosmic`): Starry dark space theme with neon highlights
  - 🌿 **Jungle Safari** (`safari`): Fresh emerald & mint nature theme
  - 🍬 **Cotton Candy** (`candy`): Sweet dreamy pastel pink & lavender
  - 🌊 **Ocean Splash** (`ocean`): Aquamarine, marine cyan, and seafoam tropical theme
- Persisted in `localStorage: kidotube_state_v4` and instantly synced via `data-theme` attribute.

### 🎮 3 New Interactive Games (Total: 9 Games)
- **Magic Piano (`/games/magic-piano`)**: Playable 8-key musical keyboard with real Web Audio frequencies and nursery rhyme song guides ("Twinkle Twinkle", "Happy Birthday").
- **Dino Runner (`/games/dino-runner`)**: Prehistoric 2D obstacle jumper with jump physics, obstacle spawning, collision detection, and score tracker.
- **Fruit Catcher (`/games/fruit-catcher`)**: Arcade game with a moveable basket catching nutritious fruits and dodging thunder hazards.

### 🏆 Gamification & Trophies Room
- Added a full Achievements/Trophies modal in the header displaying 9 collectible gold badges.
- Badges unlock automatically upon completing specific educational milestones.

### 🗣️ Voice Narration & Bedtime Lullaby
- Integrated browser SpeechSynthesis with child-friendly cadence so early readers can hear video titles & descriptions read out loud.
- Added ambient soothing lullaby melody generator via Web Audio API.

---

## [v2.0.0] - Enhanced Experience & Interactive Suite

### 🚀 Architecture & State Management
- **Unified Root AppProvider**: Wrapped the application with `<Providers>` in `src/app/layout.tsx` so child navigation retains user session state, stars, screen time, favorites, custom avatar, and parental status.
- **LocalStorage Schema Upgrade**: Migrated storage to `kidotube_state_v2` supporting favorites, custom videos, audio settings, bedtime schedule, age restrictions, and safe emoji reactions.
- **Next.js 16 / React 19 Compatibility**: Updated dynamic routing pages (`/games/[slug]`, `/category/[slug]`, `/watch/[id]`) to use React 19 `use(params)` resolving Next.js 16 asynchronous params cleanly.

### 👶 Child Portal & Navigation
- **Live Search & Multi-Filters**: Added real-time text search with category pills, bilingual filters (🇬🇧 English / 🇵🇰 Urdu), and age filters.
- **Mascot Avatar Selector**: Added an interactive character switcher in `ChildHeader.tsx` allowing children to pick from 7 mascots (🦄 Sparkle Unicorn, 🦁 Leo, 🚀 Astro, 🐼 Panda, 🦖 Rex, 🐰 Bunny, 🐶 Puppy).
- **💖 My Favorite Videos Shelf**: Added a favorite heart button to all video cards and player pages, displaying saved videos in a dedicated home shelf.
- **🕒 Continue Watching Shelf**: Added quick-resume shelf displaying recently viewed videos.
- **Web Audio Sound Synthesizer**: Implemented `src/lib/sound.ts` with zero external assets for bubbly pops, star chimes, victory fanfare, and wrong answers, with a header audio toggle (🔊 / 🔇).

### 🎮 Interactive Mini-Games Suite
- **Coloring Book (`/games/coloring-book`)**: Built an interactive HTML5 canvas game with 12 colors, 4 brush thicknesses, cute templates (Kitten, Rocket, Fish, Flower), 8 sticker stamps, and PNG artwork export.
- **Animal Puzzle (`/games/animal-puzzle`)**: Built an interactive 3x3 sliding/tile-swap jigsaw puzzle with cute animals and move tracking.
- **Balloon Pop (`/games/balloon-pop`)**: Built an arcade reflex game where floating balloons pop with bubbly sound effects.
- **Enhanced Games**: Added audio feedback and victory star celebrations to Memory Match, Math Quiz, and Spelling Bee.
- **Games Hub Filtering**: Added filter tabs on `/games` for Math & Words, Puzzles & Memory, and Creative Art.

### 🎬 Video Watch Experience
- **Safe Emoji Reactions**: Added child-safe reaction buttons (❤️ Love it, 😂 Funny, 💡 Smart, 🌟 Super) with counters.
- **Theater Mode**: Added a wide cinematic screen mode toggle.
- **Health Tip Reminder**: Added an automatic eye rest and stretch prompt for children.
- **Category Lock Protection**: Direct links to blocked categories are securely gated with friendly mascot prompts.

### 🛡️ Parental Shield & Controls
- **Configurable Parent PIN**: Parents can update the 4-digit PIN directly from the dashboard.
- **Bedtime Sleep Lock Schedule**: Added customizable bedtime hours (7 PM, 8 PM, 9 PM, 10 PM, or Off).
- **One-Click Screen Time Bonus**: Added a `+15 Min Bonus` button for instant rewards.
- **Age Restriction Filter**: Restrict child content to Early Learners (6–7), Older Kids (8–10), or All Ages.
- **Learning Breakdown Analytics**: Added visual progress bars tracking minutes spent per subject.

### 🛠️ Admin Dashboard
- **+ Add Video Modal**: Added form allowing administrators to add videos via YouTube ID/URL, assigning metadata, categories, and age groups.
- **Catalog Synchronization**: Custom videos immediately appear across all child views and category catalogs.
- **Games Manager**: Directory overview of all 6 active games with live preview links.

---

## [v1.0.0] - Initial Prototype
- Core Next.js 16 App Router foundation.
- Basic video player with YouTube embed.
- Mock datasets for Cartoons, Poems, Math, Science, English, and Urdu.
- Initial prototypes for Memory Match, Math Quiz, and Spelling Bee.
- Basic parent PIN protection and daily screen time timer.
