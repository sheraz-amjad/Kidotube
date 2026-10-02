# KidoTube App Store & Play Store Readiness Guide

## 1. App Store Metadata

- **App Name**: KidoTube Safe: Kids Fun & Learn
- **Short Name**: KidoTube
- **Subtitle / Tagline**: Safe, Ad-Free Learning & Videos for Kids (Ages 6–10)
- **Primary Category**: Education / Kids
- **Secondary Category**: Entertainment
- **Age Rating**:
  - Google Play: Ages 6–8 and 9–11 (Teacher Approved / Designed for Families)
  - Apple App Store: Made for Kids (Ages 6–8 and 9–11)

### Short Description (Google Play - 80 chars max)
> Safe, ad-free learning and fun for kids 6-10 with parent-controlled screen time.

### Full Description
> Welcome to KidoTube — the child-safe learning and entertainment platform designed specifically for kids aged 6 to 10.
>
> 🌟 WHY PARENTS TRUST KIDOTUBE:
> • 100% Curated & Safe: Handpicked poems, cartoons, lessons, and stories.
> • Zero Open Web: No algorithm rabbit-holes, no external web browsing, and no user comments.
> • Smart Parental Remote: Set daily screen-time limits, bedtime hours, and study alarms that ring even when the app is resting.
> • Dual-Device Pairing: Pair your child's tablet or phone with a simple 6-digit family code — no child email or password required.
>
> 🎨 CREATIVE LEARNING & NOTEBOOK:
> • Step-by-step drawing studio with coloring and drawing guides.
> • Handwriting pad with English and Urdu letter tracing.
> • Export keepsakes directly to PDF for family memories.
>
> 🎮 EDUCATIONAL MINI-GAMES:
> • 9 offline-ready educational games covering Math, Vocabulary, Memory, Rhymes, and Logic.
> • Earn stars, unlock celebratory badges, and build daily learning streaks!
>
> 🛡️ PRIVACY & SAFETY FIRST:
> • Zero ads, zero third-party trackers, zero in-app purchases.
> • Compliant with COPPA and GDPR-K standards.

---

## 2. Regulatory & Store Compliance Checklists

### 2.1 Google Play "Designed for Families" Policy
- [x] **Target Audience**: Explicitly declared as Ages 6–8 and 9–11.
- [x] **Ad Networks**: ZERO third-party advertising SDKs present in code.
- [x] **Data Safety**:
  - Personal Info: Does NOT collect name, email, phone number, address, or child identity.
  - Device IDs: Does NOT collect advertising ID or persistent hardware identifiers.
  - Analytics: Only anonymized local session telemetry if enabled.
- [x] **Parental Gate**: Accessing settings, parent dashboard, or external actions requires 4-digit Parent PIN.

### 2.2 Apple Kids Category Requirements
- [x] **Guideline 1.3 (Kids Category)**:
  - Links out of the app or parent areas are guarded by a parental gate (PIN wall).
  - No behavioral advertising or tracking across third-party websites or services.
  - In-app purchases: None visible or accessible to children.
- [x] **Guideline 5.1.4 (Children's Privacy)**:
  - No personal data collected from children; nicknames and avatars only.
  - Audio and camera access: Strictly restricted; drawing is done on standard canvas with no camera feed.

### 2.3 COPPA (Children's Online Privacy Protection Act) & GDPR-K
- **Verifiable Parental Consent**: Parent creates account via email and sets family PIN before child device pairing.
- **Data Minimization**: Kids do not provide names, photos, voice recordings, or geolocations.

---

## 3. Human Actions & Pre-Launch Checklist

| Item | Responsible | Status | Notes |
|---|---|---|---|
| Google Play Console Account ($25 one-time) | Account Owner | 🟡 Action Required | Register organization or individual account |
| Apple Developer Program ($99/annual) | Account Owner | 🟡 Action Required | Enroll organization D-U-N-S or individual |
| Production Keystore & Signing Keys | DevOps / Release Lead | 🟡 Action Required | Generate `kidotube-release.keystore` |
| Privacy Policy URL Live Hosting | Webmaster | ✅ Ready | Live at `https://kidotube.syedsheraz.me/privacy` |
| Store Screenshots (Tablet & Phone) | Design Lead | ✅ Ready | Captured under `reports/screenshots/` |
