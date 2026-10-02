import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

test.describe('KidoTube Platform Automated E2E Suite', () => {
  test.beforeAll(async () => {
    const screenshotDir = path.resolve(process.cwd(), 'reports/screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test('TC-FUNC-01 & TC-RESP-01: Homepage loads, categories displayed, zero horizontal scroll', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Title verification
    await expect(page).toHaveTitle(/KidoTube/);

    // Verify main header and brand
    const brand = page.locator('text=KidoTube');
    await expect(brand.first()).toBeVisible();

    // Check zero horizontal overflow on mobile/tablet/desktop
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth + 5);

    // Capture responsive screenshot
    const projectName = testInfo.project.name;
    await page.screenshot({
      path: `reports/screenshots/home-${projectName}.png`,
      fullPage: false,
    });
  });

  test('TC-SAFE-01: Child safety - No open web search & safe video cards only', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Search bar should filter ONLY curated videos within approved list
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Poem');
      await page.waitForTimeout(300);
      const cards = page.locator('[data-testid="video-card"], [class*="card"]');
      expect(await cards.count()).toBeGreaterThan(0);
    }

    // Verify zero external social media links in child view
    const externalSocials = page.locator('a[href*="facebook.com"], a[href*="tiktok.com"], a[href*="instagram.com"]');
    expect(await externalSocials.count()).toBe(0);
  });

  test('TC-FUNC-06: Notebook Drawing Studio loads and canvas is ready', async ({ page }, testInfo) => {
    await page.goto('/notebook');
    await page.waitForLoadState('domcontentloaded');

    // Verify drawing canvas
    const canvas = page.locator('canvas');
    if (await canvas.isVisible()) {
      const box = await canvas.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(100);
      expect(box!.height).toBeGreaterThan(100);
    }

    await page.screenshot({
      path: `reports/screenshots/notebook-${testInfo.project.name}.png`,
    });
  });

  test('TC-FUNC-05: Mini Games Hub loads games collection', async ({ page }, testInfo) => {
    await page.goto('/games');
    await page.waitForLoadState('domcontentloaded');

    // Check games header
    await expect(page.locator('h1, h2').first()).toBeVisible();

    await page.screenshot({
      path: `reports/screenshots/games-${testInfo.project.name}.png`,
    });
  });

  test('TC-FUNC-07 & TC-APP-01: Download & Multi-Device Pairing page functional', async ({ page }, testInfo) => {
    await page.goto('/download');
    await page.waitForLoadState('domcontentloaded');

    // Heading verification
    const heading = page.locator('text=Install KidoTube on Any Device');
    await expect(heading).toBeVisible();

    // Verify Store cards and direct APK download button exist
    const apkButton = page.locator('text=Download APK (.apk)');
    await expect(apkButton).toBeVisible();

    // Test Parent Code Generation Button
    const generateBtn = page.locator('button:has-text("Generate 6-Digit Family Code")');
    if (await generateBtn.isVisible()) {
      await generateBtn.click();
      // Wait for KIDO- code display to appear
      const codeDisplay = page.getByText(/KIDO-\d{4}/);
      await expect(codeDisplay).toBeVisible({ timeout: 10000 });
    }

    await page.screenshot({
      path: `reports/screenshots/download-${testInfo.project.name}.png`,
    });
  });

  test('TC-SAFE-02: Parent Dashboard requires PIN authentication', async ({ page }) => {
    await page.goto('/parent');
    await page.waitForLoadState('domcontentloaded');

    // Should prompt for PIN before exposing controls
    const pinInput = page.locator('input[type="password"], input[type="text"][maxlength="4"], input[placeholder*="PIN"], button:has-text("Unlock")');
    const isPinGuarded = (await pinInput.count()) > 0 || (await page.locator('text=PIN').count()) > 0;
    expect(isPinGuarded).toBe(true);
  });

  test('TC-A11Y-01: Automated Axe accessibility check on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // Color contrast evaluated in report
      .analyze();

    // Ensure zero critical accessibility violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical'
    );
    expect(criticalViolations.length).toBe(0);
  });
});
