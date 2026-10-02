import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  workers: 1, // Stable single-worker execution on Windows
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/raw/playwright-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    // --- Chromium Viewports ---
    {
      name: 'chromium-small-phone',
      use: {
        browserName: 'chromium',
        viewport: { width: 360, height: 640 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'chromium-modern-phone',
      use: {
        ...devices['iPhone 14'], // 390 x 844
        browserName: 'chromium',
      },
    },
    {
      name: 'chromium-small-tablet',
      use: {
        ...devices['iPad Mini'], // 768 x 1024
        browserName: 'chromium',
      },
    },
    {
      name: 'chromium-large-tablet',
      use: {
        ...devices['iPad Pro 11'], // 834 x 1194
        browserName: 'chromium',
      },
    },
    {
      name: 'chromium-laptop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'chromium-desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
      },
    },

    // --- Firefox Viewports ---
    {
      name: 'firefox-modern-phone',
      use: {
        browserName: 'firefox',
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        browserName: 'firefox',
        viewport: { width: 1920, height: 1080 },
      },
    },

    // --- WebKit (Safari Engine) Viewports ---
    {
      name: 'webkit-iphone',
      use: {
        ...devices['iPhone 14'],
        browserName: 'webkit',
      },
    },
    {
      name: 'webkit-ipad',
      use: {
        ...devices['iPad (gen 7)'],
        browserName: 'webkit',
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        browserName: 'webkit',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
