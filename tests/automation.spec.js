import { test, expect } from '@playwright/test';

test('the three service practices are concrete and distinct', async ({ page }) => {
  await page.goto('/');
  const expected = [
    ['automation', 'Let the work move itself.', ['Capture', 'Decide', 'Route']],
    ['web-design', 'Turn attention into action.', ['Frame', 'Design', 'Build']],
    ['cybersecurity', 'Find the risk. Prove the fix.', ['Discover', 'Validate', 'Harden']]
  ];
  for (const [id, heading, flow] of expected) {
    const card = page.locator('#' + id);
    await expect(card.getByRole('heading', { name: heading })).toBeVisible();
    for (const stage of flow) await expect(card).toContainText(stage);
    await expect(card).toContainText('CHECKPOINT');
  }
});

test('portfolio claims remain qualified as concepts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-project]')).toHaveCount(3);
  for (const project of await page.locator('[data-project]').all()) {
    await project.click();
    await expect(page.getByRole('dialog')).toContainText('ILLUSTRATIVE CONCEPT');
    await expect(page.getByRole('dialog')).toContainText('No customer deployment or measured result is claimed');
    await page.getByRole('button', { name: 'Close project' }).click();
  }
});

test('downloaded brief captures the selected practice and context', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your name').fill('Operations Lead');
  await page.getByLabel('Email address').fill('lead@example.com');
  await page.getByLabel('Primary service').selectOption({ label: 'Cybersecurity' });
  await page.getByLabel('What needs to change?').fill('Review and harden our customer-facing web estate.');
  await page.getByLabel('Current systems / context').fill('Next.js, AWS, GitHub');
  await page.getByLabel('Investment in mind').selectOption({ label: '£15k–£40k' });
  await page.getByLabel('Ideal timing').selectOption({ label: 'Within 1–3 months' });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Create my project brief' }).click();
  const result = await download;
  const stream = await result.createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  expect(body).toContain('FORME PROJECT BRIEF');
  expect(body).toContain('Primary service: Cybersecurity');
  expect(body).toContain('Next.js, AWS, GitHub');
  expect(body).toContain('has not been sent');
});