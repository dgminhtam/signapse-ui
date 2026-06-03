## Why

Signapse needs a public, localized entry page that explains the product to market-focused external users before they enter the authenticated dashboard. The current locale root is used by the protected workspace overview, which makes `/{lang}` unavailable as the natural landing route for a bilingual product site.

## What Changes

- Add a public landing page at `/{lang}` for supported locales such as `/vi` and `/en`.
- Move the current protected workspace overview entry from `/{lang}` to `/{lang}/dashboard`.
- Position Signapse as an AI Market Intelligence Workspace for analyst, trader, research, and market-focused power users.
- Use gated-market CTA behavior:
  - Primary public CTA: request access.
  - Secondary public CTA: sign in.
  - Authenticated CTA: open dashboard.
- Base landing page messaging on the product copy in `D:\Github\signapse\docs\product\landing-page-copy.md`, adapted for concise localized UI.
- Present Signapse around the `Event -> Reaction -> Narrative` thesis, with evidence-based analysis and explicit avoidance of prediction, trading advice, signal bot, or auto-trading claims.
- Prepare the page to accept product screenshots or media assets later without blocking the route/copy/layout implementation.

## Capabilities

### New Capabilities
- `public-landing-page`: Public localized landing page behavior, messaging, CTA states, and visual composition.

### Modified Capabilities
- `nextjs-locale-routing`: Locale root `/{lang}` becomes the public landing entry, while the authenticated dashboard moves to `/{lang}/dashboard`.
- `workspace-root-overview-gate`: The protected workspace overview is no longer the locale root and must remain permission-gated at the new dashboard route.
- `product-localization`: Landing page user-facing copy must be available through dictionaries for both supported locales.

## Impact

- Affected routes: `app/[lang]/page.tsx`, `app/[lang]/dashboard/page.tsx`, and any redirects or links that assume the dashboard lives at `/{lang}`.
- Affected app shell behavior: the landing page must not render the protected `(main)` dashboard shell.
- Affected navigation: authenticated dashboard entry links and post-auth redirects may need to target `/{lang}/dashboard`.
- Affected i18n: add landing page dictionary entries in English and Vietnamese.
- No backend API contract changes are expected.
- No new third-party dependencies are expected.
