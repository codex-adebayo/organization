import { test, expect } from '@playwright/test';

test('the reading section lives inside the hero and connects three readable stages', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-hero-experience] #hero-flow')).toHaveCount(1);
  await expect(page.locator('#hero-flow .flow-chapter')).toHaveCount(3);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Less busywork.');
  for (const title of ['Bring the right data together.', 'Let the workflow carry it.', 'Make the next decision clearer.']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
  const ids = await page.locator('svg defs [id]').evaluateAll(elements => elements.map(element => element.id));
  expect(new Set(ids).size).toBe(ids.length);
  await expect(page.locator('#hero-motion-toggle')).toHaveCount(0);
  await expect(page.locator('#data-journey-motion-toggle')).toHaveCount(0);
  await expect(page.locator('#hero-flow')).toContainText('No customer data or live processing');
});

test('automation content and tools field are included in the downloadable brief', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your name').fill('Operations Lead');
  await page.getByLabel('Email address').fill('lead@example.com');
  await page.getByLabel('Tools or data sources').fill('CRM and spreadsheets');
  await page.getByLabel('What would you like to automate?').fill('Route validated enquiries to an assigned owner.');
  await page.getByLabel('Investment in mind').selectOption({ label: 'Help me scope it' });
  await page.getByLabel('Ideal timing').selectOption({ label: 'Within 1–3 months' });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create my automation brief' }).click();
  const result = await download;
  expect(result.suggestedFilename()).toBe('automation-brief.txt');
  const stream = await result.createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  expect(body).toContain('AUTOMATION PROJECT BRIEF');
  expect(body).toContain('CRM and spreadsheets');
  expect(body).toContain('has not been sent');
  await expect(page.getByRole('status')).toContainText('Nothing has been sent');
});

test('the full automation journey renders without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8000/');
  await expect(page.locator('#hero-flow .flow-chapter')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Make the next decision clearer.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Data integration', exact: true })).toBeVisible();
  await expect(page.getByLabel('What would you like to automate?')).toBeVisible();
  await context.close();
});
