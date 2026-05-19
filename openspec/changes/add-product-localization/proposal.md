## Why

Signapse currently presents most product UI in Vietnamese while backend-generated messages can only localize when clients send an explicit `Accept-Language` signal. Adding a first-class app locale gives users a clear `vi` / `en` choice and keeps UI copy, formatting, toast/error text, and backend messages aligned.

## What Changes

- Add a cookie-based app locale preference as the source of truth for product language.
- Add a language selector for `vi` and `en` in the authenticated app shell.
- Introduce frontend dictionaries for all user-facing product UI copy in Vietnamese and English.
- Update user-facing toasts, error boundaries, empty states, form labels, navigation labels, toolbar labels, action labels, and supporting metadata text to read from the active locale.
- Centralize locale-aware date, time, number, percent, and currency formatting.
- Send `Accept-Language` on backend API calls according to the active app locale.
- Preserve backend contract boundaries: do not translate domain content, upstream provider content, AI-generated records, enum values, permission keys, endpoint paths, request field names, or `$filter` fields on the frontend.
- Keep locale preference local to the frontend v1; do not add a persisted backend user locale or workspace language setting.

## Capabilities

### New Capabilities

- `product-localization`: Covers app locale preference, language switching, dictionary-backed user-facing UI copy, locale-aware formatting, and backend language header propagation.

### Modified Capabilities

- None.

## Impact

- Affected app shell and routing: root layout, authenticated layout/header controls, Clerk proxy considerations, and app providers where locale context is needed.
- Affected API layer: `app/api/auth/action.ts` and shared backend fetch behavior.
- Affected UI/code surfaces: route pages, feature list/search/form/detail components, shared app components, toast-producing client components, error boundaries, and user-facing helper copy.
- Affected formatting helpers: shared date/number/currency/percent utilities and local formatter call sites.
- Affected documentation: `docs/APIMAPPING.md` should record `Accept-Language` as part of the shared frontend/backend contract.
- No backend API changes, database changes, new external UI library, or shadcn primitive source changes are expected.
