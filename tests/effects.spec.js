import { test, expect } from '@playwright/test';

const groups = [
  'hero-copy', 'practice-intro', 'practice-0', 'practice-1', 'practice-2',
  'work-copy', 'work-projects', 'operating-intro',
  'operating-step-0', 'operating-step-1', 'operating-step-2', 'operating-step-3',
  'standards-copy', 'contact-content', 'footer-promo'
];

async function recordPlayback(page) {
  await page.addInitScript(() => {
    window.effectPlays = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function(keyframes, timing) {
      const result = original.call(this, keyframes, timing);
      if (this.dataset.effectGroup || this.hasAttribute('data-feedback')) {
        window.effectPlays.push({ group: this.dataset.effectGroup, feedback: this.hasAttribute('data-feedback'), keyframes, timing });
      }
      return result;
    };
  });
}
async function finishGroup(page, group) {
  const target = page.locator('[data-effect-group="' + group + '"]');
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveAttribute('data-effect-runs', '1');
  await target.evaluate(element => element.getAnimations().forEach(animation => animation.finish()));
  await expect(target).toHaveAttribute('data-effect-state', 'complete');
  return target;
}

test('hero mounts once and lower portfolio groups reveal independently without replay', async ({ page }) => {
  test.setTimeout(90000);
  await recordPlayback(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('[data-effect-group="hero-copy"]')).toHaveAttribute('data-effect-runs', '1');
  const hero = await page.evaluate(() => window.effectPlays.filter(play => play.group === 'hero-copy'));
  expect(hero).toHaveLength(1);
  expect(hero[0].timing).toMatchObject({ duration: 800, delay: 0, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  expect((await page.locator('[data-effect-group]').evaluateAll(elements => elements.map(element => element.dataset.effectGroup))).sort()).toEqual([...groups].sort());
  expect(await page.locator('[data-effect-group] [data-effect-group]').count()).toBe(0);
  for (const group of groups.filter(group => group !== 'hero-copy')) {
    const target = await finishGroup(page, group);
    const data = await target.evaluate(element => ({
      amount: element.getBoundingClientRect().height > innerHeight ? '0' : '0.15',
      delay: Number(element.dataset.effectDelay), index: element.dataset.effectIndex
    }));
    expect(data.delay).toBeCloseTo(0.1 + (page.viewportSize().width <= 600 ? 0 : Number(data.index ?? 0) * 0.1), 8);
    await expect(target).toHaveAttribute('data-effect-threshold', data.amount);
  }
  const before = await page.evaluate(() => window.effectPlays.filter(play => play.group).length);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('footer').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.effectPlays.filter(play => play.group).length)).toBe(before);
});

test('content entrances use the specified travel and easing', async ({ page }) => {
  await recordPlayback(page);
  await page.goto('/');
  const target = page.locator('[data-effect-group="work-copy"]');
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveAttribute('data-effect-runs', '1');
  const metrics = await target.evaluate(element => {
    const animation = element.getAnimations()[0];
    animation.pause();
    const timing = animation.effect.getTiming();
    animation.currentTime = timing.delay + timing.duration / 2;
    return { timing, frame: animation.effect.getKeyframes()[0], opacity: Number(getComputedStyle(element).opacity) };
  });
  expect(metrics.timing).toMatchObject({ duration: 1000, delay: 100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  expect(metrics.frame).toMatchObject({ opacity: '0', transform: 'translateY(' + (page.viewportSize().width <= 600 ? 8 : 12) + 'px)' });
  expect(metrics.opacity).toBeGreaterThan(0.9);
  expect(metrics.opacity).toBeLessThan(1);
});

test('responsive boundaries preserve groups and reduced-motion readability', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Breakpoint sweep runs once');
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 600, 601, 700, 701, 900, 901, 1100, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('[data-effect-group]')).toHaveCount(groups.length);
    for (const group of await page.locator('[data-effect-group]').all()) {
      await expect(group).toHaveAttribute('data-effect-state', 'complete');
      expect(await group.evaluate(element => Number(getComputedStyle(element).opacity))).toBe(1);
      expect(await group.evaluate(element => getComputedStyle(element).transform)).toBe('none');
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('primary feedback is immediate, interruptible and cancelled by reduced motion', async ({ page }, info) => {
  await recordPlayback(page);
  await page.goto('/');
  const button = page.locator('#hero-brief-link');
  await expect(page.locator('[data-effect-group="hero-copy"]')).toHaveAttribute('data-effect-state', 'complete');
  if (info.project.name === 'desktop') {
    await button.hover();
    await expect(button).toHaveAttribute('data-feedback-state', 'hover');
  }
  const bounds = await button.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await expect(button).toHaveAttribute('data-feedback-state', 'press');
  await page.mouse.up();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(button).toHaveAttribute('data-feedback-duration', '0');
  await expect.poll(() => button.evaluate(element => element.getAnimations().length)).toBe(0);
});