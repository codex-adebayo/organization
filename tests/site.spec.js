import { test, expect } from '@playwright/test';
test('complete agency journey, projects and brief download', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Good ideas.');
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.locator('#navigation')).toBeVisible();
  }
  await page.locator('#navigation').getByRole('link', { name: /Work/ }).click();
  await expect(page).toHaveURL(/#work$/);
  for (const [key, name] of [['terrain', 'Terrain'], ['ondo', 'Ondo'], ['folio', 'Folio']]) {
    const trigger = page.locator('[data-project="' + key + '"]');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#dialog-title')).toHaveText(name);
    await page.getByRole('button', { name: 'Close project' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.locator('#hero-motion-toggle').scrollIntoViewIfNeeded();
  await page.locator('#hero-motion-toggle').click();
  await expect(page.locator('[data-hero-scene]')).toHaveAttribute('data-paused', 'true');
  await page.locator('#hero-motion-toggle').click();
  await expect(page.locator('[data-hero-scene]')).toHaveAttribute('data-paused', 'false');
  await page.getByLabel('Your name').fill('A Curious Founder');
  await page.getByLabel('Email address').fill('founder@example.com');
  await page.getByLabel('Company / website').fill('Example Studio');
  await page.getByLabel('What would you like to create?').fill('A distinctive website for our new business.');
  await page.getByLabel('Investment in mind').selectOption({ label: 'Help me scope it' });
  await page.getByLabel('Ideal timing').selectOption({ label: 'Within 1–3 months' });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create my project brief' }).click();
  expect((await download).suggestedFilename()).toBe('project-brief.txt');
  await expect(page.getByRole('status')).toContainText('Nothing has been sent');
  expect(errors).toEqual([]);
});
test('reduced motion, mobile widths and keyboard dialog access', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('body')).not.toHaveClass(/motion-ready/);
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => {
      if (document.documentElement.scrollWidth <= innerWidth) return null;
      return { viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        elements: Array.from(document.querySelectorAll('.agency-story, .agency-story *')).map(element => {
          const bounds = element.getBoundingClientRect();
          return { tag: element.tagName, className: element.className, width: bounds.width, right: bounds.right };
        }).filter(item => item.right > innerWidth + 1).slice(0, 20) };
    })).toBeNull();
  }
  await page.locator('[data-project="terrain"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('[data-project="terrain"]')).toBeFocused();
});
test('content remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8000/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#work .section-title')).toBeVisible();
  await expect(page.locator('#contact h2')).toBeVisible();
  await context.close();
});
test('capture review screenshots', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
  await testInfo.attach('Homepage', { path: testInfo.outputPath('homepage.png'), contentType: 'image/png' });
});

test('Next.js metadata, assets and missing routes', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('FORME — Independent digital studio');
  expect(await page.locator('meta[name="description"]').getAttribute('content')).toContain('digital studio');
  expect((await request.get('/favicon.svg')).status()).toBe(200);
  expect((await request.get('/does-not-exist')).status()).toBe(404);
});

test('Kino layout retains a reading choice without duplicate scroll tracks', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('[data-kino-story]')).toHaveCount(1);
  await expect(page.locator('[data-kino-scene]')).toHaveCount(2);
  await expect(page.locator('#agency-story-content')).toHaveAttribute('data-reading', 'false');
  await page.getByRole('button', { name: 'Read without motion' }).click();
  await expect(page.locator('#agency-story-content')).toHaveAttribute('data-reading', 'true');
  await expect(page.getByRole('button', { name: 'Explore with scroll' })).toHaveAttribute('aria-pressed', 'true');
  for (const group of await page.locator('[data-kino-layer] [data-effect-group]').all()) {
    await expect(group).toHaveAttribute('data-effect-state', 'complete');
  }
  await page.getByRole('button', { name: 'Explore with scroll' }).click();
  await expect(page.locator('#agency-story-content')).toHaveAttribute('data-reading', 'false');
});

test('story stays readable on narrow screens and with reduced motion', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const panels = page.locator('[data-kino-content]');
    await expect(panels).toHaveCount(2);
    await expect.poll(() => panels.first().evaluate(element => getComputedStyle(element.parentElement).position)).not.toBe('sticky');
    for (const layer of await page.locator('[data-kino-layer]').all()) {
      await expect.poll(() => layer.evaluate(element => Number(getComputedStyle(element).opacity))).toBe(1);
    }
    await expect.poll(() => page.evaluate(() => {
      if (document.documentElement.scrollWidth <= innerWidth) return null;
      return { viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        elements: Array.from(document.querySelectorAll('.agency-story, .agency-story *')).map(element => {
          const bounds = element.getBoundingClientRect();
          return { tag: element.tagName, className: element.className, width: bounds.width, right: bounds.right };
        }).filter(item => item.right > innerWidth + 1).slice(0, 20) };
    })).toBeNull();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect.poll(() => page.locator('[data-kino-content]').first().evaluate(element => getComputedStyle(element.parentElement).position)).not.toBe('sticky');
  await expect(page.locator('body')).not.toHaveClass(/motion-ready/);
  await expect(page.getByRole('heading', { name: 'Then, make it unmistakable.' })).toBeVisible();
});

test('dialog immediately closes and restores focus across repeated open and close actions', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('[data-project="terrain"]');
  for (let cycle = 0; cycle < 3; cycle++) {
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close project' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('story is complete without JavaScript or external fonts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.route('**/*fonts*', route => route.abort());
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8000/');
  await expect(page.getByRole('heading', { name: 'First, find the idea.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Then, make it unmistakable.' })).toBeVisible();
  expect(await page.locator('[data-kino-layer]').count()).toBe(4);
  await context.close();
});
