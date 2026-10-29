import { test, expect } from '@playwright/test';

test('complete portfolio journey, concept studies and project brief', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Build better.');
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.locator('#navigation')).toBeVisible();
  }
  await page.locator('#navigation').getByRole('link', { name: /Services/ }).click();
  await expect(page).toHaveURL(/#services$/);
  for (const [key, name] of [['signal', 'SignalOS'], ['northstar', 'Northstar'], ['gatehouse', 'Gatehouse']]) {
    const trigger = page.locator('[data-project="' + key + '"]');
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(name);
    await page.getByRole('button', { name: 'Close project' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.getByLabel('Your name').fill('A Curious Founder');
  await page.getByLabel('Email address').fill('founder@example.com');
  await page.getByLabel('Company / website').fill('Example Studio');
  await page.getByLabel('Primary service').selectOption({ label: 'Web design' });
  await page.getByLabel('What needs to change?').fill('Our website should explain our specialist offer and create qualified enquiries.');
  await page.getByLabel('Investment in mind').selectOption({ label: 'Help me scope it' });
  await page.getByLabel('Ideal timing').selectOption({ label: 'Within 1–3 months' });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create my project brief' }).click();
  expect((await download).suggestedFilename()).toBe('forme-project-brief.txt');
  await expect(page.getByRole('status')).toContainText('Nothing has been sent');
  expect(errors).toEqual([]);
});

test('reduced motion, responsive widths and keyboard dialog access', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 700, 768, 900, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const group of await page.locator('[data-effect-group]').all()) {
      await expect(group).toHaveAttribute('data-effect-state', 'complete');
    }
  }
  await page.locator('[data-project="signal"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('[data-project="signal"]')).toBeFocused();
});

test('core portfolio content remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8000/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#services .practice-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Ideas made specific.' })).toBeVisible();
  await expect(page.locator('#contact h2')).toBeVisible();
  await context.close();
});

test('capture review screenshots', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath('portfolio.png'), fullPage: true });
  await testInfo.attach('Portfolio', { path: testInfo.outputPath('portfolio.png'), contentType: 'image/png' });
});

test('metadata, assets and missing routes', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('FORME — Automation, web design & cybersecurity');
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toContain('automation');
  expect(description).toContain('cybersecurity');
  expect((await request.get('/favicon.svg')).status()).toBe(200);
  expect((await request.get('/sculpture.svg')).status()).toBe(200);
  expect((await request.get('/does-not-exist')).status()).toBe(404);
});

test('dialog closes immediately and restores focus across repeated actions', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('[data-project="signal"]');
  for (let cycle = 0; cycle < 3; cycle++) {
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close project' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});