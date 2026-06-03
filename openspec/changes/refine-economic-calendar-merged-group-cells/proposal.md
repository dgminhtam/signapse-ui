## Why

The current economic calendar time grouping uses separate header rows for time and currency/region, which makes the table taller and harder to scan. A calendar table should keep related events in one continuous row flow while visually merging repeated time and currency cells.

## What Changes

- Replace separate time and currency/region group rows with merged table cells using row-span style presentation.
- Keep the day row as the only full-width group separator.
- Render each UTC+7 time bucket as one visual `Time` cell spanning the events inside that time bucket.
- Render each currency/region bucket as one visual `Currency` cell spanning the events inside that currency bucket.
- Keep event rows focused on impact, event title, actual, forecast, previous, status, expand action, and detail action.
- Preserve the current-time red line, week strip, adjacent-week load buttons, UTC+7 week filtering, stale sort normalization, expandable support content, and canonical detail links.
- Keep unsupported UI out of scope: no country-name inference, flags, category tabs, daily aggregate cards, countdowns, or backend contract changes.

## Capabilities

### New Capabilities

- `economic-calendar-merged-group-cells`: Covers merged-cell presentation for economic calendar day/time/currency-region grouping, including row-span behavior and current-time line placement inside the continuous table flow.

### Modified Capabilities

None.

## Impact

- Affected components/helpers: `app/[lang]/(main)/economic-calendar/economic-calendar-list.tsx`, `app/[lang]/(main)/economic-calendar/page.tsx`, and possibly localized dictionary entries if empty/supporting labels need adjustment.
- Affected behavior: the same week-window events render in a denser table layout where repeated time and currency values are visually merged instead of shown as standalone group rows.
- No backend API, DTO, dependency, route, permission, or filter syntax changes are expected.
