# 📋 KidoTube — Comprehensive QA Test Plan

This test plan defines the testing strategy, test cases, device matrices, acceptance criteria, and child-safety verifications for KidoTube across web, responsive viewports, browsers, and mobile platforms.

---

## 1. Test Strategy & Priority Definitions

- **P0 (Critical)**: Child safety, COPPA/privacy compliance, parent security gates, data loss, app crashes. Any P0 failure blocks release.
- **P1 (High)**: Core learning features, game engines, study reminders, video player, notebook canvas, device pairing.
- **P2 (Medium)**: Layout anomalies on secondary viewports, sound toggle polish, search filters, non-blocking UI glitches.
- **P3 (Low)**: Minor aesthetic nuances, edge-case micro-animations, copy adjustments.

---

## 2. Test Cases Specification

### 2.1 Functional Tests (Area: `FUNC`)

| Test ID | Area | Title & Steps | Expected Result | Priority |
|---|---|---|---|---|
| `TC-FUNC-01` | Auth | Parent Signup & Login: Navigate to Parent Portal or sync screen. Enter email, password, and 4-digit PIN. | Account is created, JWT sync token generated, parent PIN securely saved. | P1 |
| `TC-FUNC-02` | Auth | Parent PIN Gate: From child mode, attempt to enter `/parent`. Enter wrong PIN, then correct PIN (`1234`). | Wrong PIN triggers visual shake animation and error. Correct PIN unlocks dashboard. | P0 |
| `TC-FUNC-03` | Auth | Child Mode Lockout: Once in Child mode, verify leaving to Parent area requires PIN prompt. | Child cannot navigate to `/parent` without PIN verification. | P0 |
| `TC-FUNC-04` | Child Profile | Mascot Selection: In ChildHeader, click avatar companion (🦄, 🦁, 🚀, 🐼, 🦖, 🐰, 🐶). | Selected companion updates immediately across header, notebook, and corner. | P2 |
| `TC-FUNC-05` | Video Library | Curated Video Playback: Open video from home shelf. Verify playback, titles, metadata. | Video plays smoothly via `youtube-nocookie.com`. Modest branding active. | P1 |
| `TC-FUNC-06` | Video Library | No External Navigation / No Comments: Verify no links allow leaving to youtube.com comments or channels. | Comments, external recommendation carousels, and channel links are completely absent. | P0 |
| `TC-FUNC-07` | Video Library | Category & Bilingual Filters: Filter by Cartoons, Poems, Math, Science, English, Urdu. | Catalog filters accurately. Dynamic results count updates correctly. | P1 |
| `TC-FUNC-08` | Games | 9 Mini-Games Load & Complete: Test each of the 9 games (Memory, Math, Spelling, Coloring, Puzzle, Balloon, Piano, Dino, Fruit). | Each game loads assets, plays audio feedback, completes win state, and awards +10 stars. | P1 |
| `TC-FUNC-09` | Notebook | Handwriting Tracing (English & Urdu): Select letter in `/notebook`. Trace over dotted guide canvas. Tap audio button. | Smooth canvas stroke rendering. Web Speech engine reads phonics/Urdu letter. | P1 |
| `TC-FUNC-10` | Notebook | Draw Along Step-by-Step: Select template (Cat, Star, Tree, House, Car). Follow 4 progressive steps. | Templates guide drawing accurately. Clear, undo, colors, and brush sizes respond. | P1 |
| `TC-FUNC-11` | Notebook | Private Keepsake Gallery & PDF Export: Save drawing. Open gallery. Click Print & PDF Export. | Saved in local private gallery. `@media print` styles format album keepsake cleanly. | P1 |
| `TC-FUNC-12` | Reminders | Study Alarm Configuration: In `/parent`, add scheduled alarm (e.g., "Daily Poem Practice at 17:00"). | Alarm is persisted with time, target subject, and reward stars. | P1 |
| `TC-FUNC-13` | Reminders | Child Alert & Streak: When clock reaches alarm time, verify alert in child header. Click "Start Now". | Top banner pops up. "Start Now" awards +5 stars, advances daily streak (`🔥 X days`), plays victory fanfare. | P1 |
| `TC-FUNC-14` | Reminders | Snooze & Quiet Hours: Click "Snooze (5m)" on active alarm. Verify alarm stays silent during Bedtime mode. | Alarm disappears for 5 minutes. During bedtime or screen-time lock, alarm stays silent. | P1 |
| `TC-FUNC-15` | Screen Time | Daily Time Limit Lockout: Set screen time to 15m. Consume time or trigger lock. | Screen time progress bar updates. Player and home screen lock with dinosaur sleep shield. | P0 |
| `TC-FUNC-16` | Screen Time | Parent Bonus Time: In `/parent`, click `+15 Min Bonus`. | Screen time limit increases immediately by 15 minutes and child mode unlocks. | P1 |
| `TC-FUNC-17` | Parent Controls | Category Blocking: In `/parent`, toggle "Cartoons" to blocked. Navigate to child portal. | Cartoons category and all cartoon videos are hidden. Direct URL `/category/cartoons` shows locked shield. | P0 |
| `TC-FUNC-18` | Kids Corner | Parent Opt-In Requirement: Ensure parent opt-in is disabled. Try submitting from `/notebook`. | Submission blocked with notice: "Parent permission required in Parent Dashboard". | P0 |
| `TC-FUNC-19` | Kids Corner | Safe Posting & Preset Reactions: Enable opt-in. Submit drawing. In `/corner`, react with preset sticker (`🎨`, `🌟`). | Post submitted with nickname/avatar. Only preset sticker reactions permitted. No text input/DMs. | P0 |
| `TC-FUNC-20` | Admin | Content Moderation Queue: In `/admin`, view submitted drawing. Check AI Safe Scan. Approve and Feature. | Appears in moderation queue. Upon approval, displays in public Kids Corner with "Featured of Week" badge. | P1 |
| `TC-FUNC-21` | Pairing | Mobile & Web Device Pairing: In `/download`, generate 6-digit pairing code. Enter code on child device. | Child device links to parent account and receives synchronized parental controls. | P1 |

---

### 2.2 Child-Safety & Privacy Tests (Area: `SAFE` — All P0 Critical)

| Test ID | Title & Steps | Expected Result | Priority |
|---|---|---|---|
| `TC-SAFE-01` | No Open Search or External Web Links: Input arbitrary search queries (e.g., external sites, unmoderated keywords). | Search queries query *only* local approved video database. No external web query or link escapes. | P0 |
| `TC-SAFE-02` | Zero Personal Information Collection: Check child registration and usage flows. | Child never provides real name, email, phone number, school, or location. Mascots & nicknames only. | P0 |
| `TC-SAFE-03` | Zero Commercial Advertisements & Trackers: Inspect network requests and DOM in child mode. | No third-party ad networks, Google Analytics tracking scripts, or commercial marketing SDKs in child mode. | P0 |
| `TC-SAFE-04` | No Camera or Direct Photo Upload: Verify image creation in Notebook and Kids Corner. | Submissions originate *exclusively* from HTML5 in-app drawing board canvas (`toDataURL`). Zero file picker/camera uploads. | P0 |
| `TC-SAFE-05` | Metadata Stripping: Inspect saved canvas drawings and exported data. | Canvas export is clean raw PNG data without EXIF metadata, GPS coordinates, or device identifiers. | P0 |
| `TC-SAFE-06` | URL Tampering & Route Isolation: In child mode, manually change URL to `/parent` or `/admin`. | Forced PIN/credentials prompt intercepts. Child cannot bypass gates via URL manipulation. | P0 |
| `TC-SAFE-07` | Role-Based Data Isolation: Test multi-tenant API calls with different tokens. | Parent A cannot access Parent B's child profiles, notebooks, history, or pairing tokens. | P0 |

---

### 2.3 Responsive & Device Viewports (Area: `RESP`)

Target viewports to test:
1. **Small Phone**: `360 x 640` (portrait & landscape)
2. **Modern Phone**: `390 x 844` (iPhone 12/13/14/15) and `412 x 915` (Pixel 7 / Galaxy S)
3. **Small Tablet**: `768 x 1024` (iPad Mini / Portrait Tablet)
4. **Large Tablet**: `820 x 1180` (iPad Air) and `1024 x 1366` (iPad Pro)
5. **Laptop**: `1366 x 768` and `1440 x 900`
6. **Desktop**: `1920 x 1080` and `2560 x 1440` (4K / Ultrawide)

| Test ID | Viewport | Checkpoints | Expected Result | Priority |
|---|---|---|---|---|
| `TC-RESP-01` | Small Phone (360x640) | Header layout, touch target size (>= 44x44px), zero horizontal scroll. | Clean wrap, readable fonts, no overlapping pills or buttons. | P1 |
| `TC-RESP-02` | Modern Phone (390x844) | Watch player aspect ratio, game canvas responsiveness, safe area insets. | 16:9 responsive video wrapper, game canvas adapts to width without clipping. | P1 |
| `TC-RESP-03` | Tablet (768x1024, 820x1180) | Drawing canvas sizing, game touch controls, category grids. | Comfortable drawing space, 2-3 column responsive cards grid. | P1 |
| `TC-RESP-04` | Desktop (1920x1080, 2560x1440) | Max-width containers, typography scaling, theater mode expansion. | Content centered up to 1280px container, crisp icons and font rendering. | P1 |

---

### 2.4 Browser Matrix (Area: `BROWSER`)

| Browser Engine | Representative Browsers | Target Platforms | Focus Areas |
|---|---|---|---|
| **Chromium** | Google Chrome, Microsoft Edge, Brave, Android Chrome | Windows, macOS, Android, Linux | CSS Grid/Flexbox, Web Audio API, Web Speech API, Service Worker |
| **Firefox (Gecko)** | Mozilla Firefox | Windows, macOS, Linux, Android | Canvas drawing performance, Web Audio oscillators, print CSS |
| **WebKit** | Apple Safari, iOS Safari, iPadOS | macOS, iOS, iPadOS | Touch event handling (`touchstart`/`touchmove`), 100vh viewport height, iframe sandbox |

---

### 2.5 Accessibility Tests (Area: `A11Y`)

| Test ID | Area | Checkpoint | Expected Result | Priority |
|---|---|---|---|---|
| `TC-A11Y-01` | Automated Audit | Run `@axe-core/playwright` on all main pages. | Zero Critical or Serious accessibility violations. | P1 |
| `TC-A11Y-02` | Keyboard Navigation | Tab through header, category pills, watch player, and parent PIN pad. | Focus rings are clearly visible; all interactive elements reachable without mouse. | P1 |
| `TC-A11Y-03` | Touch Target Sizes | Verify touch targets of buttons, avatar switches, and navigation icons. | Minimum target size is 44 x 44 px for child and mobile usability. | P1 |
| `TC-A11Y-04` | Color Contrast & Readability | Check text contrast against backgrounds across all 5 themes. | Contrast ratio >= 4.5:1 for normal text and >= 3:1 for large headings (WCAG AA). | P1 |
| `TC-A11Y-05` | Screen Reader & Labels | Check `aria-label`, `alt` attributes on images, and semantic HTML5 headings. | Meaningful labels on all icon buttons (sound toggle, avatar selector, favorite). | P1 |

---

### 2.6 Performance Tests (Area: `PERF`)

| Test ID | Metric | Target Threshold | Scope |
|---|---|---|---|
| `TC-PERF-01` | First Contentful Paint (FCP) | < 1.8s (Good) | Main landing, watch page, games hub |
| `TC-PERF-02` | Largest Contentful Paint (LCP) | < 2.5s (Good) | Video player, categories, notebook |
| `TC-PERF-03` | Cumulative Layout Shift (CLS) | < 0.1 (Good) | Dynamic theme shifts, ad-free layouts |
| `TC-PERF-04` | Offline / Slow 3G Handling | Graceful degradation | Cached assets, offline games, local notebook drawing |

---

### 2.7 Security & Non-Destructive Vulnerability Tests (Area: `SEC`)

| Test ID | Checkpoint | Steps | Expected Result | Priority |
|---|---|---|---|---|
| `TC-SEC-01` | PIN Brute Force Defense | Enter wrong PIN 5 consecutive times in Parent area. | Rate limiter / progressive cooldown delays and locks out automated brute force attempts. | P0 |
| `TC-SEC-02` | API Input Validation & Sanitization | Inject XSS payloads (`<script>`, SQL fragments) in post title or custom video inputs. | Inputs are strictly validated and escaped. No executable scripts stored or rendered. | P0 |
| `TC-SEC-03` | Security Headers | Check Nginx / Next.js response headers on live site and local endpoints. | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. | P1 |
| `TC-SEC-04` | Dependency Audit | Run `npm audit` to check for known vulnerabilities in third-party packages. | Zero Critical or High vulnerabilities. | P1 |

---

### 2.8 PWA, Mobile & Offline Tests (Area: `PWA`)

| Test ID | Checkpoint | Steps | Expected Result | Priority |
|---|---|---|---|---|
| `TC-PWA-01` | Web App Manifest | Validate `/manifest.json` or `/manifest.webmanifest`. | Valid `name`, `short_name`, `theme_color`, `background_color`, `display: standalone`, and icons (192px, 512px). | P1 |
| `TC-PWA-02` | Service Worker Caching | Load app, disconnect network (offline mode), refresh page. | Cached shell, games, and notebook canvas load and remain fully interactive offline. | P1 |
| `TC-PWA-03` | Install Prompt | Trigger PWA installation on desktop / Android browser. | Install banner / prompt initiates seamlessly and installs to home screen / app launcher. | P1 |
