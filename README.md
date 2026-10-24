# FORME — Next.js agency app

An editorial digital agency website built with the Next.js App Router and React. FORME is an editable working identity. Portfolio studies are clearly labelled self-initiated concepts.

## Architecture

- `app/layout.jsx`: document shell, metadata, theme colour, and global styles.
- `app/page.jsx`: server-rendered homepage content and section structure.
- `components/Header.jsx`: responsive navigation.
- `components/HeroStage.jsx`: interactive hero composition.
- `components/Projects.jsx`: portfolio concepts and accessible native dialogs.
- `components/BriefForm.jsx`: validated, browser-only project brief download.
- `components/Motion.jsx`: scroll reveals with cleanup and reduced-motion support.
- `public/favicon.svg`: original icon.

The main content renders on the server. Small client components handle state and browser APIs; the old standalone HTML and imperative JavaScript entry points are removed.

## Commands

Node.js 22 or newer is recommended.

```sh
npm install
npm run dev
npm run build
npm start
```

The production build is served by Next.js. Deploy through a Next.js-compatible host or Node.js runtime; this is no longer a buildless static root.

## Cloud verification

All source changes are made directly through GitHub. GitHub Actions installs dependencies, checks JavaScript syntax, runs a production Next.js build, then executes Playwright against `next start`.

Tests cover desktop/mobile journeys, project dialogs, keyboard focus, reduced motion, 320–1440 px overflow, brief downloads, content without JavaScript, metadata, asset delivery, and 404 routes. The browser-review artifact contains screenshots and the HTML report.

## Content and enquiry status

The preview creates a downloadable brief in the visitor's browser. No email is sent, no personal information is persisted, and no server form destination is configured. The UI states this explicitly.

Before public launch, confirm the agency name, actual capabilities, approved portfolio, contact destination, commercial budget bands, legal details, and hosting/domain. Connect and test enquiry delivery before replacing the download-only wording.

Google Fonts is an optional external stylesheet with system fallbacks. Review accessibility and production performance on real devices before launch; automated checks do not establish complete compliance or field performance.

See [the design direction](docs/design-direction.md).
