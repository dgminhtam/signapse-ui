## Why

Signapse needs a lightweight public presence at `signapse.cloud` before the product launch on September 1, 2026, while the existing Next.js application remains isolated at `dev.signapse.cloud`. A dedicated static site provides a fast, low-risk launch surface without coupling public traffic to Clerk, application routing, or backend availability.

## What Changes

- Add a standalone static coming-soon site intended for deployment to `signapse.cloud` independently of the existing Next.js project.
- Provide Vietnamese content at `/` and equivalent English content at `/en/`, with an accessible language switch between them.
- Show the Signapse logo, a concise evidence-centered product introduction, and three short product pillars: Chart Annotation, grounded Market Query, and connected market context through the Knowledge Graph.
- Show a localized countdown to `2026-09-01T09:00:00+07:00`, including deterministic pre-launch, launch, post-launch, and no-JavaScript states.
- Exclude waitlist forms, early-access requests, email capture, fabricated social proof, and automatic launch-time redirects.
- Prepare the site for an independent Vercel project and apex-domain cutover without changing `dev.signapse.cloud`.

## Capabilities

### New Capabilities

- `coming-soon-site`: Defines the bilingual static launch page, branded presentation, countdown behavior, accessibility, and independent deployment boundary for `signapse.cloud`.

### Modified Capabilities

None.

## Impact

- Adds a new repo-local static site area and its self-contained assets, metadata, styles, and countdown script.
- Adds no runtime framework, backend API, authentication dependency, form submission, or user-data storage.
- Requires a separate Vercel project plus Cloudflare-managed DNS configuration for `signapse.cloud`; the existing application project and `dev.signapse.cloud` remain unchanged.
- Reuses an approved logo variant sourced from `public/images` and keeps the current localized Next.js landing-page contract intact.
