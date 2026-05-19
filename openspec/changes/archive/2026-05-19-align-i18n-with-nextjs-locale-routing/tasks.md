## 1. Locale Routing Foundation

- [x] 1.1 Add route-locale constants, locale validation, `getIntlLocale()`, and locale path helpers for `vi` and `en`.
- [x] 1.2 Add `Accept-Language` negotiation helper for proxy redirects with `vi` fallback.
- [x] 1.3 Replace cookie-derived locale helpers with route-locale helper contracts that do not read `signapse_locale`.
- [x] 1.4 Split dictionaries into per-locale modules and expose server-only `getDictionary(lang)` / `hasLocale(lang)` helpers.
- [x] 1.5 Update localization provider formatter API so normal `formatDateTime`, `formatDate`, `formatNumber`, `formatPercent`, and `formatCurrency` calls are bound to the active route locale.

## 2. App Router Restructure

- [x] 2.1 Create `app/[lang]/layout.tsx` that validates `params.lang`, sets `<html lang>`, loads the selected dictionary, and provides localization context.
- [x] 2.2 Move `(auth)` routes under `app/[lang]/(auth)` and verify locale-prefixed sign-in route shape.
- [x] 2.3 Move `(main)` protected routes under `app/[lang]/(main)` while preserving layouts, route groups, parallel routes, and intercepting quick-detail routes.
- [x] 2.4 Move the document shell into `app/[lang]/layout.tsx` and remove the top-level locale-aware `app/layout.tsx` shell so `<html lang>` is owned by the route locale.
- [x] 2.5 Update TypeScript page/layout props so async `params` includes `lang` where route locale is needed.

## 3. Proxy And Auth

- [x] 3.1 Refactor `proxy.ts` to redirect unprefixed page requests to `/{lang}` based on `Accept-Language`.
- [x] 3.2 Ensure `proxy.ts` leaves `/api`, Next internals, and static assets unprefixed.
- [x] 3.3 Update Clerk public route matching for `/vi/sign-in(.*)` and `/en/sign-in(.*)`.
- [x] 3.4 Verify protected locale-prefixed app routes still call `auth.protect()`.

## 4. Navigation, Links, And Language Switching

- [x] 4.1 Update app navigation, breadcrumbs, sidebar config, redirects, `router.push()`, `router.replace()`, and `<Link>` destinations to preserve or add the active locale prefix.
- [x] 4.2 Update quick-detail drawer links and intercepting route close/open behavior for locale-prefixed paths.
- [x] 4.3 Replace language selector Server Action cookie mutation with URL-prefix replacement that preserves path and query string.
- [x] 4.4 Remove obsolete app locale cookie constants, `setAppLocale`, and cookie parsing call sites.

## 5. Backend Language Propagation

- [x] 5.1 Refactor backend fetch helpers so `Accept-Language` is supplied from the active route locale rather than cookies.
- [x] 5.2 Update Server Components and Server Actions that need localized fallback messages to receive or resolve the route locale explicitly.
- [x] 5.3 Verify authenticated and public backend calls send `Accept-Language: vi` or `Accept-Language: en` according to the current route.

## 6. Formatting And Dictionary Cleanup

- [x] 6.1 Sweep formatter call sites and remove `undefined` locale arguments or stale explicit defaults that can force Vietnamese formatting.
- [x] 6.2 Ensure product UI imports selected dictionary/context only, not full multi-locale runtime dictionary data.
- [x] 6.3 Update Clerk/sign-in user-facing localization where supported by Clerk without introducing cookie locale state.
- [x] 6.4 Update `docs/APIMAPPING.md` and active localization docs to describe URL locale routing and route-derived `Accept-Language`.

## 7. Verification

- [x] 7.1 Run static searches for `signapse_locale`, `setAppLocale`, cookie locale parsing, and hard-coded locale fallbacks; remove runtime leftovers.
- [x] 7.2 Run static searches for formatter calls that omit active locale binding or pass `undefined` as locale.
- [x] 7.3 Run `pnpm lint`.
- [x] 7.4 Run `pnpm typecheck`.
- [x] 7.5 Run `openspec validate align-i18n-with-nextjs-locale-routing --strict`.
- [x] 7.6 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke check `/`, `/vi`, `/en`, `/vi/sign-in`, `/en/sign-in`, protected app redirects, language selector switching, representative list/detail pages, and quick-detail routes.
- [x] 7.7 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke check backend calls from `/vi` and `/en` routes include matching `Accept-Language` headers.

Notes:

- Smoke verified with dev server: `/` redirects to `/en` or `/vi` by `Accept-Language`; `/news-articles` redirects to `/en/news-articles`; `/api/auth/action` remains unprefixed; `/vi/sign-in` and `/en/sign-in` render with matching `<html lang>`; unauthenticated protected `/vi` and `/en/events` redirect to `/vi/sign-in` and `/en/sign-in`.
- Full language selector interaction and backend-call header smoke remain blocked without an authenticated Clerk session in this environment.
