## 1. Static Site Structure

- [x] 1.1 Create the self-contained `coming-soon/` project with Vietnamese `index.html`, English `en/index.html`, shared CSS, shared JavaScript, and local asset directories.
- [x] 1.2 Copy `public/images/signapse_logo_dark.svg` unchanged into the static project, record its source, and add the required favicon and social-preview assets.
- [x] 1.3 Add `robots.txt` and locale-specific canonical, `hreflang`, Open Graph, and document-language metadata for `/` and `/en/`.

## 2. Localized Launch Experience

- [x] 2.1 Build parallel semantic Vietnamese and English documents with the logo header, reciprocal language switch, coming-soon hero, concise supporting statement, countdown region, and exactly three product pillars.
- [x] 2.2 Add the approved dark Signapse design tokens, responsive one-column and asymmetric desktop layouts, tabular countdown numerals, visible focus treatment, and decorative signal artwork hidden from assistive technology.
- [x] 2.3 Keep all visible and assistive copy evidence-centered and confirm the documents contain no form, request-access control, email capture, fabricated social proof, prediction claim, trade signal, or investment-advice claim.

## 3. Countdown Behavior

- [x] 3.1 Implement a shared vanilla JavaScript countdown to `2026-09-01T09:00:00+07:00` with pure remaining-time calculation, once-per-second rendering, and values clamped at zero.
- [x] 3.2 Implement localized pre-launch, launched, and `<noscript>` states, display the absolute `UTC+7` launch time, avoid per-second live announcements, and announce only the launched-state transition politely.
- [x] 3.3 Add dependency-free deterministic tests for countdown calculations before, at, and after the launch instant and for localized DOM state selection.

## 4. Deployment Handoff Documentation

- [x] 4.1 Document local static serving, the Vercel `Other` preset with `coming-soon/` as Root Directory and no build command, expected `/` and `/en/` routes, and the copied-logo source.
- [x] 4.2 Document preview verification, Vercel domain inspection, Cloudflare DNS-only apex cutover, `www.signapse.cloud` redirect, preservation of `dev.signapse.cloud`, rollback, and the later production-domain reassignment runbook.

## 5. Agent-Owned Verification

- [x] 5.1 Run the dependency-free countdown tests and static contract checks for locale parity, language metadata, canonical and `hreflang` links, local asset resolution, prohibited forms/claims, and remote runtime dependencies.
- [x] 5.2 Serve the static directory locally and deterministically inspect successful responses for `/`, `/en/`, shared assets, `robots.txt`, and unknown-route behavior without changing application routes.
- [x] 5.3 Run repository lint and typecheck, inspect the final diff for scope and encoding, and validate the OpenSpec change strictly.

User-owned deployment handoff: create or authorize the Vercel project, assign `signapse.cloud` and `www.signapse.cloud`, update Cloudflare DNS with the inspected record, and perform the live domain cutover. These external-account actions are not archive-blocking checkboxes.

User-owned manual QA: review the final visual appearance in representative real browsers and approve the launch copy before changing public DNS.
