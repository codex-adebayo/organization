// Seconds and unitless ratios at the public API; browser timing uses milliseconds.
export const EFFECTS = Object.freeze({
  ease: Object.freeze([0.22, 1, 0.36, 1]),
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  heroDuration: 0.8,
  scrollDuration: 1,
  scrollDelay: 0.1,
  visibility: 0.15,
  desktopTravel: 12,
  phoneTravel: 8,
  mediaScale: 0.98,
  staggerStep: 0.1,
  feedbackDuration: 0.25,
  hoverScale: 1.01,
  pressScale: 0.99,
  hoverOpacity: 0.9,
  pressOpacity: 0.8,
  phoneQuery: '(max-width: 600px)',
  reducedQuery: '(prefers-reduced-motion: reduce)',
  hoverQuery: '(hover: hover) and (pointer: fine)'
});

export function entranceThreshold(height, viewportHeight) {
  return height > viewportHeight ? 0 : EFFECTS.visibility;
}

export function entranceSettings({
  phase = 'scroll', kind = 'content', phone = false, reduced = false,
  progression = false, index = 0, count = 0
} = {}) {
  if (!['hero', 'scroll'].includes(phase)) throw new RangeError('Unknown entrance phase');
  if (!['content', 'media'].includes(kind)) throw new RangeError('Unknown entrance kind');
  if (progression && (!Number.isInteger(count) || count < 2 || count > 4 ||
    !Number.isInteger(index) || index < 0 || index >= count)) {
    throw new RangeError('Only 2–4 progression siblings may stagger, in reading order');
  }
  if (!progression && (index !== 0 || count !== 0)) {
    throw new RangeError('Stagger offsets require an explicit progression group');
  }
  const travel = kind === 'media' || reduced ? 0 : phone ? EFFECTS.phoneTravel : EFFECTS.desktopTravel;
  const duration = reduced ? 0 : phase === 'hero' ? EFFECTS.heroDuration : EFFECTS.scrollDuration;
  const stagger = reduced || phone || !progression ? 0 : index * EFFECTS.staggerStep;
  const delay = reduced ? 0 : (phase === 'hero' ? 0 : EFFECTS.scrollDelay) + stagger;
  const scale = kind === 'media' && !reduced ? EFFECTS.mediaScale : 1;
  return {
    travel, scale, duration, delay,
    from: { opacity: reduced ? 1 : 0, transform: kind === 'media' ? 'scale(' + scale + ')' : 'translateY(' + travel + 'px)' },
    to: { opacity: 1, transform: 'none' },
    timing: { duration: duration * 1000, delay: delay * 1000, easing: EFFECTS.easing, fill: 'both' }
  };
}

export function feedbackSettings({ scaleOccupied = false, reduced = false } = {}) {
  const property = scaleOccupied ? 'opacity' : 'scale';
  return {
    property,
    rest: 1,
    hover: reduced ? 1 : scaleOccupied ? EFFECTS.hoverOpacity : EFFECTS.hoverScale,
    press: reduced ? 1 : scaleOccupied ? EFFECTS.pressOpacity : EFFECTS.pressScale,
    timing: { duration: reduced ? 0 : EFFECTS.feedbackDuration * 1000, delay: 0, easing: EFFECTS.easing }
  };
}
