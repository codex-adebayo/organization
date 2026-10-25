# Effects specification translated to React

The user explicitly authorised translating the native-Framer brief into React variables and custom hooks. This implementation uses React plus the browser Web Animations API for playback; it is not Framer editor configuration and adds no animation dependency.

## Mathematical contract

All public durations are seconds. Browser timing is milliseconds: ms = 1000 × seconds.

Let B(p) be cubic-bezier(0.22, 1, 0.36, 1), with p clamped to [0, 1]. Let t be seconds since the group first satisfies its observer condition, d its delay, and D its duration. Progress p = clamp((t − d) / D, 0, 1).

- Opacity: B(p), from 0 to 1.
- Copy/mixed/card collection vertical offset: h × (1 − B(p)), where h = 12px above phone and 8px at phone.
- Standalone media scale: 0.98 + 0.02 × B(p); no translation.
- Hero: D = 0.8, d = 0; starts at mount.
- Scroll: D = 1, d = 0.1; starts from the first qualifying view entry.
- Explicit progression siblings: add i × 0.1 to d for zero-based i only when there are 2–4 items. Phone removes that offset, retaining d = 0.1.
- Visibility amount: 0.15 unless layout height > viewport height, then 0. The layout measurement uses offsetHeight, unaffected by entrance scale.
- Fallback feedback: D = 0.25, d = 0; scale 1 → 1.01 on hover and 0.99 on press. If scale is occupied, opacity 1 → 0.9 / 0.8.
- Reduced motion: final visible state, duration 0, delay 0, travel 0, scale 1, and no hover/press movement.

The browser evaluates the cubic Bézier continuously. No timers schedule lower sections from page load.

## Rule-by-rule mapping

| Rule | Implementation |
| --- | --- |
| 1 — Entire scope, replace conflicts | Hero through footer has 19 named groups. Removed the old Motion.jsx observer and CSS reveal engine. Removed Kino tracks and dialog exits. Kept layout, colours, type, content, and working interaction feedback. |
| 2 — Non-overlapping groups | Reveal accepts semantic element types so grids and sticky positioning remain intact. No Reveal contains another. Related hero copy/actions and contact copy/form move together. Story copy/media and portfolio/service collections are separate. Navigation, story control, backgrounds and footer utilities are excluded. |
| 3 — Exact tween and states | EFFECTS and entranceSettings in lib/effects-contract.mjs define easing, timing, opacity, vertical travel and media scale. No keyframe contains blur, rotation, X travel, spring, bounce or exit. |
| 4 — Mount/view triggering, once | useEntrance starts hero groups on mount. Each scroll group has an independent IntersectionObserver with 0.15 or tall-group 0. ResizeObserver and resize events update that threshold. A ref latch prevents replay. |
| 5 — Groups and progression | Every group reveals together. Only the four process-step articles opt into progression/count/index. The three unrelated portfolio studies remain one collection; services are not staggered. Invalid counts/indices throw rather than silently generating long-list staggers. |
| 6 — Separate interaction feedback | useInteractionFeedback retargets from computed state so interruption is continuous. Feedback uses the independent CSS scale property, separate from entrance transforms. The API supports opacity when scale is occupied. Existing portfolio hover treatments and submit hover colour are preserved; inline links are not scaled. |
| 7 — Breakpoints/alternatives | useMotionPreferences follows the existing 600px phone boundary. Phone changes travel to 8px and removes only progression offsets. Hidden alternatives remain unplayed until laid out. Each group is measured; no desktop copy is animated while display:none. Existing 600/640/700/900/1600px boundaries are covered in browser checks. |
| 8 — Reduced motion | A shared matchMedia subscription handles initial preference and live changes. A running or waiting entrance is cancelled into its final visible state; the latch prevents it from replaying when preferences change back. The story’s reading control also bypasses its groups. CSS supplies a final-state safety override. SSR/no-JavaScript content is readable without playback. |
| 9 — Verification | Pure contract tests check all numeric variants and guardrails. Playwright records actual browser keyframes/timing, samples in-progress opacity, checks independent triggering, no replay/nesting, all groups, responsive boundaries, hidden alternatives, interrupted feedback and dynamic preferences. Screenshots are layout evidence only. |

## Coverage inventory

- Hero: hero-copy. The later futuristic-background request replaces hero-media with a decorative, non-entrance scene. See futuristic-hero.md.
- Story: story-heading; clarity copy/media; expression copy/media. Kino retains the same chapters and desktop pinning; the shared hook replaces its scroll-interpolated layer entrances.
- Work: work-copy; work-projects (one collection).
- Studio: studio-content (one mixed-content statement).
- Expertise: expertise-copy; expertise-services (one collection and its note).
- Process: process-intro; process-heading (existing sticky heading, not an animated ancestor); four process-step siblings.
- Contact: contact-content (heading, explanatory copy, form/actions).
- Footer: footer-promo. Edition label and back-to-top utility remain static.

The service accordion uses semantic details/summary. Its control feedback is independent of the collection entrance. Native dialog focus trapping remains; dismissal is immediate because this specification prohibits exits.

## Files and lifecycle

- lib/effects-contract.mjs: pure constants and mathematical settings.
- hooks/useMotionPreferences.js: SSR-safe shared media-query subscription.
- hooks/useEntrance.js: component-scoped observer, measurement, single-play latch, cleanup and playback.
- hooks/useInteractionFeedback.js: hover/press state and interruption.
- components/effects/Reveal.jsx: semantic entrance boundary and reading-mode scope.
- components/effects/Feedback.jsx: control wrapper, with preserveHover/preservePress and scaleOccupied options.

The server emits visible content. After hydration the hook prepares the initial state before playback. An unavailable observer or animation API fails open. Keyboard focus immediately restores a waiting group so a focused control cannot remain invisible. Unmount cancels playback and observers. Changing breakpoints during a running tween resolves to the final state rather than replaying an entrance.

## Verification limits

Cloud Chromium playback tests exercise timing and interaction. Responsive resizing and mobile emulation are not physical-device testing, and screenshots do not establish timing. Manual visual review, Safari/Firefox playback, and production field performance are not claimed.
