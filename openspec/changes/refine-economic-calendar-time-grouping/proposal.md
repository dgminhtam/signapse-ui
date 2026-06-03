## Why

The week-stream calendar still groups primarily by day, so dense event windows can feel like a table instead of a true economic calendar. The current-time line can also disappear when today has no event group or when stale sort state remains in the URL, which weakens the main orientation cue.

## What Changes

- Refine the economic calendar stream hierarchy from day-only grouping to day -> time -> currency/region grouping.
- Use scheduled time buckets in UTC+7 so events sharing the same release time are scanned together.
- Use `currencyCode` as the current currency/region grouping key; do not infer country names or add flags unless the backend contract later provides reliable country fields.
- Fix the red current-time line so it renders in the current UTC+7 week even when today has no events.
- Normalize unsupported/stale sort values to `scheduledAt_asc` so the current-time line and time grouping are not disabled by old URL state.
- Keep the existing week strip, UTC+7 week-window filtering, search, sync, adjacent-week controls, expandable event content, and canonical detail links.
- Keep unsupported UI out of scope: no country flag system, country-name inference, category tabs, countdowns, or daily aggregate cards.

## Capabilities

### New Capabilities
- `economic-calendar-time-grouping`: Covers economic calendar event-stream grouping by day, UTC+7 time, and currency/region, plus robust current-time line placement across empty/current-day and stale-sort cases.

### Modified Capabilities

None.

## Impact

- Affected components/helpers: `app/[lang]/(main)/economic-calendar/economic-calendar-list.tsx`, `app/[lang]/(main)/economic-calendar/economic-calendar-week.ts`, and localized dictionary entries for any new group labels or fallback copy.
- Affected behavior: event rows remain in the same backend week window but render under nested day/time/currency-region groups.
- No backend API, DTO, permission, dependency, route, or filter syntax changes are expected.
- Builds on the completed `redesign-economic-calendar-list` and `add-economic-calendar-week-stream` changes.
