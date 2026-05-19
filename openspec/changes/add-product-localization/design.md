## Context

Signapse is a Next.js 16 App Router admin dashboard. The root layout currently declares `lang="vi"`, most product copy is written directly in components, and multiple formatters hard-code `vi-VN`. Backend localization is already available for backend-generated human-facing messages when the client sends `Accept-Language`, but the frontend does not yet have a product locale preference or a shared dictionary.

The chosen product direction is full product localization for Vietnamese and English:

- UI copy should come from dictionaries instead of one-off string literals.
- Date, time, number, percent, and currency formatting should use the active locale.
- Backend API calls should send the same active locale through `Accept-Language`.
- Locale preference should be frontend-owned in v1 and persisted in a cookie.

## Goals / Non-Goals

**Goals:**

- Establish `vi` and `en` as the only supported product locales for v1.
- Use a cookie-based app locale as the source of truth across Server Components, Client Components, Server Actions, and backend fetch helpers.
- Add an authenticated app-shell language selector that updates the cookie and refreshes the current route.
- Replace user-facing UI copy with dictionary-backed copy across Signapse app surfaces.
- Provide locale-aware formatting helpers and migrate current hard-coded `vi-VN` call sites.
- Propagate the active locale to backend API calls via standard `Accept-Language`.
- Keep backend-localized error response rendering based on the existing `message` field.

**Non-Goals:**

- Do not add a backend persisted user locale preference in this change.
- Do not add workspace-level language settings.
- Do not add locale route prefixes such as `/vi` or `/en`.
- Do not translate persisted domain content, upstream provider content, AI-generated records, enum values, permission keys, endpoint paths, request field names, or `$filter` fields.
- Do not introduce a third-party i18n package unless implementation discovers a blocker that custom dictionaries cannot reasonably handle.
- Do not modify shadcn primitive source files under `components/ui`.

## Decisions

1. Use a cookie as the locale source of truth.
   - Store the preference in a cookie named `signapse_locale`.
   - Valid values are `vi` and `en`; invalid or absent values fall back to `vi`.
   - Server-side reads use Next.js `cookies()` so layouts, Server Components, Server Actions, and `apiFetch()` can all resolve the same locale.
   - The selector writes via a Server Action so cookie attributes can be controlled consistently.
   - Alternative considered: `localStorage`. Rejected because Server Components and backend fetch helpers cannot read it.
   - Alternative considered: URL prefixes. Rejected for v1 because this is an authenticated dashboard, not an SEO surface, and route prefixing would touch links, Clerk proxy rules, redirects, and parallel/intercepting routes.
   - Alternative considered: backend user/workspace setting. Rejected for v1 because backend docs explicitly mark persisted user locale and workspace language as non-goals.

2. Keep supported locale definitions central and typed.
   - Add a localization module that exports supported locales, default locale, cookie name, parser helpers, dictionaries, and formatting helpers.
   - Use TypeScript to keep `vi` and `en` dictionaries aligned by deriving dictionary shape from the Vietnamese source dictionary or a shared message type.
   - Keep dictionary keys semantic and grouped by surface, for example `common`, `navigation`, `errors`, `forms`, `workspace`, `newsArticles`, `telegram`, and `editor`.
   - Alternative considered: source-string lookup where Vietnamese text is the key. Rejected because it makes refactors fragile and turns copy edits into API changes.

3. Provide locale access for both server and client code.
   - Server code reads `getAppLocale()` from cookies when rendering layouts/pages or calling backend APIs.
   - Client code reads locale and dictionary through a provider mounted near the root app providers.
   - Client components that need interactive updates use a `useLocalization()` hook.
   - Server Components either call server localization helpers or pass translated labels into child Client Components.

4. Add the selector to the authenticated app header.
   - Place the language selector near existing app-level controls in `app/(main)/layout.tsx`.
   - Use existing shadcn menu/select primitives and lucide iconography without modifying `components/ui`.
   - When the user selects a different language, call the locale Server Action inside a transition and refresh the route.
   - The selector itself must be localized and accessible in both languages.

5. Propagate locale to backend through `Accept-Language`.
   - `apiFetch()` resolves the app locale and sets `Accept-Language` for both authenticated and public backend calls.
   - Add `Accept: application/json` by default.
   - Send `Content-Type: application/json` only when the request has a JSON body and is not `FormData`.
   - Preserve existing error handling that reads `response.text()` before parsing JSON.
   - Do not render `Content-Language` in ordinary UI; keep it available only for debugging and smoke checks.

6. Use locale-aware formatting helpers.
   - Replace hard-coded `Intl.DateTimeFormat("vi-VN")`, `Intl.NumberFormat("vi-VN")`, and `.toLocaleString("vi-VN")` call sites with shared helpers or locale-aware utilities.
   - Map app locales to BCP 47 formatting locales: `vi -> vi-VN`, `en -> en-US`.
   - Keep market chart library locale behavior separate if a third-party chart requires a specific locale token; still derive that token from app locale where feasible.

7. Migrate product copy broadly but surgically.
   - Convert visible labels, navigation text, placeholders, button text, toast messages, error fallback text, empty-state copy, form labels/descriptions, accessible labels, and metadata labels.
   - Keep canonical identifiers and data values untouched, including enum values, model names, provider names, permission keys, prompt type constants, route segments, and backend field names.
   - Treat third-party/vendor-like editor UI inside the repo as user-facing when it is visible in the product, but do not rewrite internal sample data, tests, or non-visible implementation constants.

## Risks / Trade-offs

- [Risk] Full product localization touches many files and can create regressions in copy, imports, and Client/Server Component boundaries. -> Mitigation: implement in layered tasks: foundation first, shell/shared components next, feature surfaces after, then verification.
- [Risk] Dictionary keys can become inconsistent or stale. -> Mitigation: keep dictionaries in a single typed module and let TypeScript enforce parity between `vi` and `en`.
- [Risk] Reading cookies in root layout can make the app dynamically rendered. -> Mitigation: this is an authenticated dashboard that already depends on auth/cookies, so locale correctness is more important than static optimization.
- [Risk] Backend messages and frontend copy can use different languages during a transition. -> Mitigation: selector writes the cookie through a Server Action and refreshes the current route before rendering updated data/actions.
- [Risk] Some backend-generated `message` values may still be untranslated during backend rollout. -> Mitigation: backend docs already define fallback to key/text instead of failing; frontend should render `message` as received.
- [Risk] Automated visual smoke tests may be blocked by auth/local data. -> Mitigation: run lint/typecheck/OpenSpec validation and document any browser smoke-test limitation.

## Migration Plan

1. Add localization foundation: supported locales, cookie helpers, dictionary, provider, hook, server action, and locale-aware formatting helpers.
2. Update root layout to read the app locale, set `<html lang>`, and provide locale context.
3. Update backend fetch helpers to send `Accept-Language` and JSON accept headers.
4. Add the app-shell language selector.
5. Migrate shared app components and navigation copy.
6. Migrate feature routes, forms, lists, detail panels, error boundaries, toasts, empty states, and accessible labels.
7. Migrate hard-coded date/number/currency/percent formatting.
8. Update API mapping documentation for the language header contract.
9. Verify with targeted static searches, `pnpm lint`, `pnpm typecheck`, and `openspec validate add-product-localization --strict`.

Rollback is straightforward because the feature is frontend-owned: remove the selector/provider/dictionaries, restore static `lang="vi"`, stop setting `Accept-Language`, and return copy to existing literals. No backend or data migration rollback is required.

## Open Questions

- None. The product direction is to implement full `vi` / `en` localization with cookie-based locale persistence in v1.
