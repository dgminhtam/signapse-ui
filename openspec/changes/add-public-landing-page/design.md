## Context

Signapse currently uses locale-prefixed routes, with `/{lang}` occupied by the protected workspace overview through the `(main)` route group. The product now needs a public bilingual landing page at the natural locale root (`/vi`, `/en`) for external analyst, trader, research, and market-focused power-user audiences.

The landing page content should draw from `D:\Github\signapse\docs\product\landing-page-copy.md`, with concise dictionary-backed copy rather than long marketing text blocks. The page should position Signapse as an AI Market Intelligence Workspace centered on `Event -> Reaction -> Narrative`, while avoiding signal bot, prediction, auto-trading, or trading-advice claims.

## Goals / Non-Goals

**Goals:**
- Make `/{lang}` the public landing page for supported locales.
- Preserve the protected workspace overview under `/{lang}/dashboard`.
- Keep dashboard pages inside the existing protected `(main)` shell.
- Keep landing page copy localized through dictionaries.
- Support CTA behavior for public and authenticated states:
  - Public primary: request access.
  - Public secondary: sign in.
  - Authenticated: open dashboard.
- Create a landing visual system that feels like a public expression of Signapse, not a dashboard page and not a generic AI SaaS template.
- Leave room for screenshots or product media that the user will provide later.

**Non-Goals:**
- Do not implement a self-serve signup flow.
- Do not add trading advice, prediction guarantees, signal claims, or auto-trading language.
- Do not change backend API contracts.
- Do not change shadcn wrapper chrome or theme tokens solely for the landing page.
- Do not require final screenshot/media assets for the first implementation pass.
- Do not add third-party visual libraries unless an implementation need emerges.

## Decisions

### Locale Root Becomes Public Landing

Move the current workspace overview route from `app/[lang]/(main)/page.tsx` to `app/[lang]/(main)/dashboard/page.tsx`, then add a new public `app/[lang]/page.tsx`.

Rationale: route groups do not appear in the URL, so the existing `(main)/page.tsx` occupies `/{lang}`. A public page outside `(main)` can avoid the protected app shell while still sharing the root locale layout, Clerk provider, localization provider, fonts, and top loader.

Alternative considered: add `/{lang}/landing` and keep `/{lang}` protected. This was rejected because `/{lang}` is the natural entry for a localized public product website, and the user explicitly selected it.

### Dashboard Route Is Explicit

Use `/{lang}/dashboard` as the authenticated product entry instead of trying to keep the protected overview at root.

Rationale: the public landing and protected app entry need distinct route semantics. `dashboard` is clear to users, supports post-auth redirects, and keeps workspace overview behavior permission-gated.

Alternative considered: `/{lang}/workspace`. This is more domain-specific, but the existing protected overview is broader than a single workspace view because it includes watchlist and narrative preview surfaces.

### Landing Copy Comes From Dictionaries

Add a landing dictionary branch to both English and Vietnamese dictionaries. Use concise section labels, headings, bodies, CTA labels, feature names, trust/disclaimer text, and accessible labels from the active locale.

Rationale: AGENTS and existing app rules require user-facing copy to come from dictionaries. The product copy document is source material, not runtime copy.

Alternative considered: hardcode copy in the server page. This was rejected because it would create localization drift and violate repo policy.

### CTA Behavior Is Gated

Render request-access as the primary public CTA and sign-in as the secondary public CTA. When the user is authenticated, expose open-dashboard as the primary destination.

Rationale: Signapse should not read like a self-serve commodity SaaS. Request access fits beta/external-customer positioning, while authenticated users need a direct route into the app.

Open implementation detail: if no request-access endpoint or page exists, use a stable placeholder such as `mailto:` or a documented internal contact route until the access workflow is specified.

### Visual Direction Uses Product Scene First

The landing page should use a product/workbench scene as the first-viewport visual signal. Until the user provides screenshots, implement a non-deceptive product-style composition using UI-like panels that communicate graph, events, chart context, and evidence relationships without claiming exact screenshots.

Rationale: websites and landing pages need visual assets, but the user said screenshots will arrive later. A placeholder product scene keeps the page implementable and can be replaced with real assets later.

Alternative considered: text-only landing. This was rejected because it would undersell the product and violate the visual-first direction for sites.

## Risks / Trade-offs

- Route migration can break links that assume `/{lang}` opens the dashboard -> update obvious internal links and redirects to `/{lang}/dashboard`, then run static search for root-dashboard assumptions.
- Authenticated CTA state may create hydration risk if implemented with client-only auth checks -> prefer Clerk server/SignedIn/SignedOut patterns already used by the project.
- Public landing can drift into promotional overclaiming -> keep explicit trust copy and avoid prediction/trading advice language in dictionary text.
- Product scene may look like a real screenshot before screenshots exist -> label/compose it as an illustrative workspace preview and avoid fake data that implies live claims.
- Moving the dashboard page may affect breadcrumbs/sidebar active state -> update breadcrumb mapping and navigation to treat `/dashboard` as the app home.

## Migration Plan

1. Move the protected workspace overview page into `app/[lang]/(main)/dashboard/page.tsx`.
2. Add the public landing page at `app/[lang]/page.tsx`.
3. Update internal dashboard home links, app shell navigation, post-auth targets, and redirects that point to `/{lang}` as the app home.
4. Add dictionary entries for landing and dashboard route labels in English and Vietnamese.
5. Add or update specs/tests/static checks as needed for route expectations.
6. Verify with typecheck/build and targeted static searches for stale root-dashboard assumptions.

Rollback: remove the public root page, move the workspace overview back to `(main)/page.tsx`, and restore links that target `/{lang}` as the dashboard home.

## Open Questions

- What exact destination should `Request access` use before a dedicated access-request flow exists?
- When screenshots are provided, should the first pass replace the illustrative product scene immediately or keep both scene and screenshot variants?
