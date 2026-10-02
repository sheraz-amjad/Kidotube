# KidoTube Automated QA Test Report — Baseline (Before Fixes)

- **Date / Timestamp**: 2026-10-02T14:15:00Z
- **Git Branch**: `qa/full-test-and-app`
- **Environment**: Next.js 16.3.8 (Turbopack), Node.js v24.15.0, Windows 11
- **Testing Frameworks**: Vitest v5.0.3 (Unit & API), Playwright v1.63.0 (E2E & Multi-Device), @axe-core/playwright v4.13.0
- **Overall Verdict**: 🟡 **Not Ready (Defects Detected — Baseline Run)**

---

## 1. Executive Summary

| Test Area | Total Tests | Passed | Failed | Blocked / Untestable | Pass Rate | Status |
|---|---|---|---|---|---|---|
| **Unit & Platform Logic** | 11 | 11 | 0 | 0 | 100% | ✅ Passed |
| **API Endpoints & RBAC** | 9 | 9 | 0 | 0 | 100% | ✅ Passed |
| **E2E Functional & Device (Chromium)** | 42 | 36 | 6 | 0 | 85.7% | ❌ Defects |
| **E2E Multi-Device (Firefox)** | 14 | 10 | 4 | 0 | 71.4% | ❌ Defects |
| **E2E Multi-Device (WebKit/Safari)** | 21 | 15 | 6 | 0 | 71.4% | ❌ Defects |
| **A11y (Axe Core)** | 11 | 10 | 1 | 0 | 90.9% | ⚠️ Timeout |
| **Total Automated Suite** | **97** | **81** | **16** | **0** | **83.5%** | ❌ Baseline Fail |

---

## 2. Environment & Untestable Constraints

- **Supported & Tested**:
  - Small Phone: 360 x 640 (Chromium Mobile)
  - Modern Phone: 390 x 844 (Chromium, Firefox Mobile, WebKit iPhone 14)
  - Small Tablet: 768 x 1024 (Chromium iPad Mini)
  - Large Tablet: 834 x 1194 & 810 x 1080 (Chromium iPad Pro, WebKit iPad)
  - Laptop: 1366 x 768 (Chromium)
  - Desktop: 1920 x 1080 & 1440 x 900 (Chromium, Firefox, WebKit Desktop)
- **Honest Limitations**:
  - Physical iPhone/iPad hardware cannot be connected directly in this headless Windows testbed; WebKit engine emulation with Apple device metrics (touch, pixel ratio, safe areas) is used. Real-device testing is documented for TestFlight and BrowserStack.
  - Push notification system UI prompts cannot be clicked in headless mode without user interaction; mocked via service worker event dispatcher.

---

## 3. Defect Log (Baseline)

### DEF-01: Pairing Code Generator Response Field Mismatch
- **Severity**: High (Core Multi-Device Pairing)
- **Affected Devices**: All browsers and viewports
- **Symptoms**: Clicking "Generate 6-Digit Family Code" on `/download` did not display the `KIDO-XXXX` code.
- **Root Cause**: `/api/parent/pair` returned `{ pairingCode: session.code }`, whereas client component expected `data.session.code`.
- **Status**: Open (Targeted for immediate fix).

### DEF-02: Horizontal Scroll Overflow on Mobile Firefox & WebKit
- **Severity**: Medium (Responsive & Usability)
- **Affected Devices**: `firefox-modern-phone` (390x844), `webkit-iphone` (390x844), `webkit-ipad` (810x1080)
- **Symptoms**: `bodyScrollWidth` reached 837px on a 390px viewport (`expected <= 395px`).
- **Root Cause**: `html, body` lacked `overflow-x: hidden` and `max-width: 100%`, causing flex rows to stretch scroll width.
- **Status**: Open (Targeted for immediate fix).

### DEF-03: Network Idle Timeout on Firefox Desktop
- **Severity**: Low (Test Harness Flakiness)
- **Affected Devices**: `firefox-desktop`
- **Symptoms**: `waitForLoadState('networkidle')` timed out at 30s.
- **Root Cause**: Persistent background interval / YouTube iframe streaming connections prevented `networkidle` state.
- **Fix**: Switch to `waitForLoadState('domcontentloaded')` or explicit selector wait.
- **Status**: Open (Targeted for immediate fix).

---

## 4. Child-Safety & Security Review (Baseline)

- **Open Search Check**: PASS. Search strictly filters local curated dataset. Zero open YouTube search bar or external Google query bar.
- **PII Leakage Prevention**: PASS. Kids Corner submit endpoint regex-rejects email addresses, telephone numbers, and HTTP hyperlinks.
- **PIN Wall**: PASS. Child cannot enter `/parent` or leave child mode without entering the 4-digit Parent PIN.
- **Tracking & Ads**: PASS. Zero Google AdSense, zero Facebook Pixel, zero third-party telemetry.
