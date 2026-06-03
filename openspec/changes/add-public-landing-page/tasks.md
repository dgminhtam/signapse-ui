## 1. Route Migration

- [x] 1.1 Move the current protected workspace overview from `app/[lang]/(main)/page.tsx` to `app/[lang]/(main)/dashboard/page.tsx` while preserving its Suspense, permission, empty, error, and workspace-resolution behavior.
- [x] 1.2 Add the public locale-root landing route at `app/[lang]/page.tsx` outside the protected `(main)` shell.
- [x] 1.3 Update app home links, breadcrumb labels, sidebar/dashboard entry links, and obvious redirects that still treat `/{lang}` as the protected dashboard entry.
- [x] 1.4 Run static search for stale dashboard-root assumptions such as direct links to locale root as the authenticated app home.

## 2. Landing Content And Localization

- [x] 2.1 Add English and Vietnamese landing dictionary keys for hero, CTA labels, product thesis, problem section, workflow steps, feature highlights, differentiation, trust/disclaimer, final CTA, and accessibility labels.
- [x] 2.2 Implement CTA rendering so unauthenticated users see request-access as primary and sign-in as secondary, while authenticated users can open `/{lang}/dashboard`.
- [x] 2.3 Define the request-access destination using the best available project pattern or a documented temporary fallback if no dedicated access-request route exists.
- [x] 2.4 Ensure landing copy avoids prediction guarantees, trading advice, signal bot, and auto-trading claims.

## 3. Landing Visual Implementation

- [x] 3.1 Build the landing page layout with a product-first first viewport and visible hint of following content on mobile and desktop.
- [x] 3.2 Add a product-style illustrative workspace preview for graph, event, chart, evidence, and narrative context without depending on user-provided screenshot assets.
- [x] 3.3 Compose responsive sections for `Event -> Reaction -> Narrative`, workflow, feature highlights, differentiation, trust/disclaimer, and final CTA.
- [x] 3.4 Keep landing styling scoped to the landing surface and avoid custom-editing `components/ui` or global theme tokens solely for this page.

## 4. Verification

- [x] 4.1 Run OpenSpec validation for `add-public-landing-page`.
- [x] 4.2 Run typecheck or build-level verification appropriate for the Next.js app.
- [x] 4.3 Run static search to verify landing user-facing copy comes from dictionaries and no stale authenticated root-dashboard links remain.
- [x] 4.4 Perform deterministic code review against route, i18n, CTA, and claim-safety requirements.

User-owned manual QA note: after screenshots are provided, review the landing page visually in mobile and desktop viewports and replace the illustrative product preview if desired.
