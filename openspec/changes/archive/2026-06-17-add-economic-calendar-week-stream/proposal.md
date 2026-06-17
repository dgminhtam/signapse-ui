## Why

The redesigned economic calendar should behave like a time-based calendar stream rather than a paginated database list. Backend filtering already supports `scheduledAt` ranges through `$filter`, so the frontend can load a full UTC+7 week window and give users week navigation, a current-time marker, and adjacent-week loading without adding a new backend contract.

## What Changes

- Add a compact navigation-only week strip above the economic calendar event stream.
- Default the list to the current UTC+7 week and fetch that week with a `scheduledAt` range filter.
- Build filters with the confirmed syntax `scheduledAt ge '{start}+07:00' and scheduledAt lt '{end}+07:00'`.
- Use `sort=scheduledAt_asc`, backend `page=0`, and a large fixed backend `size` to load the selected week in one request.
- Remove visible pagination and page-size controls from the economic calendar list page.
- Add a red current-time line in the event stream when the selected UTC+7 week contains the current time.
- Replace pagination navigation with top and bottom controls for previous and next week loading.
- Keep the week strip minimal: no daily counts, category counts, country flags, countdowns, or summary cards.

## Capabilities

### New Capabilities
- `economic-calendar-week-stream`: Covers week-window loading, UTC+7 scheduledAt filtering, navigation-only week strip behavior, current-time line placement, and adjacent-week controls for the economic calendar list.

### Modified Capabilities

None.

## Impact

- Affected routes/components: `app/[lang]/(main)/economic-calendar/page.tsx`, `app/[lang]/(main)/economic-calendar/economic-calendar-list.tsx`, `app/[lang]/(main)/economic-calendar/economic-calendar-search.tsx`, and any new local week-strip component.
- Affected localized copy: week navigation labels, today, previous week, next week, load previous week, load next week, and current-time marker labels in English and Vietnamese.
- Affected URL state: replace visible `page`/`size` workflow with a `week` query parameter while preserving search and sort in the URL.
- Affected backend calls: still uses existing `/economic-calendar` through `getEconomicCalendarEntries(searchParams)` with `$filter/page/size/sort`; no backend endpoint, DTO, permission, or dependency changes are expected.
- Builds on the completed `redesign-economic-calendar-list` change but should remain independently reviewable.
