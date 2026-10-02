# 🏗️ KidoTube — Technical Architecture & Implementation Guide

## 1. Technology Stack
- **Framework**: Next.js 16.3.8 (App Router with Turbopack)
- **Runtime & Library**: React 19, TypeScript 5
- **Styling Architecture**: Vanilla CSS with Scoped CSS Modules (`*.module.css`) and CSS Custom Properties
- **Audio Engine**: Pure HTML5 Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`)
- **Graphics & Games**: HTML5 2D Canvas API & React Hooks

---

## 2. Global State & Context Architecture (`src/lib/context.tsx`)

### 2.1 Unified Root Provider
To prevent state resets when navigating between routes, the `AppProvider` wraps the entire application at the root in [src/app/layout.tsx](file:///d:/kidotube/src/app/layout.tsx) via the client wrapper [src/components/Providers.tsx](file:///d:/kidotube/src/components/Providers.tsx).

```
RootLayout (server)
└── Providers (client)
    └── AppProvider (context)
        └── Page Component (Home, Category, Watch, Games, Parent, Admin)
```

### 2.2 Storage Schema (`localStorage: kidotube_state_v2`)
The application persists all user configurations and activity in `localStorage` under the key `kidotube_state_v2`:

```typescript
interface KidoTubePersistentState {
  parentPin: string;                   // 4-digit PIN (default '1234')
  screenTimeLimit: number;             // Daily limit in minutes (default 60)
  screenTimeUsed: number;              // Current consumed minutes
  bedtimeHour: number;                 // Bedtime hour 24h format (e.g. 20 for 8 PM)
  watchHistory: WatchEntry[];          // Chronological activity records
  stars: number;                       // Total accumulated reward stars
  blockedCategories: string[];         // Array of category IDs blocked by parent
  ageFilter: 'all' | '6-7' | '8-10';  // Content developmental filter
  favorites: string[];                 // Array of favorited video IDs
  childAvatar: string;                 // Selected mascot emoji (e.g. '🦄')
  soundEnabled: boolean;               // Master audio mute switch
  reactions: Record<string, Record<string, number>>; // Safe reaction counts per video
  customVideos: Video[];               // Admin-added custom videos
  lastActiveDate: string;              // Date string used for daily screen time resets
}
```

### 2.3 Daily Reset Logic
At mount, if `lastActiveDate !== new Date().toDateString()`, `screenTimeUsed` is automatically reset to `0`, ensuring children receive their daily screen time allowance fresh every morning.

---

## 3. Component Hierarchy & Route Map

```
src/
├── app/
│   ├── layout.tsx                     # Global Root Layout (Fonts, Metadata, Providers)
│   ├── globals.css                    # CSS variables & typography
│   ├── page.tsx                       # Child Home: Search, Avatar, Shelves, Categories
│   ├── category/[slug]/page.tsx       # Filtered Category View + Block Enforcement
│   ├── watch/[id]/page.tsx            # Embed Player, Reactions, Favorites, Screen Lock
│   ├── games/
│   │   ├── page.tsx                   # Games Hub with Category Filter Tabs
│   │   └── [slug]/page.tsx            # Game Router & Engines (6 Interactive Games)
│   ├── parent/page.tsx                # PIN Pad & Parent Management Dashboard
│   └── admin/page.tsx                 # Admin Auth, Add Video Modal, Analytics & Library
├── components/
│   ├── Providers.tsx                  # Client component providing AppContext to layout
│   ├── ChildHeader.tsx                # Top navigation, Avatar picker, Screen bar, Stars
│   ├── VideoCard.tsx                  # Card with favorite heart, language tag, duration
│   ├── CategoryCard.tsx               # Colorful category card with icon & video counter
│   └── GameCard.tsx                   # Playable game card with gradient & emoji
└── lib/
    ├── data.ts                        # Static datasets, interfaces, and query helpers
    ├── sound.ts                       # Web Audio API sound effect generator
    └── context.tsx                    # State provider and custom hook `useApp()`
```

---

## 4. Web Audio Synthesizer (`src/lib/sound.ts`)

KidoTube implements a client-side procedural sound synthesizer using the Web Audio API without requiring any external MP3/WAV downloads:

1. **Pop Sound (`playPop()`)**:
   - Uses a sine oscillator ramping from 400Hz to 800Hz in 80ms.
   - Exponential gain drop for a clean, non-clipping click.
2. **Star Chime (`playStar()`)**:
   - Staggered arpeggio across 4 harmonics: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046.5Hz).
   - Triangle waveform for a sparkling music box tone.
3. **Win Fanfare (`playWin()`)**:
   - Sequential melodic progression with sustain and decay.
4. **Wrong Sound (`playWrong()`)**:
   - Downward linear ramp on a sawtooth wave (260Hz to 140Hz) for a gentle cartoon boing.

---

## 5. Security & Safety Principles

1. **Sandboxed YouTube Embeds**: All video iframes use strict parameters:
   - `rel=0`: Disables related external videos.
   - `modestbranding=1`: Minimizes YouTube branding.
   - `playsinline=1`: Keeps playback inline.
2. **Category Shield**: If a category is blocked in the parent area:
   - It is removed from the home categories grid.
   - It is filtered out from search results.
   - If navigated to directly via URL, [category/[slug]/page.tsx](file:///d:/kidotube/src/app/category/%5Bslug%5D/page.tsx) and [watch/[id]/page.tsx](file:///d:/kidotube/src/app/watch/%5Bid%5D/page.tsx) display a friendly "Locked by Parents" banner instead of rendering the content.
3. **Bedtime Enforcement**: When the local device time passes the scheduled `bedtimeHour`, video and game access is replaced with a soothing bedtime prompt.
4. **Parent PIN Protection**: All parental controls require PIN entry, with visual shake feedback on failures and in-memory session protection.
