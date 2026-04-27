## 1. Data Layer

- [x] 1.1 Create `app/lib/economic-calendar/definitions.ts` with list, detail, sync response types matching `docs/api_mapping.json`.
- [x] 1.2 Create `app/lib/economic-calendar/permissions.ts` with read, sync, and nav permission constants.
- [x] 1.3 Create `app/api/economic-calendar/action.ts` with `getEconomicCalendarEntries(searchParams)`, `getEconomicCalendarEntryById(id)`, and `syncEconomicCalendarEntries()`.
- [x] 1.4 Ensure sync action returns `ActionResult<EconomicCalendarSyncResponse>`, uses `fetchAuthenticated()`, and revalidates list/detail routes.

## 2. List Route

- [x] 2.1 Implement `app/(main)/economic-calendar/page.tsx` with permission guard, Card shell, CardHeader, CardDescription, Separator, Suspense, and skeleton.
- [x] 2.2 Implement `economic-calendar-search.tsx` with controlled URL-backed live search, `300ms` debounce, `type="search"`, sr-only label, trim behavior, page reset, and inline Spinner.
- [x] 2.3 Implement `economic-calendar-sync-button.tsx` with permission gating, pending Spinner, disabled state, toast summary, error toast, and `router.refresh()`.
- [x] 2.4 Implement `economic-calendar-list.tsx` with toolbar, sort, page size selector, shared table surface, empty state, and row action to detail.
- [x] 2.5 Add list columns for event, country/provider, importance, scheduled time, actual/forecast/previous, and actions.

## 3. Detail Route

- [x] 3.1 Implement `app/(main)/economic-calendar/[id]/page.tsx` with Back button, permission guard, server-side detail fetch, Card shell, and not-found handling.
- [x] 3.2 Render primary detail fields: title, country, provider, importance, scheduled time, actual value, forecast value, previous value, description, raw content, and original link.
- [x] 3.3 Move technical fields such as `id`, `externalKey`, `url`, `rawMetadata`, `ingestedAt`, `createdDate`, and `lastModifiedDate` into a lower-priority technical information section.
- [x] 3.4 Add local `error.tsx` for the economic calendar feature with professional Vietnamese copy and retry action.

## 4. Navigation And Documentation

- [x] 4.1 Add `Lịch kinh tế` to `config/site.ts` under the `Nội dung` navigation group and gate it with economic calendar read permission.
- [x] 4.2 Update `docs/APIMAPPING.md` to mark economic calendar endpoints as implemented and list the new frontend files.
- [x] 4.3 Ensure all new UI text, placeholders, toast messages, empty states, metadata, and page descriptions are professional Vietnamese with proper diacritics.

## 5. Verification

- [x] 5.1 Confirm `GET /economic-calendar` list fetch uses URL-backed `page`, `size`, `sort`, and `$filter` via `queryParamsToString()`.
- [x] 5.2 Confirm `POST /economic-calendar/sync` shows pending state, disables the button, shows success/error toast, and refreshes the page.
- [x] 5.3 Confirm `/economic-calendar/{id}` renders the primary reading path before technical metadata.
- [x] 5.4 Run targeted ESLint for changed economic calendar, config, and docs-related TypeScript files.
- [x] 5.5 Run `pnpm run typecheck` and document any unrelated existing failures separately. Ran and currently blocked by unrelated `graph-view` dependency/type errors.
