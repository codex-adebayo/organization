# Cinematic direction: from complexity to clarity

The looping panel hero and scroll-linked golden-record scene have been removed.
The hero is a static ink-dark composition: ivory editorial type, warm gold accents,
a quiet architectural light seam, and a curved horizon. A compact three-column
Connect → Automate → Act section preserves all of the workflow explanation.
On narrow screens it becomes a single reading column. Neither section needs
a scene timer, scroll subscription, SVG, pause control or decorative animation.

The remaining agency Kino story is unchanged. The hero and journey retain the
existing useEntrance groups; they run once, obey the Effects contract and finish
immediately with reduced motion. The primary brief link uses shared interaction
feedback. Native scrolling, keyboard access and server-rendered content remain.

## Reference interpretation

- [mo.js](https://github.com/mojs/mojs): its modular composition, declarative
  control and deliberate sequencing informed the separation of atmosphere,
  content and feedback. Its bursts, swirls and loops are not used. No mo.js
  dependency or source code was added.
- [Design Motion Principles](https://github.com/kylezantos/design-motion-principles):
  Jakub leads polish, Jhey informs bounded visual exploration, and Emil governs
  navigation and form efficiency. The most useful application here is restraint:
  removing repeated motion lets composition, contrast and pacing carry the story.
- The repository's Effects contract takes precedence over general recipes:
  no blur, rotation, horizontal travel, bounce or exit effects were added.

## Verification

GitHub Actions builds Next.js and runs Playwright. Updated checks cover removal
of both scenes and their controls, anchor destinations, reduced motion, responsive
overflow, server-rendered chapters and the existing enquiry/dialog journeys.
The browser-review artifact contains desktop and mobile screenshots; automated
checks alone do not establish real-device performance.
