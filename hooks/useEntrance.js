'use client';
import { useLayoutEffect, useRef } from 'react';
import { entranceSettings, entranceThreshold } from '../lib/effects-contract.mjs';
import { useMotionPreferences } from './useMotionPreferences';

export function useEntrance({
  phase = 'scroll', kind = 'content', progression = false, index = 0, count = 0, disabled = false
} = {}) {
  const ref = useRef(null);
  const triggered = useRef(false);
  const completed = useRef(false);
  const preferences = useMotionPreferences();
  const { ready, phone, reduced } = preferences;
  const settings = entranceSettings({ phase, kind, progression, index, count, phone, reduced: reduced || disabled });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !ready) return;
    let alive = true;
    let observer;
    let resizeObserver;
    let animation;
    let completionTimer;
    let threshold;
    let prepared = false;
    const config = entranceSettings({ phase, kind, progression, index, count, phone, reduced: reduced || disabled });
    Object.assign(element.dataset, {
      effectDuration: String(config.duration), effectDelay: String(config.delay),
      effectTravel: String(config.travel), effectScale: String(config.scale)
    });
    const rest = () => { element.style.opacity = '1'; element.style.transform = 'none'; };
    const finish = reason => {
      if (completed.current) return;
      completed.current = true;
      clearTimeout(completionTimer);
      animation?.cancel();
      rest();
      element.dataset.effectState = 'complete';
      if (reason) element.dataset.effectBypass = reason;
      observer?.disconnect();
    };
    if (completed.current || triggered.current || reduced || disabled || !element.animate) {
      finish(reduced ? 'reduced-motion' : disabled ? 'reading-mode' : undefined);
      return;
    }
    function isRendered() {
      const bounds = element.getBoundingClientRect();
      return element.getClientRects().length > 0 && bounds.width > 0 && bounds.height > 0 &&
        getComputedStyle(element).visibility !== 'hidden';
    }
    function prepare() {
      if (!isRendered()) {
        rest();
        element.dataset.effectState = 'hidden-alternative';
        prepared = false;
        return false;
      }
      if (!prepared) {
        element.style.opacity = String(config.from.opacity);
        element.style.transform = config.from.transform;
        element.dataset.effectState = 'waiting';
        prepared = true;
      }
      return true;
    }
    function start() {
      if (!alive || triggered.current || !prepare()) return;
      triggered.current = true;
      element.dataset.effectRuns = '1';
      element.dataset.effectTriggeredAt = String(performance.now());
      element.dataset.effectState = 'running';
      observer?.disconnect();
      rest(); // Underlying state is readable if playback is interrupted or unavailable.
      animation = element.animate([config.from, config.to], config.timing);
      completionTimer = window.setTimeout(() => { if (alive) finish(); }, config.timing.delay + config.timing.duration + 100);
      animation.finished.then(() => { if (alive) finish(); }).catch(() => {});
    }
    function measure() {
      if (triggered.current || completed.current || !prepare()) return;
      const amount = entranceThreshold(element.offsetHeight, window.innerHeight);
      element.dataset.effectThreshold = String(amount);
      if (phase === 'hero') return;
      if (threshold === amount && observer) return;
      threshold = amount;
      observer?.disconnect();
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && (amount === 0 || entry.intersectionRatio >= amount)) start();
        }
      }, { threshold: amount });
      observer.observe(element);
    }
    // Keyboard focus must never land in invisible content.
    const focus = () => { triggered.current = true; finish('keyboard-focus'); };
    element.addEventListener('focusin', focus);
    if (phase === 'hero') {
      prepare();
      // Same-turn scheduling also avoids double playback in React Strict Mode.
      queueMicrotask(start);
    } else if ('IntersectionObserver' in window) {
      measure();
    } else {
      finish('observer-unavailable');
    }
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        measure();
        if (phase === 'hero' && !triggered.current) start();
      });
      resizeObserver.observe(element);
    }
    window.addEventListener('resize', measure);
    return () => {
      alive = false;
      clearTimeout(completionTimer);
      animation?.cancel();
      observer?.disconnect();
      resizeObserver?.disconnect();
      element.removeEventListener('focusin', focus);
      window.removeEventListener('resize', measure);
      rest();
    };
  }, [ready, phone, reduced, phase, kind, progression, index, count, disabled]);

  return { ref, settings, preferences };
}
