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

## Graphite convergence sculpture

The next iteration adds one still sculpture alongside the hero copy: three graphite
channels with gold seams converge at a warm metallic core. The workflow reading
section and the removed panel animations are unchanged.

React Three Fiber 9.4.0 (React 19) and Three.js 0.180.0 power an isolated,
dynamically imported client scene. Geometry is procedural and original. A local
SVG poster uses the same three-channel silhouette and palette, requires no
JavaScript, and remains the default below 1100px, with reduced motion, during
loading, and on renderer failure or context loss. The scene is decorative,
hidden from assistive technology and does not intercept pointer or keyboard input.

The canvas renders on demand, with no useFrame callback, autoplay, camera motion,
scroll subscriptions or pointer tracking. Pixel ratio is capped at 1.5. Materials
use a procedural studio environment and warm lights; no remote models, textures
or HDR downloads are required. Three.js resources are disposed on unmount.

Sources: [React Three Fiber](https://github.com/pmndrs/react-three-fiber) provides
the React renderer; [Three.js](https://github.com/mrdoob/three.js) provides geometry,
materials and RoomEnvironment. Both are MIT-licensed dependencies. No external
model or example artwork was copied. Performance on actual devices remains
unmeasured; the static fallback protects the reading and enquiry experience.

## Restrained Shader Gradient atmosphere

The gradient shares the sculpture's existing canvas. Its plane sits behind the
object at 25% material opacity. Ink (#151A17), muted olive (#454A3B) and subdued
bronze (#806B49) provide soft tonal variation. The copy has an ink veil; workflow,
forms and navigation keep solid backgrounds. The fallback uses the same muted
palette in CSS. No gradient is used outside the hero sculpture.

@shadergradient/react 2.x is MIT-licensed:
https://github.com/ruucm/shadergradient
Its default motion, grain, looping, camera transitions and additional lighting
are disabled. Camera settings match the existing sculpture, and frameloop=demand
keeps GPU rendering idle after setup. A browser check verifies actual shader
rendering and that the frame count stops advancing, as well as shader errors.
No environment assets are fetched by the gradient.

Future feature branches and pull requests start from and target staging.
This PR also carries the approved sculpture into staging, which did not yet
contain it. Main is not modified.
