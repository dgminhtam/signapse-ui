## Why

The current localization implementation works as a product v1, but it uses a cookie-based locale source of truth instead of the internationalized routing pattern recommended by the Next.js App Router documentation. Aligning the app with Next.js means making the locale part of the route, keeping dictionaries server-first, and removing the extra cookie locale state so routing, rendering, formatting, and backend language propagation all derive from one canonical value.

## What Changes

- **BREAKING** Replace cookie-based locale state with URL-based locale routing using `/{lang}` route segments for supported locales `vi` and `en`.
- **BREAKING** Move app routes under `app/[lang]` so layouts, pages, parallel routes, intercepting routes, auth routes, and protected main routes receive `params.lang`.
- Update `proxy.ts` to perform locale detection and redirect requests without a locale prefix to the negotiated locale path, using `Accept-Language` with `vi` as the default fallback.
- Keep Clerk route protection in the same proxy flow while making locale-prefixed auth and app routes first-class routes.
- Remove the app locale cookie, locale Server Action, and cookie-derived locale helpers from the i18n runtime.
- Split dictionary loading into a server-first Next.js pattern using `server-only` and per-locale dynamic imports.
- Keep Client Components localized through a provider that receives the selected locale and dictionary from `app/[lang]/layout.tsx`.
- Bind locale-aware date, number, percent, and currency formatters to the active route locale so callers do not accidentally fall back to Vietnamese.
- Update the language selector to switch locale by replacing the current URL prefix while preserving the rest of the path and query string.
- Update backend API language propagation so `Accept-Language` is derived from the active route locale, not a cookie.
- Remove backward-compatibility cookie behavior and do not preserve `/path` as a stable app URL; unprefixed app URLs redirect to `/{lang}/path`.

## Capabilities

### New Capabilities

- `nextjs-locale-routing`: Covers canonical locale-prefixed routing, Next.js-style locale negotiation, server-first dictionary loading, locale-bound formatting, language switching through route changes, and backend `Accept-Language` propagation from the route locale.

### Modified Capabilities

- None.

## Impact

- Affected routing: `proxy.ts`, root layout, auth route group, protected main route group, parallel quick-detail route, intercepting quick-detail routes, and all route links/navigation assumptions.
- Affected i18n layer: locale config, dictionary modules, server helpers, client provider, format helpers, language selector, and removal of cookie/Server Action locale state.
- Affected API layer: shared backend fetch helpers and any Server Actions that need the active route locale for fallback messages or `Accept-Language`.
- Affected UI surfaces: all components that build links, call formatters, or depend on localized dictionaries.
- Affected docs/checklists: Next.js i18n docs reference, APIMAPPING language contract, OpenSpec localization requirements, and smoke-test expectations.
- No backend API shape changes, database changes, workspace/user persisted locale preference, or new user preference migration are expected.
