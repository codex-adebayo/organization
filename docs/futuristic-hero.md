# Futuristic hero: panels and golden route

## Reference and scope
The user supplied a video of articulated white surfaces, a curved recessed route, and a metallic object travelling through it. The implementation uses original CSS/SVG geometry inspired by that direction; it does not copy the video's branding, footage, text, or assets.

This change is scoped to the hero. It builds on the React effects PR. The request explicitly permits decorative panel rotation and continuous route travel here, overriding the earlier entrance-only motion restrictions for this scene. The rest of the page keeps the numerical Effects contract.

## Rendering
HeroStage.jsx uses Motion for React (`motion/react`) and Tailwind CSS utilities. Six white slab panels pivot independently through rotateX, rotateY and rotateZ keyframes via each motion.div's animate control and transition props. Gradients, static edge treatments and layered shadows suggest material depth without a WebGL runtime.

An SVG route is rendered as layered strokes to form the groove. A motion.path traces its progress. The golden motion.circle uses a radial metallic gradient and a static glow filter.

The gold object and trace share one MotionValue. SVG getPointAtLength maps that progress to the exact route coordinates, so the sphere follows the same geometry instead of approximate unrelated x/y keyframes. A lap is 12 seconds with linear progress. The closed route has coincident endpoints, avoiding a visible teleport between laps. Resuming completes the remaining fraction of the lap at the same speed.

## Layering and typography
The sculpture is decorative and aria-hidden. The text occupies a higher stacking layer with a light veil behind it; the pause button is a separate accessible control above both. On narrow screens, the sculpture sits lower in the hero beneath the text.

The previous hero media entrance group is removed because the scene is a background. The hero copy keeps its existing mount entrance. No new entrance wrappers are layered around the panels.

Tailwind is integrated through its PostCSS plugin. Only theme and utilities are imported; Preflight is deliberately omitted so the established site's typography, form controls, borders, and spacing are not reset.

## Motion control
Pause/resume freezes both the route progress and panel animation. The scene also stops offscreen and while the browser document is hidden. Reduced-motion users receive a static composition with the same text and geometry, and an explanatory disabled motion control. No-JavaScript rendering retains the geometry and headline without requiring media downloads.

## Verification
Cloud tests sample actual panel transforms and gold positions, compare the sphere to the SVG route, verify pause/resume and offscreen suspension, test reduced motion and text link hit targets, and capture phone/desktop screenshots. The full effects tests also run to catch changes outside the hero.

This is CSS/SVG depth, not a physically rendered 3D scene. Chromium checks and responsive emulation do not establish physical-device or Safari/Firefox playback.
