import { test, expect } from '@playwright/test';

test('cinematic hero replaces both animated scenes and retains useful destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Less busywork.');
  await expect(page.locator('.hero-cinema')).toBeVisible();
  await expect(page.locator('[data-hero-scene], [data-hero-object], .hero-panel, [data-flow-visual]')).toHaveCount(0);
  await expect(page.locator('#hero-motion-toggle, #data-journey-motion-toggle')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explore the data journey' }).click();
  await expect(page).toHaveURL(/#hero-flow$/);
  await expect(page.locator('#flow-title')).toBeInViewport();
  await page.locator('#hero-brief-link').click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByLabel('Your name')).toBeInViewport();
});

test('hero and workflow are readable at narrow widths with motion disabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 700, 701, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#hero-flow .flow-chapter')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.hero-experience').evaluate(element =>
      element.getAnimations({ subtree: true }).length)).toBe(0);
  }
});

test('static hero and all journey chapters render without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8000/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#hero-brief-link')).toBeVisible();
  await expect(page.locator('#hero-flow .flow-chapter')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Make the next decision clearer.' })).toBeVisible();
  await context.close();
});

test('mobile, reduced motion and unavailable WebGL retain the sculpture poster', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-renderer', 'poster');
  await expect(page.locator('[data-sculpture] canvas')).toHaveCount(0);
  await expect(page.locator('.sculpture-poster')).toBeVisible();
  expect(await page.locator('.sculpture-poster').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-sculpture] canvas')).toHaveCount(0);
  await expect(page.locator('.sculpture-poster')).toBeVisible();
});

test('desktop WebGL renders a still scene and recovers to its poster after context loss', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'WebGL enhancement is desktop-only');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const host = page.locator('[data-sculpture]');
  await expect(host).toHaveAttribute('data-renderer', 'webgl', { timeout: 30000 });
  await expect(host.locator('canvas')).toBeVisible();
  await expect(page.locator('.sculpture-poster')).toBeHidden();
  // No continuously changing object or light: demand rendering stays idle.
  await page.waitForTimeout(1000);
  const first = await host.screenshot();
  await page.waitForTimeout(250);
  expect(await host.screenshot()).toEqual(first);
  await page.locator('.hero-cinema').screenshot({ path: info.outputPath('sculpture-desktop.png') });
  await info.attach('3D hero', { path: info.outputPath('sculpture-desktop.png'), contentType: 'image/png' });
  await host.locator('canvas').evaluate(canvas => {
    canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  });
  await expect(host).toHaveAttribute('data-renderer', 'poster');
  await expect(page.locator('.sculpture-poster')).toBeVisible();
});

test('WebGL creation failure leaves the fallback and enquiry link available', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return String(type).includes('webgl') ? null : original.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.locator('.sculpture-poster')).toBeVisible();
  await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-renderer', 'poster');
  await page.locator('#hero-brief-link').click();
  await expect(page).toHaveURL(/#contact$/);
});
