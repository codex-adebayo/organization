import { test, expect } from '@playwright/test';

test('cinematic hero states the complete practice and keeps useful destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Build better.');
  await expect(page.locator('.portfolio-hero')).toBeVisible();
  await expect(page.locator('.portfolio-hero-rail span')).toHaveCount(3);
  await page.getByRole('link', { name: 'Explore our practice' }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator('#services')).toBeInViewport();
  await page.locator('#hero-brief-link').click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByLabel('Your name')).toBeInViewport();
});

test('hero and service chapters remain readable with motion disabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 700, 701, 900, 1100, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#services .practice-card')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.portfolio-hero').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  }
});

test('hero and all three practices render without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8000/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#hero-brief-link')).toBeVisible();
  await expect(page.locator('#services .practice-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Find the risk. Prove the fix.' })).toBeVisible();
  await context.close();
});

test('mobile, reduced motion and unavailable WebGL retain the sculpture poster', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-renderer', 'poster');
  await expect(page.locator('[data-sculpture] canvas')).toHaveCount(0);
  await expect(page.locator('.sculpture-poster')).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-sculpture] canvas')).toHaveCount(0);
});

test('desktop WebGL stays still and falls back after context loss', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'WebGL enhancement is desktop-only');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const host = page.locator('[data-sculpture]');
  await expect(host).toHaveAttribute('data-renderer', 'webgl', { timeout: 30000 });
  await expect(host.locator('canvas')).toBeVisible();
  await page.waitForTimeout(900);
  const first = await host.screenshot();
  await page.waitForTimeout(250);
  expect(await host.screenshot()).toEqual(first);
  await host.locator('canvas').evaluate(canvas => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(host).toHaveAttribute('data-renderer', 'poster');
});

test('WebGL creation failure preserves the poster and project CTA', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return String(type).includes('webgl') ? null : original.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.locator('.sculpture-poster')).toBeVisible();
  await page.locator('#hero-brief-link').click();
  await expect(page).toHaveURL(/#contact$/);
});