# 🌟 KidoTube — Complete Features Guide

KidoTube is an ad-free, secure, and educational streaming and interactive gaming portal built specifically for children (ages 6–10), parents, and platform administrators.

---

## 👶 1. Child Experience & Portal (`/`)

### 1.1 Playful Design, Color Themes & Typography
- **5 Vibrant Color Themes**: Switch themes on the fly from the header:
  1. ☀️ **Sunshine Day** (Default bright & cheerful)
  2. 🌌 **Cosmic Galaxy** (Dark space theme with glowing stars)
  3. 🌿 **Jungle Safari** (Fresh emerald & mint green nature theme)
  4. 🍬 **Cotton Candy** (Dreamy baby pink, lavender, and sky blue)
  5. 🌊 **Ocean Splash** (Deep aquamarine, seafoam, and cyan)
- **Child-Friendly Aesthetics**: Uses Google Fonts (`Fredoka` & `Nunito`), rounded corner radiuses, soft pastel gradients, and bouncy micro-animations.
- **Mascot Avatars**: Children can click on their mascot companion in the header to switch between 7 avatars:
  - 🦄 **Sparkle Unicorn**, 🦁 **Leo the Lion**, 🚀 **Astro Kid**, 🐼 **Cozy Panda**, 🦖 **Rex the Dino**, 🐰 **Bunny**, 🐶 **Puppy**
- **🏆 Trophies & Badges Room**: Collectible gold trophies unlocked by completing videos and games.
- **🗣️ Text-To-Speech (Read Aloud)**: Integrated browser SpeechSynthesis to read video titles & descriptions out loud.
- **🌙 Bedtime Lullaby Audio**: Soothing ambient lullaby melody for nighttime relaxation.
- **🔥 Daily Study Streak**: Header badge tracking consecutive days of study routine completion.

### 1.2 Interactive Search & Multi-Criteria Filtering
- **Live Search**: Instant keyword filtering across video titles, descriptions, and tags.
- **Category Filter Pills**: One-click pills for Cartoons, Poems, Math, Science, English, and Urdu.
- **Bilingual Filter**: Toggle between English (🇬🇧) and Urdu (🇵🇰) content.
- **Dynamic Results Count**: Real-time counter showing matching content with friendly empty states.

### 1.3 Personal Shelves
- **💖 My Favorite Videos Shelf**: Children can heart any video on cards or inside the player. All saved favorites appear in a dedicated home shelf.
- **🕒 Continue Watching Shelf**: Automatically remembers watched videos from the activity log so kids can resume easily.
- **🔥 Popular Videos Carousel**: Highlighting the most-watched educational videos.
- **⭐ Daily Star Challenges**: Kids collect stars for watching videos (+2 stars), completing games (+10 stars), and study alarms (+5 stars).

---

## 📓 2. My Notebook (`/notebook`)

A complete digital writing, drawing, and learning workstation designed for early learners:

### 2.1 ✍️ Handwriting Pad with Alphabet Tracing
- **English Alphabet (A–Z)**:
  - Uppercase and lowercase mode toggles.
  - Phonics sound button reading the letter and example word out loud (e.g., "Letter A: A is for Apple!").
  - Dotted letter guide background canvas that children trace over directly.
- **Urdu Alphabet (حروف تہجی: ا، ب، پ، ت، ٹ، ث، ج، چ، ح، خ...)**:
  - Full Urdu letter tracing support with letter guides and Urdu audio pronunciation.
- **Responsive Drawing Mechanics**:
  - Smooth HTML5 canvas with mouse and touch support.
  - 12 kid-friendly colors, eraser, 4 brush thicknesses, and board clear.

### 2.2 🎨 Draw Along Step-by-Step Templates
- Step-by-step drawing templates for 6 cute items: Kitten 🐱, Star 🌟, Tree 🌳, Butterfly 🦋, House 🏠, and Car 🚗.
- 4-step progressive visual cards showing exact geometric shapes to sketch.

### 2.3 📝 Lined Learning Notes
- Notebook-ruled lined paper for typing study summaries, poems, and vocabulary notes.

### 2.4 🖼️ Private Keepsake Gallery & PDF Export
- **Private Gallery**: Saves all drawings locally with timestamps and category tags.
- **🖨️ PDF Keepsake / Printable Export**: Formatted with `@media print` styles so parents can print or save their child's artwork as high-resolution PDF keepsakes.
- **Share to Kids Corner**: Direct bridge to submit drawings to the Safe Kids Corner moderation queue.

---

## ⏰ 3. Smart Reminders & Study Alarms

A positive, structured daily routine system created for parents and children:

- **Parent PIN Protection**: Only parents can configure, edit, or delete study schedules inside the Parent Dashboard (`/parent`).
- **Flexible Scheduling**: Set task title (e.g. "🎵 Daily Poem Practice", "🔢 Math Fun Quiz"), time of day, target subject, and star reward (+5 ⭐).
- **Friendly Child Alert Banner**:
  - Pops up directly in the top navigation bar when scheduled time arrives.
  - **🚀 Start Now**: Awards stars, completes the task, advances the study streak (`🔥 X days`), and plays victory fanfare.
  - **⏳ Snooze (5m)**: Snoozes reminder for 5 minutes before gently re-alerting.
- **Screen Time & Bedtime Respect**: Alarms stay quiet during screen time lockout and bedtime quiet hours.

---

## 🛡️ 4. Safe Kids Corner (`/corner`)

A safe community showcase that eliminates the privacy risks and social pressures of traditional social feeds:

- **Parent Opt-In Required**: Parents explicitly grant or revoke posting permission from the Parent Dashboard.
- **100% In-App Art Only**: Creations originate solely from the in-app Notebook canvas (zero camera permissions, zero photo uploads; faces and private locations never leak).
- **Nicknames & Avatars Only**: No real names, emails, or personal identities.
- **Preset Sticker Reactions Only**: No comment textboxes and no private messaging. Other kids react using 4 preset stickers: `🎨 Artist`, `🌟 Super Star`, `👏 Bravo`, `💖 Love`.
- **Pre-Moderation Queue (`/admin`)**: All posts are pre-scanned by AI safety checks (100% Kid Safe Art) and held for human administrator approval before going public.
- **No Followers or Like Ranking**: Rewarding effort rather than popularity through weekly challenges (e.g. "🌳 Dream Treehouse") and the "🌟 Featured of the Week" showcase.

---

## 🎬 5. Safe Watch Player Experience (`/watch/[id]`)

### 5.1 Distraction-Free Playback
- **Curated YouTube Embed**: Uses `modestbranding=1`, `rel=0`, and `playsinline=1` to eliminate external algorithmic rabbit holes and unwanted recommendations.
- **Category Lock Protection**: If a parent blocks a category, any direct link to a video in that category is securely blocked with a friendly mascot shield.
- **Bedtime Sleep Lockout**: Videos cannot be played when Bedtime Mode is active.
- **Screen Time Auto-Lock**: Automatically locks the player with a friendly dinosaur bedtime screen once daily screen time is exhausted.

### 5.2 Interactive Video Features
- **One-Click Favorite**: Heart button to bookmark videos.
- **Safe Kid Reactions**: Children can tap 4 safe emoji reaction buttons (❤️ Love it, 😂 Funny, 💡 Smart, 🌟 Super) with audio feedback and persistent reaction counters.
- **Theater / Big Screen Mode**: Expands the video player to a wide cinematic format.
- **Health Tip (Eye Rest)**: Friendly banner reminding kids to blink, look away at green objects, and stretch their shoulders.
- **Up Next Recommendations**: Curated related videos from the same educational category.

---

## 🎮 6. Interactive Mini-Games Suite (`/games`)

All games feature real-time win detection, sound effects, and award **+10 stars** upon victory.

1. **🃏 Memory Match (`/games/memory-match`)**: 16 cards (8 pairs of animal emojis), 3D flip animations, matched pair tracker.
2. **🧮 Math Quiz (`/games/math-quiz`)**: Procedural addition & subtraction questions with score tracker.
3. **🐝 Spelling Bee (`/games/spelling-bee`)**: Visual hints, scrambled letter tiles pool, word validation.
4. **🎨 Coloring Book (`/games/coloring-book`)**: 12 colors, 4 brush thicknesses, cute templates, stamps, and PNG artwork export.
5. **🦁 Animal Puzzle (`/games/animal-puzzle`)**: 3x3 sliding/tile-swap jigsaw puzzle with cute animals and move tracking.
6. **🎈 Balloon Pop (`/games/balloon-pop`)**: Floating balloons popping with bubbly audio sound effects.
7. **🎹 Magic Piano (`/games/magic-piano`)**: Playable 8-key rainbow musical keyboard with real Web Audio frequencies.
8. **🦖 Dino Runner (`/games/dino-runner`)**: Prehistoric 2D endless obstacle jumper with physics jump mechanics.
9. **🍓 Fruit Catcher (`/games/fruit-catcher`)**: Moveable basket to catch healthy falling fruits and dodge thunder clouds.

---

## 🔊 7. Web Audio Synthesizer (`src/lib/sound.ts`)

- **Zero Asset Dependencies**: Uses the standard browser Web Audio API oscillator nodes (`sine`, `triangle`, `sawtooth`).
- **Sound Effects**:
  - `playPop()` / `playClick()`: Bubbly ramp for button clicks, balloon pops, and card selections.
  - `playStar()` / `playStarSound()`: 4-note ascending chime (C5, E5, G5, C6) when collecting stars.
  - `playWin()` / `playFanfare()`: Victorious fanfare melody upon game and reminder completion.
  - `playWrong()`: Gentle cartoon boing for wrong quiz attempts.
- **Mute / Unmute**: Accessible from the child top navigation bar (🔊 / 🔇).

---

## 🛡️ 8. Parental Control Portal (`/parent`)

- **PIN Verification**: 4-digit numeric keypad with shake animations for incorrect entries (Demo default: `1234`).
- **Configurable PIN**: Parents can change the PIN at any time.
- **Screen Time Manager**:
  - Choose daily limits: 30m, 45m, 60m, 90m, or 120m.
  - Color-coded progress bar (Green → Yellow → Red).
  - **+15 Min Bonus**: 1-click reward button to grant bonus screen time.
- **🌙 Bedtime Sleep Lock Schedule**:
  - Configurable bedtime hours: Off, 7:00 PM, 8:00 PM, 9:00 PM, or 10:00 PM.
  - Automatically disables player and child feed during sleep hours.
- **⏰ Smart Study Alarms Manager**:
  - Add, pause, or remove scheduled routine alarms.
- **🛡️ Safe Kids Corner Opt-In**:
  - Master toggle allowing or restricting child from submitting creations to the community.
- **👶 Content Age Restriction**:
  - Restricts content to Early Learners (Ages 6–7), Older Kids (Ages 8–10), or All Ages.
- **Category Blocking**:
  - Individual toggle switches to completely hide or show Cartoons, Poems, Math, Science, English, or Urdu.
- **📊 Subject Breakdown Analytics**:
  - Progress bars displaying the percentage and minutes spent on each topic today.
- **Watch Activity Log**:
  - Detailed list of watched videos with timestamps and one-click clear history.

---

## 🛠️ 9. Admin Management Dashboard (`/admin`)

- **Credentials**: `admin` / `kidotube2024`.
- **Overview Analytics**:
  - Total Videos, Games, Views, Safety Reports, and Pending Reviews.
- **🎬 Video Library Manager**:
  - Add new videos via YouTube ID/URL, assigning metadata, categories, and age groups.
- **🎮 Games Directory**:
  - Status overview for all 9 interactive games.
- **🛡️ Kids Corner Moderation Queue**:
  - Inspect AI scan scores (100% Safe Art).
  - One-click Approve, Feature of the Week, or Reject.
- **📈 Content Distribution**:
  - Comparative bar charts showing views and video density per educational category.
