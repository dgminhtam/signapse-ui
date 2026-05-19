## 1. Localization Foundation

- [x] 1.1 Add supported locale constants, locale cookie parsing, dictionary types, dictionaries, server locale helpers, and locale-aware formatting helpers.
- [x] 1.2 Add a locale Server Action that validates `vi` / `en`, writes the app locale cookie, and keeps unsupported values out of state.
- [x] 1.3 Add a client localization provider and hook so Client Components can read the active locale, dictionary, and formatter helpers.

## 2. App Shell And Backend Transport

- [x] 2.1 Update the root layout to resolve the app locale, set `<html lang>`, and provide locale context to the app.
- [x] 2.2 Add an authenticated app-shell language selector that updates the locale cookie and refreshes the current route.
- [x] 2.3 Update backend fetch helpers to send `Accept-Language` and `Accept: application/json`, while only sending `Content-Type: application/json` for JSON bodies.

## 3. Shared Product UI Copy

- [x] 3.1 Localize navigation, breadcrumbs, sidebar user menu, theme mode labels, shared app controls, access denied UI, pagination, page-size controls, list toolbars, table empty states, and form shell copy.
- [x] 3.2 Localize shared workspace controls, watchlist editing controls, personal notes quick sheet/editor controls, quick-detail drawer copy, permission provider copy, and common toasts.
- [x] 3.3 Replace shared hard-coded date, number, percent, and currency formatting with locale-aware helpers.

## 4. Feature Surface Copy

- [x] 4.1 Localize blogs list/create/update/detail/error copy and mutation feedback.
- [x] 4.2 Localize news outlets list/create/update/detail/error copy and mutation feedback.
- [x] 4.3 Localize news articles list/detail/quick-detail/operator action/error copy and mutation feedback.
- [x] 4.4 Localize events list/detail/quick-detail/operator action/error copy and mutation feedback.
- [x] 4.5 Localize economic calendar list/detail/sync/error copy and formatting.
- [x] 4.6 Localize cronjobs list/schedule action/error copy and formatting.
- [x] 4.7 Localize system prompts list/create/update/detail/error copy and prompt presentation helpers.
- [x] 4.8 Localize roles and permissions management copy.
- [x] 4.9 Localize AI provider configuration list/create/update/detail/model picker/credential copy and mutation feedback.
- [x] 4.10 Localize Telegram configuration copy, action feedback, schedules, destinations, feature settings, and formatting.
- [x] 4.11 Localize market query workbench copy, validation feedback, reasoning/evidence panels, and formatting.
- [x] 4.12 Localize market charts workbench copy, chart controls, annotation copy, and formatting.
- [x] 4.13 Localize graph view workbench copy, quick detail copy, canvas controls, and formatting.
- [x] 4.14 Localize developer token surface copy and feedback.
- [x] 4.15 Localize workspace overview home copy and dashboard formatting.

## 5. Editor And Remaining Product Copy

- [x] 5.1 Localize visible editor-x toolbar, picker, dialog, menu, date/time, embed, image, table, and formatting control copy.
- [x] 5.2 Search for remaining hard-coded user-facing string literals in `app`, `components`, and `config`; migrate product-facing copy and document intentional non-product/internal constants.
- [x] 5.3 Search for remaining hard-coded `vi-VN`, `en-US`, `Intl.*`, and `.toLocaleString()` call sites; migrate product-facing formatting and document intentional third-party/internal cases.

Static search notes:

- Remaining non-dictionary diacritics are intentional data or parsing constants: blog slug transliteration for `đ` / `Đ`, emoji metadata, mention sample names, and the Unicode keyword matcher regex.
- Remaining `vi-VN` / `en-US` values are centralized locale mappings in `app/lib/i18n/config.ts`; remaining `Intl.*` results are formatter option types, centralized formatter helpers, or timezone detection for chart/editor integrations.
- Remaining hard-coded shadcn primitive fallback labels in `components/ui` are not the app-level localized labels; product usage passes localized labels through app wrappers where those primitives are rendered directly.

## 6. Documentation And Verification

- [x] 6.1 Update `docs/APIMAPPING.md` with the frontend/backend language contract and localized error response behavior.
- [x] 6.2 Run static searches to verify backend calls include locale propagation and product UI copy has no obvious unmigrated hard-coded text.
- [x] 6.3 Run `pnpm lint`.
- [x] 6.4 Run `pnpm typecheck`.
- [x] 6.5 Run `openspec validate add-product-localization --strict`.
- [x] 6.6 Smoke check the language selector and representative localized screens where local auth/data allow it; document blockers if not runnable.

Smoke check notes:

- Local dev server responds on `localhost:3000`; unauthenticated `/` redirects to `/sign-in`.
- Cookie smoke verified `/sign-in` renders `<html lang="en">` with `signapse_locale=en` and `<html lang="vi">` with `signapse_locale=vi`.
- Authenticated app-shell language selector click/screen smoke was blocked by the lack of an authenticated Clerk session in this environment.
