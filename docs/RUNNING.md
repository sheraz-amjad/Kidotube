# 🏃 How to Run KidoTube Locally & Run Tests

This document describes the exact steps to install dependencies, run the KidoTube web application locally, run automated tests across unit, integration, accessibility, and end-to-end suites, and build mobile artifacts.

---

## 1. Prerequisites

- **Node.js**: v20+ or v22+ (verified working on v22 and v24)
- **npm**: v10+ or v11+
- **Git**
- Optional for Android Native Build: Java JDK 17+, Android SDK, Gradle

---

## 2. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env.local
```

Default variables in `.env.example`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
JWT_SECRET=kidotube_dev_secret_key_change_in_production
PARENT_DEFAULT_PIN=1234
```

---

## 3. Installation & Local Development

Install project dependencies:

```bash
npm install
```

Start the local Next.js development server:

```bash
npm run dev
```

The application will be accessible at:
- **Child Home Portal**: [http://localhost:3000](http://localhost:3000)
- **Parent Dashboard**: [http://localhost:3000/parent](http://localhost:3000/parent) (Default PIN: `1234`)
- **My Notebook**: [http://localhost:3000/notebook](http://localhost:3000/notebook)
- **Safe Kids Corner**: [http://localhost:3000/corner](http://localhost:3000/corner)
- **Games Suite (9 Games)**: [http://localhost:3000/games](http://localhost:3000/games)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) (User: `admin` / Pass: `kidotube2024`)
- **App Download & Pairing**: [http://localhost:3000/download](http://localhost:3000/download)

---

## 4. Production Build & Start

To validate production compilation locally:

```bash
npm run build
npm start
```

Runs the optimized production bundle on port 3000.

---

## 5. Running Automated Tests

### 5.1 Run All Tests (Single Command)
```bash
npm run test:all
```
This runs unit tests, API tests, accessibility audits, and Playwright end-to-end tests across all configured device viewports and browsers.

### 5.2 Unit & API Logic Tests
```bash
npm run test
# Or with watch mode:
npm run test:watch
```

### 5.3 Playwright End-to-End Suite
First, ensure Playwright browsers are installed:
```bash
npx playwright install --with-deps
```

Run Playwright tests across Chromium, Firefox, WebKit, and mobile viewports:
```bash
npm run test:e2e
```

Run in UI / interactive mode:
```bash
npx playwright test --ui
```

Generate HTML test report:
```bash
npx playwright show-report reports/playwright-report
```

### 5.4 Accessibility (a11y) Audits
```bash
npm run test:a11y
```

### 5.5 Linting & Type Checking
```bash
npm run lint
npx tsc --noEmit
```

---

## 6. Building the Mobile App (PWA & Capacitor)

### 6.1 Install as PWA
Visit [http://localhost:3000/download](http://localhost:3000/download) on any mobile browser (Chrome/Safari) or desktop browser, and click **"Install KidoTube on This Device"**.

### 6.2 Native Android App Build via Capacitor
Sync web assets into the Android native container:
```bash
npm run cap:sync
```

Open in Android Studio or compile debug APK with Gradle:
```bash
npm run cap:build:android
# Or run on connected emulator/device:
npx cap run android
```

Output APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`
