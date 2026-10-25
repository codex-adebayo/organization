import { test, expect } from '@playwright/test';

async function objectPosition(page) {
  return page.locator('.hero-futuristic [data-hero-object]').evaluate(element => ({
    x: Number(element.getAttribute('cx')), y: Number(element.getAttribute('cy'))
  }));
}

test('white panels pivot and the gold object follows the actual SVG route', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const scene = page.locator('.hero-futuristic [data-hero-scene]');
  await expect(scene).toHaveAttribute('data-running', 'true');
  await expect(page.locator('.hero-futuristic [data-hero-panel]')).toHaveCount(6);
  const first = await objectPosition(page);
  const panel = page.locator('.hero-futuristic [data-hero-panel]').first();
  const transform = await panel.evaluate(element => getComputedStyle(element).transform);
  await expect.poll(async () => {
    const next = await objectPosition(page);
    return Math.hypot(next.x - first.x, next.y - first.y);
  }).toBeGreaterThan(3);
  await expect.poll(() => panel.evaluate(element => getComputedStyle(element).transform)).not.toBe(transform);
  const distance = await page.evaluate(() => {
    const route = document.querySelector('.hero-futuristic [data-hero-route]');
    const object = document.querySelector('.hero-futuristic [data-hero-object]');
    const x = Number(object.getAttribute('cx')), y = Number(object.getAttribute('cy'));
    const length = route.getTotalLength();
    let closest = Infinity;
    for (let i = 0; i <= 1000; i++) {
      const point = route.getPointAtLength(length * i / 1000);
      closest = Math.min(closest, Math.hypot(point.x - x, point.y - y));
    }
    return closest;
  });
  expect(distance).toBeLessThan(2);
  expect(await scene.evaluate(element => getComputedStyle(element).position)).toBe('absolute');
  expect(await page.locator('.hero-copy-overlay').evaluate(element => Number(getComputedStyle(element).zIndex))).toBeGreaterThan(0);
});

test('pause and offscreen suspension stop the scene; resume continues it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const scene = page.locator('.hero-futuristic [data-hero-scene]');
  await expect(scene).toHaveAttribute('data-running', 'true');
  await page.getByRole('button', { name: 'Pause hero animation' }).click();
  await expect(scene).toHaveAttribute('data-running', 'false');
  await page.waitForTimeout(80);
  const held = await objectPosition(page);
  const panels = await page.locator('.hero-futuristic [data-hero-panel]').evaluateAll(elements => elements.map(element => getComputedStyle(element).transform));
  await page.waitForTimeout(200);
  expect(await objectPosition(page)).toEqual(held);
  expect(await page.locator('.hero-futuristic [data-hero-panel]').evaluateAll(elements => elements.map(element => getComputedStyle(element).transform))).toEqual(panels);
  await page.getByRole('button', { name: 'Resume hero animation' }).click();
  await expect(scene).toHaveAttribute('data-running', 'true');
  await expect.poll(async () => {
    const next = await objectPosition(page);
    return Math.hypot(next.x - held.x, next.y - held.y);
  }).toBeGreaterThan(3);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-running', 'false');
});

test('reduced motion renders a static sculpture and keeps hero text and links readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-futuristic [data-hero-scene]')).toHaveAttribute('data-running', 'false');
  await expect(page.locator('.hero-futuristic').getByRole('button', { name: 'Animation disabled by reduced motion' })).toBeDisabled();
  const before = await objectPosition(page);
  await page.waitForTimeout(160);
  expect(await objectPosition(page)).toEqual(before);
  const link = page.getByRole('link', { name: 'Explore the data journey' });
  await link.scrollIntoViewIfNeeded();
  expect(await link.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return element.contains(document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2));
  })).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('hero remains readable across phone and desktop boundaries', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Layout sweep runs once');
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 600, 601, 700, 701, 900, 1100, 1440, 1600, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('h1').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    if ([390, 900, 1440].includes(width)) {
      const path = info.outputPath('hero-' + width + '.png');
      await page.locator('.hero-futuristic').screenshot({ path });
      await info.attach('Hero ' + width, { path, contentType: 'image/png' });
    }
  }
});
