'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { animate, motion, useAnimationControls, useInView, useMotionValue, useMotionValueEvent } from 'motion/react';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import { HERO_ROUTE, HERO_CYCLE_SECONDS, HERO_PANELS } from '../lib/hero-scene.mjs';
import Feedback from './effects/Feedback';

function Panel({ panel, index, running, reduced }) {
  const controls = useAnimationControls();
  useEffect(() => {
    if (reduced) {
      controls.stop();
      controls.set({ rotateX: 0, rotateY: 0, rotateZ: 0 });
    } else if (running) {
      controls.start({
        rotateX: [null, panel.tilt, -panel.tilt * 0.45, 0],
        rotateY: [null, -panel.tilt * 0.65, panel.tilt * 0.4, 0],
        rotateZ: [null, 2, -2, 0]
      });
    } else controls.stop();
    return () => controls.stop();
  }, [controls, panel, running, reduced]);
  return <div className="hero-tile-slot absolute" style={{
    left: panel.left + '%', top: panel.top + '%', width: panel.width + '%', height: panel.height + '%'
  }}>
    <motion.div data-hero-panel={index}
      className="hero-panel relative h-full w-full rounded-[1.25rem] border border-white/80 bg-white"
      initial={false} animate={controls}
      transition={{ duration: 9 + index * 0.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1], times: [0, 0.35, 0.7, 1] }}
      style={{ transformOrigin: panel.pivot, transformStyle: 'preserve-3d' }}>
      <span className="hero-panel-edge absolute inset-x-0 bottom-0" />
    </motion.div>
  </div>;
}

export default function HeroStage({ externalProgress, controlId = 'hero-motion-toggle', labelPrefix = 'hero' }) {
  const scene = useRef(null);
  const path = useRef(null);
  const length = useRef(0);
  const inView = useInView(scene, { amount: 0.05 });
  const { ready, reduced } = useMotionPreferences();
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const progress = useMotionValue(0.35);
  const x = useMotionValue(440);
  const y = useMotionValue(125);
  const unique = useId().replaceAll(':', '');
  const ids = { gold: 'hero-gold-' + unique, glow: 'hero-glow-' + unique, sheen: 'hero-sheen-' + unique };
  const running = ready && inView && pageVisible && !reduced && !paused;

  function position(value) {
    if (!path.current || !length.current) return;
    const point = path.current.getPointAtLength(value * length.current);
    x.set(point.x); y.set(point.y);
  }
  useMotionValueEvent(progress, 'change', position);
  useMotionValueEvent(externalProgress ?? progress, 'change', latest => {
    if (externalProgress && running) progress.set(latest);
  });
  useEffect(() => {
    length.current = path.current.getTotalLength();
    position(progress.get());
  }, [progress]);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (reduced) { progress.set(0.35); return; }
    if (!running) return;
    if (externalProgress) { progress.set(externalProgress.get()); return; }
    let active = true;
    let playback;
    function loop() {
      if (!active) return;
      if (progress.get() >= 0.99999) progress.set(0);
      const start = progress.get();
      playback = animate(progress, [start, 1], {
        duration: HERO_CYCLE_SECONDS * (1 - start), ease: 'linear',
        onComplete: () => { if (active) { progress.set(0); loop(); } }
      });
    }
    loop();
    return () => { active = false; playback?.stop(); };
  }, [running, reduced, progress, externalProgress]);

  return <>
    <div ref={scene} data-hero-scene data-running={String(running)}
      data-paused={String(paused)} data-mode={externalProgress ? "scroll" : "loop"} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="hero-floor absolute inset-0" />
      <div className="hero-sculpture">
        <div className="hero-panel-field absolute inset-0">
          {HERO_PANELS.map((panel, index) => <Panel key={index} panel={panel} index={index} running={running} reduced={reduced} />)}
        </div>
        <svg data-hero-track viewBox="0 0 900 700" className="hero-track absolute inset-0 h-full w-full" fill="none">
          <defs>
            <radialGradient id={ids.gold} cx="30%" cy="24%" r="78%">
              <stop offset="0" stopColor="#fff8c9" /><stop offset="0.25" stopColor="#f6d375" />
              <stop offset="0.6" stopColor="#c48b2e" /><stop offset="0.85" stopColor="#94601d" /><stop offset="1" stopColor="#e4bb61" />
            </radialGradient>
            <linearGradient id={ids.sheen} x1="100" y1="100" x2="780" y2="580" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f6e9bb" /><stop offset="0.5" stopColor="#c19a4d" /><stop offset="1" stopColor="#f1d18a" />
            </linearGradient>
            <filter id={ids.glow} x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#a16d21" floodOpacity="0.28" />
              <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#f3c861" floodOpacity="0.55" />
            </filter>
          </defs>
          <path d={HERO_ROUTE} stroke="#c5c7cb" strokeWidth="42" transform="translate(0 5)" opacity="0.6" />
          <path d={HERO_ROUTE} stroke="#ffffff" strokeWidth="40" />
          <path d={HERO_ROUTE} stroke="#dcdee1" strokeWidth="25" />
          <path ref={path} data-hero-route d={HERO_ROUTE} stroke="#f3f4f5" strokeWidth="19" />
          <motion.path data-hero-trace d={HERO_ROUTE} stroke={'url(#' + ids.sheen + ')'} strokeWidth="2.2"
            strokeLinecap="round" style={{ pathLength: progress, opacity: 0.65 }} />
          <motion.circle data-hero-object cx={x} cy={y} r="22" fill={'url(#' + ids.gold + ')'}
            stroke="#f8df9e" strokeWidth="1.3" filter={'url(#' + ids.glow + ')'} />
          <motion.circle cx={x} cy={y} r="16" stroke="#fff1c0" strokeWidth="0.65" opacity="0.5" />
        </svg>
      </div>
      <div className="hero-veil absolute inset-0" />
    </div>
    <Feedback id={controlId} type="button" className="hero-motion-toggle absolute z-30 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-4 py-3"
      aria-label={reduced ? 'Animation disabled by reduced motion' : paused ? 'Resume ' + labelPrefix + ' animation' : 'Pause ' + labelPrefix + ' animation'}
      aria-pressed={paused} disabled={!ready || reduced} onClick={() => setPaused(value => !value)}>
      <span aria-hidden="true">{paused || reduced ? '▷' : 'Ⅱ'}</span>
      {reduced ? 'Motion reduced' : paused ? 'Resume animation' : 'Pause animation'}
    </Feedback>
  </>;
}
