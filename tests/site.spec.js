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
  await page.locator('#shift').scrollIntoViewIfNeeded();
  await page.locator('#shift').click();
  await expect(page.locator('.hero-stage')).toHaveClass(/shifted/);
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
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
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
  await expect(page.locator('#work h2')).toBeVisible();
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
