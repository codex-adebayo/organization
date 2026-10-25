# Data automation agency content and hero scroll journey

## Positioning
Working identity: FORME. Proposed offer: connect tools, automate repeatable workflows, and make operational data useful. The headline is “Less busywork. More flow.”

The content covers data integration, workflow automation, reporting/insight, and bounded AI-assisted tasks with review and fallback paths. Service scope remains proposed until discovery; no integration availability, client relationship, or measured outcome is fabricated.

## Hero experience
The existing white panels and gold route remain in the opening hero. A new section inside the same hero experience explains Connect → Automate → Act. All three text chapters are in the document and remain readable without JavaScript.

Desktop uses a sticky companion visual. Motion useScroll tracks the section from start/start to end/end; a damped motion value drives a second instance of the same HeroStage geometry. The intro keeps its loop mode. Scroll mode does not start a competing timer. Unique SVG and control IDs keep the two instances independent; offscreen suspension limits unnecessary playback.

A phase label and native anchor links provide orientation. Reduced motion removes pinning and keeps a static composition. Phone layouts stack the visual and chapters without artificial viewport-height reading sections. Pause freezes the scroll-driven object; resume uses the current scroll position.

## Content coverage
- Hero: clear offer, data journey, and a brief CTA.
- Principles: choose a practical workflow and keep people in control.
- Use cases: illustrative lead intake, reporting, and operations handoff blueprints.
- Services: integration, workflows, reporting, and AI assistance.
- Process: discover, design, build, deliver.
- Contact: describe repeated work, source tools, budget context, and timing.
- Metadata/navigation/footer: consistent data automation positioning.

The brief is generated in the browser as automation-brief.txt. It does not submit data, send email, or claim delivery.

## Source history
The prior futuristic hero was merged into the effects branch rather than main. This PR carries that merged tree forward alongside the automation content, with main and the hero merge recorded as parents. It does not discard the existing main history.

## Verification
Cloud checks cover production build, story validation, the existing numerical effects contract, both hero modes, scroll stage changes, pause/resume, natural/reduced-motion layouts, unique SVG IDs, content without JavaScript, metadata, workflow dialogs, and downloaded brief contents. Browser emulation is not physical-device testing.
