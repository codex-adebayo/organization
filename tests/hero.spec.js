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
