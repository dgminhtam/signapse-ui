## Why

The economic calendar table now scans well, but loading a whole week makes the screen heavier than the user's primary workflow of reviewing one trading day. The list also needs stronger visual signal colors so impact, status, and numeric values can be scanned quickly without adding extra copy or controls.

## What Changes

- Change the economic calendar stream from week-window data fetching to selected-day data fetching.
- Use `date=YYYY-MM-DD` in the URL as the primary calendar state.
- If `date` is missing or invalid, default to the current UTC+7 date.
- Build the backend `$filter` with the selected UTC+7 day boundary: `scheduledAt ge '<date>T00:00:00+07:00' and scheduledAt lt '<next-date>T00:00:00+07:00'`.
- Keep backend `page=0`, a large enough day window size, and scheduled-time sorting so one selected day loads without visible pagination.
- Keep the week strip, but make it a day navigator around the selected date; clicking a day chip updates `date` instead of scrolling.
- Replace previous/next week body controls with selected-day navigation, or remove body controls if the week strip provides sufficient day navigation.
- Keep the merged time/currency table presentation for the selected day.
- Add signal colors for impact badges, status badges, and numeric value cells while preserving theme/shadcn guardrails.
- Keep unsupported UI out of scope: no country-name inference, flags, category tabs, daily aggregate cards, countdowns, or backend contract changes.

## Capabilities

### New Capabilities

- `economic-calendar-selected-day-stream`: Covers URL state, UTC+7 selected-day filtering, day navigation, now-line behavior, and table grouping for a one-day economic calendar stream.
- `economic-calendar-signal-colors`: Covers impact/status/value visual color treatment for economic calendar rows using contract-safe data and theme-aware styling.

### Modified Capabilities

None.

## Impact

- Affected components/helpers: `app/[lang]/(main)/economic-calendar/page.tsx`, `economic-calendar-list.tsx`, `economic-calendar-search.tsx`, `economic-calendar-week.ts` or a renamed/reworked calendar date helper, localized dictionaries, and economic-calendar definition helpers if badge/value variants are adjusted.
- Affected behavior: the same endpoint is queried with a selected-day scheduledAt filter instead of a selected-week scheduledAt filter.
- No backend API, DTO, dependency, permission, or route changes are expected.
