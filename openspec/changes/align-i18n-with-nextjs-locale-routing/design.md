## Context

Signapse already has Vietnamese and English product dictionaries, a language selector, locale-aware formatting helpers, and backend `Accept-Language` propagation from the completed `add-product-localization` change. The current implementation uses a frontend cookie (`signapse_locale`) as the app locale source of truth. That was acceptable for a v1 product rollout, but it does not match the Next.js App Router internationalization guide, which recommends locale-prefixed routing and placing special route files under `app/[lang]`.

The repo currently has route groups directly under `app/(auth)` and `app/(main)`, a root `app/layout.tsx` that reads the locale from cookies, and a Clerk `proxy.ts` that protects non-public routes. This change intentionally makes locale routing a breaking app URL change so the codebase has one canonical locale source instead of keeping cookie compatibility.

## Goals / Non-Goals

**Goals:**

- Make `/{lang}` the canonical source of truth for product locale, where `lang` is `vi` or `en`.
- Align route structure with the Next.js App Router i18n guide by moving special route files under `app/[lang]`.
- Use proxy-based locale detection and redirects for unprefixed routes.
- Keep Clerk protection working for locale-prefixed routes.
- Load dictionaries through a server-first `server-only` boundary with per-locale dynamic imports.
- Ensure client formatting helpers are bound to the active route locale.
- Remove cookie locale state, the locale Server Action, and cookie-derived locale fallback behavior.
- Continue sending backend `Accept-Language` from the active locale.

**Non-Goals:**

- Do not add persisted user, workspace, or backend locale preferences.
- Do not translate backend domain content, AI-generated content, enum values, permission keys, endpoint paths, request field names, or `$filter` fields.
- Do not preserve old unprefixed app URLs as stable routes beyond proxy redirects.
- Do not introduce a third-party i18n framework unless implementation proves the native Next.js pattern insufficient.
- Do not redesign app UI surfaces while moving locale routing.

## Decisions

### Use locale-prefixed sub-path routing

The app will use `/{lang}` routes such as `/vi/events` and `/en/events`. Supported route locales remain `vi` and `en`; `vi` is the default fallback for unmatched or missing language negotiation.

Alternatives considered:

- Keep cookie-based locale: simpler short-term, but keeps a non-Next.js source of truth and makes locale invisible in routing.
- Use domain-based routing: unnecessary for this admin dashboard and not supported by current deployment assumptions.

### Move route groups under `app/[lang]`

The route tree should become:

```text
app/
  [lang]/
    layout.tsx
    (auth)/
    (main)/
```

`app/[lang]/layout.tsx` becomes the app root layout for all page routes. It validates `params.lang`, sets `<html lang>`, imports global CSS/font setup, loads the dictionary, and provides localization context. A top-level `app/layout.tsx` should not remain as a second HTML shell because it cannot read `params.lang` and would prevent the dynamic locale segment from owning the document language.

Alternatives considered:

- Keep `app/layout.tsx` locale-aware through cookies: not aligned with the Next.js routing guide.
- Keep a top-level `app/layout.tsx` wrapper plus nested `[lang]/layout.tsx`: prevents `[lang]/layout.tsx` from owning `<html lang>` and defeats the Next.js i18n layout pattern.
- Add `[lang]` only around selected routes: creates mixed route semantics and makes navigation/linking harder to reason about.

### Combine locale redirect and Clerk protection in proxy

`proxy.ts` remains the single request-boundary file. It should first bypass static/internal assets, then redirect non-localized page requests to `/{lang}`, and then let Clerk protect locale-prefixed protected routes while keeping locale-prefixed sign-in routes public.

API routes should not be redirected into `/{lang}/api/...`; they remain under `/api`. Server Actions and API helpers carry locale to the backend through explicit application code.

Alternatives considered:

- Separate locale proxy and Clerk proxy: not possible as separate root proxies in Next.js, and harder to reason about.
- Locale-prefix `/api`: not useful for internal API action modules and risks breaking existing Next route-handler/API assumptions.

### Remove cookie locale state

The `signapse_locale` cookie, `setAppLocale` Server Action, and cookie-based `getAppLocale()` source of truth should be removed. Locale switching changes the URL prefix instead of mutating server state.

Alternatives considered:

- Keep cookie as a preference hint: would reintroduce a second locale source. The user explicitly approved removing cookies when they are not part of the Next.js-standard path.

### Use server-only dictionary loading

Dictionary files should be split per locale and loaded through a `server-only` `getDictionary(lang)` helper. Client Components receive the already-selected dictionary via the localization provider from `app/[lang]/layout.tsx`.

Alternatives considered:

- Keep both locales in one shared module: simpler, but imports the full dictionary graph into client-reachable modules and diverges from the Next.js guide.
- Use a third-party package such as `next-intl`: likely unnecessary because current requirements are simple `vi`/`en` dictionaries and format helpers.

### Bind formatter helpers to the active locale in the provider

The client localization context should expose formatter functions that already close over the current locale. Callers should not need to pass `locale` for normal app formatting, and no formatter should silently default to Vietnamese when the active route is English.

Alternatives considered:

- Require every caller to pass locale: verbose and already led to missed call sites.
- Keep default locale parameters in shared helpers: useful for low-level pure functions, but unsafe as the primary UI API.

## Risks / Trade-offs

- **Route move churn** -> Keep the implementation mechanical first, then fix imports, links, and tests in focused passes.
- **Clerk proxy regression** -> Add smoke checks for `/vi/sign-in`, `/en/sign-in`, protected app routes, and unprefixed redirects.
- **Broken links after prefixing** -> Centralize locale-aware path helpers and update shared navigation/link components before feature-specific links.
- **Parallel/intercepting route breakage** -> Explicitly verify quick-detail `@quickDetail` and `(.)` routes after moving under `[lang]`.
- **Client bundle can still grow if dictionary imports leak** -> Enforce server-only dictionary module boundaries and keep client imports limited to dictionary types or selected dictionary props.
- **Backend fallback messages can lose locale context in Server Actions** -> Add route-locale plumbing or a request helper so backend `Accept-Language` and local fallback messages derive from the same active route locale.

## Migration Plan

1. Introduce `[lang]` locale config, route validation, path helpers, server-only dictionary loading, and route-locale-aware formatter/provider contracts.
2. Move app route groups under `app/[lang]`, move the document shell to `app/[lang]/layout.tsx`, and adjust auth pages, protected layout, parallel routes, and imports.
3. Refactor `proxy.ts` to perform locale redirects and Clerk protection for locale-prefixed app routes while leaving `/api` routes unprefixed.
4. Replace cookie locale helpers and language selector Server Action usage with URL-prefix switching.
5. Update backend fetch/helper call sites to use route locale instead of cookie locale.
6. Sweep links, router pushes/replaces, redirects, breadcrumbs, nav config, and quick-detail paths for locale-aware URL generation.
7. Remove obsolete cookie locale code and update documentation.
8. Run lint, typecheck, OpenSpec validation, static searches for removed cookie helpers, and smoke checks for locale redirects, sign-in, app shell language switching, backend `Accept-Language`, and representative localized screens.
