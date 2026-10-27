import { test, expect } from '@playwright/test';

const groups = [
  'hero-copy', 'flow-heading', 'flow-step-0', 'flow-step-1', 'flow-step-2', 'story-heading', 'story-clarity-copy', 'story-clarity-media',
  'story-expression-copy', 'story-expression-media', 'work-copy', 'work-projects', 'studio-content',
  'expertise-copy', 'expertise-services', 'process-intro', 'process-heading',
  'process-step-0', 'process-step-1', 'process-step-2', 'process-step-3', 'contact-content', 'footer-promo'
];

async function recordPlayback(page) {
  await page.addInitScript(() => {
    window.effectPlays = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function(keyframes, timing) {
      const result = original.call(this, keyframes, timing);
      if (this.dataset.effectGroup || this.hasAttribute('data-feedback')) {
        window.effectPlays.push({ group: this.dataset.effectGroup, feedback: this.hasAttribute('data-feedback'),
          keyframes, timing, at: performance.now() });
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

test('hero starts on mount; lower groups use independent scroll triggers and never replay', async ({ page }) => {
  test.setTimeout(90000);
  await recordPlayback(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('[data-effect-group="hero-copy"]')).toHaveAttribute('data-effect-runs', '1');
  const hero = await page.evaluate(() => window.effectPlays.filter(play => play.group?.startsWith('hero-')));
  expect(hero).toHaveLength(1);
  hero.forEach(play => {
    expect(play.timing.duration).toBe(800);
    expect(play.timing.delay).toBe(0);
    expect(play.timing.easing).toBe('cubic-bezier(0.22, 1, 0.36, 1)');
  });
  await expect(page.locator('[data-effect-group="footer-promo"]')).not.toHaveAttribute('data-effect-runs', '1');
  expect(await page.locator('[data-effect-group] [data-effect-group]').count()).toBe(0);
  expect((await page.locator('[data-effect-group]').evaluateAll(elements => elements.map(element => element.dataset.effectGroup))).sort()).toEqual([...groups].sort());
  expect(await page.locator('.nav [data-effect-group], .story-toolbar button[data-effect-group], footer > span[data-effect-group], footer > a[data-effect-group]').count()).toBe(0);
  for (const group of groups.filter(group => !group.startsWith('hero-'))) {
    const target = await finishGroup(page, group);
    const expected = await target.evaluate(element => ({
      amount: element.getBoundingClientRect().height > innerHeight ? '0' : '0.15',
      duration: element.dataset.effectDuration, delay: Number(element.dataset.effectDelay),
      index: element.dataset.effectIndex
    }));
    expect(expected.duration).toBe('1');
    expect(expected.delay).toBeCloseTo(0.1 + (page.viewportSize().width <= 600 ? 0 : Number(expected.index ?? 0) * 0.1), 8);
    await expect(target).toHaveAttribute('data-effect-threshold', expected.amount);
  }
  const before = await page.evaluate(() => window.effectPlays.filter(play => play.group).length);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('footer').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.effectPlays.filter(play => play.group).length)).toBe(before);
});

test('actual keyframes obey phone travel, media scale and timeline interpolation', async ({ page }) => {
  await recordPlayback(page);
  await page.goto('/');
  const mediaTarget = page.locator('[data-effect-group="story-clarity-media"]');
  await mediaTarget.scrollIntoViewIfNeeded();
  await expect(mediaTarget).toHaveAttribute('data-effect-runs', '1');
  const target = page.locator('[data-effect-group="work-copy"]');
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveAttribute('data-effect-runs', '1');
  const metrics = await target.evaluate(element => {
    const animation = element.getAnimations()[0];
    animation.pause();
    const timing = animation.effect.getTiming();
    animation.currentTime = timing.delay + timing.duration / 2;
    const frame = animation.effect.getKeyframes()[0];
    return { timing, frame, opacity: Number(getComputedStyle(element).opacity), transform: getComputedStyle(element).transform };
  });
  expect(metrics.timing.duration).toBe(1000);
  expect(metrics.timing.delay).toBe(100);
  expect(metrics.frame.opacity).toBe('0');
  expect(metrics.frame.transform).toBe('translateY(' + (page.viewportSize().width <= 600 ? 8 : 12) + 'px)');
  // At half time the specified ease is beyond 90% progress; playback must interpolate, not jump.
  expect(metrics.opacity).toBeGreaterThan(0.9);
  expect(metrics.opacity).toBeLessThan(1);
  const media = await page.evaluate(() => window.effectPlays.find(play => play.group === 'story-clarity-media'));
  expect(media.keyframes[0]).toEqual({ opacity: 0, transform: 'scale(0.98)' });
  expect(media.keyframes[1]).toEqual({ opacity: 1, transform: 'none' });
});

test('all CSS boundaries retain groups, layout and reduced-motion readability', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Breakpoint sweep runs once; other tests run in mobile emulation too');
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 599, 600, 601, 639, 640, 699, 700, 701, 899, 900, 901, 1440, 1599, 1600, 1601, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('[data-effect-group]')).toHaveCount(groups.length);
    for (const group of await page.locator('[data-effect-group]').all()) {
      await expect(group).toHaveAttribute('data-effect-state', 'complete');
      expect(await group.evaluate(element => Number(getComputedStyle(element).opacity))).toBe(1);
      expect(await group.evaluate(element => getComputedStyle(element).transform)).toBe('none');
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('[data-effect-group] [data-effect-group]').count()).toBe(0);
    if ([320, 700, 900, 1440].includes(width)) {
      const path = info.outputPath('effects-' + width + '.png');
      await page.screenshot({ path, fullPage: true });
      await info.attach('Layout ' + width, { path, contentType: 'image/png' });
    }
  }
});

test('feedback has no delay, is interruptible, and reduced motion cancels playback', async ({ page }, info) => {
  await recordPlayback(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const button = page.locator('#hero-brief-link');
  await button.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-effect-group="hero-copy"]')).toHaveAttribute('data-effect-state', 'complete');
  if (info.project.name === 'desktop') {
    await button.hover();
    await expect(button).toHaveAttribute('data-feedback-state', 'hover');
    await expect.poll(() => button.evaluate(element => Number(getComputedStyle(element).scale))).toBeCloseTo(1.01, 3);
  }
  const bounds = await button.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await expect(button).toHaveAttribute('data-feedback-state', 'press');
  await page.mouse.up();
  await page.mouse.move(0, 0);
  await expect(button).toHaveAttribute('data-feedback-state', 'rest');
  const plays = await page.evaluate(() => window.effectPlays.filter(play => play.feedback));
  expect(plays.length).toBeGreaterThan(0);
  plays.forEach(play => { expect(play.timing.duration).toBe(250); expect(play.timing.delay).toBe(0); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(button).toHaveAttribute('data-feedback-duration', '0');
  await expect.poll(() => button.evaluate(element => element.getAnimations().length)).toBe(0);
  expect(await button.evaluate(element => getComputedStyle(element).scale)).toBe('1');
});

test('hidden alternatives do not play until shown, and newly tall groups use threshold zero', async ({ page }) => {
  await page.route('http://127.0.0.1:8000/', async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace('<head>', '<head><style id="test-hidden">[data-effect-group="footer-promo"]{display:none!important}</style>');
    await route.fulfill({ response, body });
  });
  await page.goto('/');
  const footer = page.locator('[data-effect-group="footer-promo"]');
  await expect(footer).toHaveAttribute('data-effect-state', 'hidden-alternative');
  await expect(footer).not.toHaveAttribute('data-effect-runs', '1');
  await page.locator('#test-hidden').evaluate(element => element.remove());
  await finishGroup(page, 'footer-promo');
  await page.goto('/');
  const collection = page.locator('[data-effect-group="work-projects"]');
  await expect(collection).toHaveAttribute('data-effect-threshold', '0');
});

test('a mounted effect responds to preference changes without hiding or replaying content', async ({ page }) => {
  await recordPlayback(page);
  await page.goto('/');
  const footer = page.locator('[data-effect-group="footer-promo"]');
  await expect(footer).toHaveAttribute('data-effect-state', 'waiting');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(footer).toHaveAttribute('data-effect-state', 'complete');
  expect(await footer.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).not.toHaveAttribute('data-effect-runs', '1');
});
