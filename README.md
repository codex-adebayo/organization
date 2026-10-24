# FORME — agency experience

A fresh digital agency website built directly in GitHub. FORME is an editable working identity, not a confirmed company name. None of the previous finance application's code is reused.

## Experience

- Responsive editorial typography, a custom CSS hero composition, and reduced-motion support.
- Three clearly labelled self-initiated portfolio concepts with accessible native case-study dialogs.
- Expandable service descriptions, studio positioning, and a four-stage process.
- Project brief builder with validation and a browser-generated text download. It does **not** send email, submit an enquiry, or persist personal information.
- Semantic sections, skip navigation, keyboard focus, mobile navigation, and progressive enhancement.

## Source

`index.html` provides the complete content. `styles.css` supplies the responsive design and motion. `app.js` handles navigation, reveals, project dialogs, and brief creation. Google Fonts is an optional external stylesheet; system fonts remain usable if it is unavailable. No framework or production dependencies are required.

## Cloud verification

GitHub Actions installs the pinned Playwright test dependency, checks JavaScript syntax, and runs Chromium checks at desktop and mobile sizes. Tests cover projects, keyboard dismissal/focus restoration, reduced motion, narrow-screen overflow, brief downloads, content without JavaScript, and review screenshots.

Open the **Website verification** run and download **browser-review** for the HTML test report and screenshots. Runtime delivery is static; there is no bundling step.

## Preview and hosting

The repository remains private. This PR does not publish the site or change repository visibility. Deploy the repository root to any approved static host; serve `index.html`, `styles.css`, `app.js`, and `favicon.svg`. GitHub Pages availability depends on the account plan and repository settings.

For an optional developer preview, serve the root with a static HTTP server. No local checkout was used to author this implementation.

## Before public launch

1. Confirm the agency name, identity, audience, actual capabilities, and legal owner.
2. Replace concept projects with approved case studies, or keep their concept labels.
3. Add real contact information and connect a secure enquiry endpoint with explicit success/error handling. Replace the download-only wording only when delivery is tested.
4. Confirm budget bands and any privacy/legal obligations for the chosen form destination.
5. Review browser screenshots, accessibility, and production performance. Automated smoke tests do not establish full accessibility compliance or field performance.
6. Set the final domain, canonical metadata, and social preview assets.

See [the creative brief](docs/design-direction.md) for the intended visitor journey.
