'use client';
import { useLayoutEffect, useRef } from 'react';
import { feedbackSettings } from '../lib/effects-contract.mjs';
import { useMotionPreferences } from './useMotionPreferences';

export function useInteractionFeedback({ scaleOccupied = false, preserveHover = false, preservePress = false } = {}) {
  const ref = useRef(null);
  const { ready, reduced, hover: canHover } = useMotionPreferences();
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !ready) return;
    const config = feedbackSettings({ scaleOccupied, reduced });
    const property = config.property;
    let animation;
    let hovering = false;
    let pressed = false;
    element.dataset.feedbackProperty = property;
    element.dataset.feedbackDuration = String(config.timing.duration / 1000);
    function run(state) {
      if (element.disabled) return;
      const target = config[state];
      const current = getComputedStyle(element)[property] || '1';
      animation?.cancel();
      element.style[property] = String(target);
      element.dataset.feedbackState = state;
      if (!reduced && element.animate) animation = element.animate(
        [{ [property]: current === 'none' ? '1' : current }, { [property]: String(target) }], config.timing
      );
    }
    function update() {
      if (pressed && !preservePress) run('press');
      else if (hovering && !preserveHover) run('hover');
      else run('rest');
    }
    const enter = event => { hovering = canHover && event.pointerType !== 'touch'; update(); };
    const leave = () => { hovering = false; pressed = false; update(); };
    const down = event => { if (event.button === 0) { pressed = true; update(); } };
    const up = () => { pressed = false; update(); };
    const events = { pointerenter: enter, pointerleave: leave, pointerdown: down, pointerup: up, pointercancel: leave, lostpointercapture: leave, blur: leave };
    element.style[property] = '1';
    if (!reduced) Object.entries(events).forEach(([name, handler]) => element.addEventListener(name, handler));
    return () => {
      Object.entries(events).forEach(([name, handler]) => element.removeEventListener(name, handler));
      animation?.cancel();
      element.style[property] = '1';
    };
  }, [ready, reduced, canHover, scaleOccupied, preserveHover, preservePress]);
  return ref;
}
