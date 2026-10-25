# Storytelling and motion system

## Agent access
The root AGENTS.md routes future design agents to two repository-local skills:
- .agents/skills/design-motion-principles/SKILL.md with both Create and Audit workflows and their reference files.
- .agents/skills/kino/SKILL.md for portable stories and their fallbacks.

These are guidance available to agents reading this repository. They do not create an agent service, execute remote repository instructions automatically, or schedule ongoing work. The vendored skills retain their MIT licences. Source tree snapshots and runtime versions are recorded in design-sources.json. Refresh copies deliberately and review changes rather than following upstream main automatically.

## Design decision
The context is an agency marketing site: production polish first, bounded creative expression second, and restraint for repeated controls. This weighting follows the supplied skill's context mapping. It interprets publicly published design principles and does not imply endorsement by the named designers.

## Division of responsibility
Kino renders a two-chapter editorial story between the hero and selected work. The first chapter establishes a clear idea; the second turns it into a visual world. The story starts from the editorial recipe, uses a portable version-1 document, and references trusted application components by stable registration names.

The actual copy and visual components are in AgencyStory.jsx. Component references and layout are in lib/agency-story.mjs; entrance timing now comes from lib/effects-contract.mjs. No arbitrary JSX or executable code is serialized into the portable document.

Desktop chapters use native sticky positioning over a bounded 170vh each. The Story runtime switches to reading below 640px and for reduced motion; tall scenes unpin automatically. The server starts in reading mode so unhydrated and no-JavaScript content remains readable. A visible control also lets any visitor choose reading mode. All layer end states remain visible.

The later Effects specification supersedes the original project-panel transitions. Dialog dismissal is immediate, with native focus trapping and trigger focus restoration. The React effects hooks own entrances and fallback feedback; Kino retains story layout with its old layer tracks removed. See react-effects.md for the exact rule mapping.

Removed the perpetual hero orbit loop. Working hover treatments are preserved. Section entrances follow the exact one-second tween in the later Effects specification.

## Verification
npm run check:story serializes the actual application document, validates it with parseStory, checks component registrations, verifies round-trip equality, and runs Kino doctor. GitHub Actions publishes the resulting agency.kino.json with the browser report.

Playwright verifies story presence, desktop progression, natural mobile/reduced-motion layouts, reading-mode switching, project dialog exits, focus restoration, rapid repeated openings, no-JavaScript content, and existing form/navigation behaviour. Native browser features and external font failures are checked where relevant. No external media is required by the story.

No Storyboard editor or authoring route is exposed to visitors. Add one only if an editor is needed; it must remain separate from the public runtime.
