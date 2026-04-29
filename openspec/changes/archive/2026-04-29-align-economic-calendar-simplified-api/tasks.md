## 1. Contract And Data Layer

- [x] 1.1 Update `app/lib/economic-calendar/definitions.ts` to match the simplified `EconomicCalendarListResponse`, `EconomicCalendarResponse`, and `EconomicCalendarSyncResponse` schemas in `docs/api_mapping.json`.
- [x] 1.2 Remove type helpers tied to removed fields such as `importance`, and add narrowly scoped helpers for `impact`, `status`, `contentAvailable`, and Vietnamese fallback labels.
- [x] 1.3 Confirm `app/api/economic-calendar/action.ts` still maps the unchanged endpoints and update fallback error copy to clean Vietnamese if needed.

## 2. List Page Alignment

- [x] 2.1 Update `economic-calendar-search.tsx` so the URL-backed search uses only current backend fields and no longer filters by `description` or `countryCode`.
- [x] 2.2 Update `economic-calendar-list.tsx` columns to event, currency, impact, status, scheduled/synced time, values, and actions.
- [x] 2.3 Replace `importance_desc` sort with supported sort options such as `scheduledAt_desc`, `scheduledAt_asc`, `syncedAt_desc`, and `createdDate_desc`.
- [x] 2.4 Ensure empty state, table headers, action labels, and fallback values use clean professional Vietnamese with proper diacritics.
- [x] 2.5 Update the list skeleton in `page.tsx` so loading layout matches the simplified final table.

## 3. Detail Page Alignment

- [x] 3.1 Update `/economic-calendar/{id}` header to show title, currency, impact, status, and scheduled time using current schema fields.
- [x] 3.2 Replace country/provider cards with simplified metric cards for actual, forecast, previous, synced time, and any other current contract fields that support the reading path.
- [x] 3.3 Replace `rawContent` rendering with `content` and show a clear Vietnamese empty/info state when content is unavailable.
- [x] 3.4 Remove UI that depends on `url`, `externalKey`, `provider`, `countryCode`, `importance`, `ingestedAt`, `rawContent`, or `rawMetadata`.
- [x] 3.5 Minimize the technical section to fields still present in the simplified contract, such as `id`, `createdDate`, and `lastModifiedDate`.
- [x] 3.6 Clean all mojibake in detail page, access denied text, skeleton labels, and local `error.tsx`.

## 4. Documentation

- [x] 4.1 Update `docs/APIMAPPING.md` economic calendar notes to list the new fields: `currencyCode`, `impact`, `contentAvailable`, `status`, `syncedAt`, and `content`.
- [x] 4.2 Remove or rewrite documentation that still describes removed economic calendar fields as active frontend dependencies.
- [x] 4.3 Confirm `docs/APIMAPPING.md` endpoint count and `operationId` mapping still match `docs/api_mapping.json`.

## 5. Verification

- [x] 5.1 Search the economic calendar frontend files to confirm removed fields are no longer referenced.
- [x] 5.2 Run targeted lint for `app/(main)/economic-calendar`, `app/api/economic-calendar`, and `app/lib/economic-calendar`.
- [x] 5.3 Run `pnpm run typecheck` and separate any unrelated existing failures, especially known graph-view dependency/type issues.
- [x] 5.4 Validate OpenSpec apply readiness for `align-economic-calendar-simplified-api`.
