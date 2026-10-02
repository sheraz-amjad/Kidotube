# 🗺️ KidoTube — Application Map, Routes, Roles & API Endpoints

This document maps every page, route, user role, and API endpoint across the KidoTube ecosystem.

---

## 1. User Roles & Access Matrix

| Role | Access Scope | Authentication Mechanism | Child-Safety Boundary |
|---|---|---|---|
| **Child (Default Mode)** | Home (`/`), Watch (`/watch/[id]`), Category (`/category/[slug]`), Games (`/games`, `/games/[slug]`), Notebook (`/notebook`), Safe Kids Corner (`/corner`), App Download (`/download`) | None / Mascot Avatar Selection. Linked to parent via device pairing code or local session. | **Strictly enforced**. No external links, no open search, no ads, no trackers, pre-moderated content only, no freeform comments or DMs, lockouts for bedtime & screen time. |
| **Parent** | Parent Dashboard (`/parent`), Account Settings, Pairing Manager, PIN Management, Category Filters, Reminders Manager, Kids Corner Permissions, Notebook PDF Export | 4-Digit Parent PIN (local) + Optional Parent Cloud Account (email/password) for remote sync and device pairing. | Can unlock child restrictions, view learning stats, manage screen time limits, and export child creations. |
| **Administrator** | Admin Dashboard (`/admin`), Kids Corner Moderation Queue, Video Library Management, Platform Analytics | Admin Credentials (`admin` / `kidotube2024` or secure token) | Full content approval and moderation authority. Unapproved submissions cannot go live. |

---

## 2. Frontend Page Routes

### 2.1 Child Experience
| Path | Component | Purpose | Permissions / Protection |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Main child portal: curated educational videos, category pills, mascot avatars, favorites shelf, continue watching shelf, games showcase, theme switcher. | Public / Child Mode. Gated by Bedtime Mode and Screen Time Limit. |
| `/category/[slug]` | `src/app/category/[slug]/page.tsx` | Filtered video catalog by subject (`cartoons`, `poems`, `math`, `science`, `english`, `urdu`). | Gated by Parent Category Lock and Bedtime/Screen-Time lockouts. |
| `/watch/[id]` | `src/app/watch/[id]/page.tsx` | Safe video player: curated YouTube embed via `youtube-nocookie.com`, safe emoji reactions, speech narration, eye-rest reminder, related safe videos. | Gated by Screen-Time limit, Bedtime mode, and Category locks. |
| `/games` | `src/app/games/page.tsx` | Interactive educational games hub with subject tabs. | Gated by Bedtime & Screen Time. |
| `/games/[slug]` | `src/app/games/[slug]/page.tsx` | 9 full interactive games: Memory Match, Math Quiz, Spelling Bee, Coloring Book, Animal Puzzle, Balloon Pop, Magic Piano, Dino Runner, Fruit Catcher. | Awards stars upon victory. Touch and keyboard enabled. |
| `/notebook` | `src/app/notebook/page.tsx` | My Notebook: Dual-language handwriting alphabet tracing (English A–Z, Urdu حروف تہجی), step-by-step Draw Along guides, lined notes, private keepsake gallery, PDF print export, one-tap Kids Corner share. | Private by default. Protected against external data leakage. |
| `/corner` | `src/app/corner/page.tsx` | Safe Kids Corner: Community creative showcase, weekly challenges, preset sticker cheers (`🎨`, `🌟`, `👏`, `💖`), featured of the week. | Requires Parent Opt-In to submit. No text comments, no DMs, nicknames only. |
| `/download` | `src/app/download/page.tsx` | Native App Download & Device Pairing: Store badges, direct APK download, PWA install button, device detection, and one-time Parent-Child Pairing Code / QR flow. | Informational & interactive pairing. |

### 2.2 Parental Management
| Path | Component | Purpose | Protection |
|---|---|---|---|
| `/parent` | `src/app/parent/page.tsx` | Parent Portal: Screen time slider, +15m bonus time, bedtime sleep lock schedule, age group filter (6-7, 8-10, all), category block toggles, smart study alarm scheduler, Kids Corner opt-in permission, PIN change, learning analytics, watch history. | Protected by 4-digit Parent PIN pad with brute-force shake feedback. |

### 2.3 Administration
| Path | Component | Purpose | Protection |
|---|---|---|---|
| `/admin` | `src/app/admin/page.tsx` | Admin Panel: Platform overview stats, add video modal, video catalog management, games directory, Kids Corner Moderation Queue (approve/reject/feature submissions with AI safe-scan indicators). | Protected by Admin credentials. |

---

## 3. Backend REST API Endpoints

| Method | Endpoint | Description | Roles | Request / Response |
|---|---|---|---|---|
| `POST` | `/api/auth/signup` | Parent registration for multi-device sync | Public | `{ email, password, pin }` -> `{ token, user }` |
| `POST` | `/api/auth/login` | Parent login for multi-device sync | Public | `{ email, password }` -> `{ token, user }` |
| `GET` | `/api/auth/profile` | Retrieve authenticated parent profile & children | Parent | Header: `Authorization: Bearer <token>` |
| `POST` | `/api/parent/pair` | Generate 6-digit one-time device pairing code & QR payload | Parent | `{ childProfileId, childNickname }` -> `{ pairingCode, expiresAt, qrData }` |
| `POST` | `/api/child/verify-pair` | Child device exchanges 6-digit pairing code for device sync token | Child Device | `{ pairingCode }` -> `{ syncToken, parentSettings, childProfile }` |
| `GET` | `/api/sync` | Pull latest parent settings (screen time, blocked categories, reminders) | Parent / Child Device | Returns `{ screenTimeLimit, reminders, blockedCategories, allowKidsCorner, bedtimeHour }` |
| `POST` | `/api/sync` | Update parent settings from mobile app or web dashboard | Parent | Syncs settings to server |
| `GET` | `/api/corner/posts` | List approved Kids Corner posts & weekly challenges | Public / Child | Filtered by `approved: true` |
| `POST` | `/api/corner/submit` | Submit child notebook drawing to moderation queue | Child (Opted-in) | `{ title, artworkUrl, category, childNickname, childAvatar }` -> status `pending` |
| `POST` | `/api/corner/react` | Add preset sticker reaction to a post | Child | `{ postId, sticker }` (restricted to preset stickers) |
| `GET` | `/api/admin/moderation` | List all posts including pending for review | Admin | Admin token required |
| `POST` | `/api/admin/moderation` | Approve, feature, or reject submitted creation | Admin | `{ postId, action: 'approve' \| 'feature' \| 'delete' }` |
| `GET` | `/api/health` | Health check endpoint | Public | `{ status: 'ok', timestamp, version }` |

---

## 4. Key Design & State Tokens

- **Themes**: `sunshine` (default), `cosmic`, `safari`, `candy`, `ocean`
- **Mascots**: 🦄 Sparkle, 🦁 Leo, 🚀 Astro, 🐼 Panda, 🦖 Rex, 🐰 Bunny, 🐶 Puppy
- **Audio Synthesizer**: Zero-asset Web Audio API in `src/lib/sound.ts` with Web Speech API for TTS reading.
- **Offline / Local Fallback**: All critical features (games, drawing, tracing, alarms, screen-time monitor) function seamlessly offline via `localStorage` and service worker cache.
