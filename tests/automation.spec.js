import { test, expect } from '@playwright/test';

async function scrub(page, fraction) {
  await page.locator('#hero-flow').evaluate((element, value) => {
    const top = element.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + Math.max(1, element.offsetHeight - innerHeight) * value, behavior: 'instant' });
  }, fraction);
}
async function point(page) {
  return page.locator('#hero-flow [data-hero-object]').evaluate(element => ({
    x: Number(element.getAttribute('cx')), y: Number(element.getAttribute('cy'))
  }));
}
test('the scroll section lives inside the hero and connects three readable stages', async ({ page }) => {
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
  await expect(page.locator('#hero-motion-toggle')).toHaveCount(1);
  await expect(page.locator('#data-journey-motion-toggle')).toHaveCount(1);
  await expect(page.locator('#hero-flow')).toContainText('No customer data or live processing');
});

test('desktop scrolling advances the golden record and active workflow stage', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Scroll geometry is desktop-only; phone uses the natural reading layout');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const flow = page.locator('#hero-flow');
  const scene = flow.locator('[data-hero-scene]');
  const positions = [];
  for (const [fraction, stage] of [[0.12, 'connect'], [0.5, 'automate'], [0.88, 'act']]) {
    await scrub(page, fraction);
    await expect(flow).toHaveAttribute('data-active-stage', stage);
    await expect(scene).toHaveAttribute('data-mode', 'scroll');
    await expect(scene).toHaveAttribute('data-running', 'true');
    await expect(flow.locator('.flow-phase-nav a[aria-current="step"]')).toHaveAttribute('href', '#flow-' + stage);
    await page.waitForTimeout(450);
    positions.push(await point(page));
  }
  expect(Math.hypot(positions[1].x - positions[0].x, positions[1].y - positions[0].y)).toBeGreaterThan(30);
  expect(Math.hypot(positions[2].x - positions[1].x, positions[2].y - positions[1].y)).toBeGreaterThan(30);
  expect(await flow.locator('[data-flow-visual]').evaluate(element => getComputedStyle(element).position)).toBe('sticky');
  await page.getByRole('button', { name: 'Pause data journey animation' }).click();
  await expect(scene).toHaveAttribute('data-running', 'false');
  await page.waitForTimeout(80);
  const held = await point(page);
  await scrub(page, 0.5);
  await page.waitForTimeout(180);
  expect(await point(page)).toEqual(held);
  await page.getByRole('button', { name: 'Resume data journey animation' }).click();
  await expect(scene).toHaveAttribute('data-running', 'true');
});

test('phone and reduced-motion layouts keep the complete workflow accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 700, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const visual = page.locator('#hero-flow [data-flow-visual]');
    expect(await visual.evaluate(element => getComputedStyle(element).position)).not.toBe('sticky');
    await expect(page.locator('#hero-flow [data-hero-scene]')).toHaveAttribute('data-running', 'false');
    for (const chapter of await page.locator('#hero-flow .flow-chapter').all()) await expect(chapter).toHaveAttribute('data-effect-state', 'complete');
  }
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
