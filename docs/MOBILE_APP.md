# KidoTube Mobile App Architecture & Integration Guide

## 1. Technical Architecture & Approach

KidoTube adopts a **Unified Capacitor + Progressive Web App (PWA)** architecture.

### Why Capacitor + PWA?
1. **Single Source of Truth**: The Next.js web application and the mobile application share the exact same UI components, safety logic, responsive styling, and API client.
2. **Instant Cross-Device Sync**: Any change made by a parent on the desktop web dashboard (e.g. reducing screen time or adding a bedtime reminder) is delivered in real time to the child's mobile device via `/api/sync`.
3. **Hardware & Native OS Capabilities**:
   - Native push & local notifications for scheduled study alarms even when the app is backgrounded.
   - Screen-time lock overlay.
   - Smooth touch & stylus response for drawing pad with native palm rejection.
   - Biometric PIN authentication (FaceID/Fingerprint) on parent device.

```
+-------------------------------------------------------------+
|                      KidoTube Platform                      |
+------------------------------+------------------------------+
|     Desktop / Laptop Web     |     Mobile App (Capacitor)   |
|   (Parent Dashboard / Web)   |    (Android APK / iOS IPA)   |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     Next.js Backend API                     |
|  - /api/auth/signup & login                                 |
|  - /api/parent/pair & /api/child/verify-pair                |
|  - /api/sync (Real-time parental control settings)          |
|  - /api/corner/* (Pre-moderated safe sharing)               |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|               In-Memory & Production Storage                |
+-------------------------------------------------------------+
```

---

## 2. Parent-Child Dual Mode Design

### 2.1 Mode Separation
- **Parent Mode**: Full parental dashboard with daily screen-time sliders, study reminder creator, watch history inspection, category blocking, and notebook keepsake PDF export.
- **Child Mode**: Restricted, distraction-free interface with big tactile buttons, zero external links, zero ads, zero personal data collection, and locked settings.
- **PIN Wall**: Transitioning from Child Mode to Parent Mode strictly requires the 4-digit Parent PIN (or device biometrics on native mobile).

### 2.2 Device Pairing Workflow
1. Parent opens the KidoTube web dashboard or parent app on their phone.
2. Parent taps **"Pair a Child's Device"** -> Generates a 6-digit code (e.g., `KIDO-4821`), valid for 15 minutes.
3. The child opens the KidoTube app on their own tablet or phone.
4. Child enters the 6-digit code.
5. The device receives a unique `deviceToken` and downloads the parent's current safety rules (screen-time limit, bedtime hour, blocked categories, study alarms).
6. Child device enters Child Mode and stays bound to that family account.

---

## 3. Native Reminders & Alarms

- **Study Reminders**: When parents set a reminder (e.g., "5:00 PM - Daily Poem Practice"), Capacitor Local Notifications schedules an alarm.
- **Quiet Hours**: Alarms will not ring if the device time falls within configured quiet hours (e.g. 8:00 PM – 7:00 AM).
- **Gamification**: When the child taps **Start** on the reminder alert and completes the activity, they receive +5 Stars and advance their study streak.

---

## 4. Offline Support

- All 9 educational mini-games (Math Balloon, Word Builder, Memory Match, Color Mixer, Shape Puzzle, Rhyme Finder, Galaxy Jump, Emotion Safari, Coding Bug) are fully implemented client-side with zero external assets required.
- The handwriting pad (English ABCs and Urdu tracing) and drawing board run entirely in HTML5 Canvas.
- Artwork and notes are stored in browser/device `localStorage` and `IndexedDB`.
- The PWA Service Worker (`/sw.js`) caches the core app shell so kids can draw and learn anywhere—even on airplanes or car trips.

---

## 5. Mobile App Packaging Steps

### 5.1 Android Package Build
```bash
# 1. Install Capacitor dependencies
npm i @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor configuration
npx cap init "KidoTube Safe" "com.kidotube.safe" --web-dir "out"

# 3. Add Android platform
npx cap add android

# 4. Sync web bundle
npx cap sync android

# 5. Open in Android Studio or compile APK via Gradle
cd android
./gradlew assembleDebug
```
The resulting debug APK is available at:
`android/app/build/outputs/apk/debug/app-debug.apk` and downloadable from the web download page at `/downloads/kidotube-debug.apk`.

### 5.2 iOS Package Build (Xcode / TestFlight)
```bash
# 1. Add iOS platform (on macOS host with Xcode 15+)
npm i @capacitor/ios
npx cap add ios
npx cap sync ios

# 2. Open Xcode
npx cap open ios

# 3. Configure Signing & Capabilities (Team ID & Bundle Identifier)
# 4. Build Archive -> Distribute to Apple TestFlight
```
