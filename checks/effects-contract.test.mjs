import test from 'node:test';
import assert from 'node:assert/strict';
import { EFFECTS, entranceSettings, entranceThreshold, feedbackSettings } from '../lib/effects-contract.mjs';

test('the specification fixes timing, easing and supported motion dimensions', () => {
  assert.deepEqual(EFFECTS.ease, [0.22, 1, 0.36, 1]);
  assert.equal(EFFECTS.easing, 'cubic-bezier(0.22, 1, 0.36, 1)');
  for (const phone of [false, true]) for (const phase of ['hero', 'scroll']) for (const kind of ['content', 'media']) {
    const config = entranceSettings({ phone, phase, kind });
    assert.equal(config.duration, phase === 'hero' ? 0.8 : 1);
    assert.equal(config.delay, phase === 'hero' ? 0 : 0.1);
    assert.equal(config.from.opacity, 0);
    assert.deepEqual(config.to, { opacity: 1, transform: 'none' });
    assert.equal(config.travel, kind === 'media' ? 0 : phone ? 8 : 12);
    assert.equal(config.scale, kind === 'media' ? 0.98 : 1);
    assert.deepEqual(Object.keys(config.from).sort(), ['opacity', 'transform']);
  }
});
test('only 2–4 progression siblings stagger; phone retains the base delay', () => {
  for (const count of [2, 3, 4]) for (let index = 0; index < count; index++) {
    const opts = { progression: true, count, index };
    assert.equal(entranceSettings(opts).delay, 0.1 + 0.1 * index);
    assert.equal(entranceSettings({ ...opts, phone: true }).delay, 0.1);
  }
  for (const count of [0, 1, 5, 100]) assert.throws(() => entranceSettings({ progression: true, count }), RangeError);
  assert.throws(() => entranceSettings({ index: 1 }), RangeError);
  assert.throws(() => entranceSettings({ progression: true, count: 3, index: 3 }), RangeError);
});
test('tall groups have a reachable threshold without changing normal groups', () => {
  assert.equal(entranceThreshold(899, 900), 0.15);
  assert.equal(entranceThreshold(900, 900), 0.15);
  assert.equal(entranceThreshold(901, 900), 0);
});
test('feedback has its own tween and scale-occupied fallback', () => {
  const normal = feedbackSettings();
  assert.equal(normal.hover, 1.01);
  assert.equal(normal.press, 0.99);
  assert.equal(normal.timing.duration, 250);
  assert.equal(normal.timing.delay, 0);
  const occupied = feedbackSettings({ scaleOccupied: true });
  assert.equal(occupied.property, 'opacity');
  assert.equal(occupied.hover, 0.9);
  assert.equal(occupied.press, 0.8);
});
test('reduced motion overrides every duration, delay and movement', () => {
  for (const kind of ['content', 'media']) for (const phase of ['hero', 'scroll']) {
    const config = entranceSettings({ kind, phase, progression: true, index: 3, count: 4, reduced: true });
    assert.equal(config.duration, 0);
    assert.equal(config.delay, 0);
    assert.equal(config.travel, 0);
    assert.equal(config.scale, 1);
    assert.equal(config.from.opacity, 1);
  }
  const feedback = feedbackSettings({ reduced: true });
  assert.equal(feedback.hover, 1);
  assert.equal(feedback.press, 1);
  assert.equal(feedback.timing.duration, 0);
});
