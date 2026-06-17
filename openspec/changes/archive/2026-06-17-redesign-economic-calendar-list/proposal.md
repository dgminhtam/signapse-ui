## Why

The current economic calendar list behaves like a generic CRUD table, which makes scheduled market events harder to scan by day, time, currency, and value deltas. Redesigning it as a compact calendar-first list will better match the way users monitor upcoming and available economic events while staying lighter than a full trading-terminal calendar.

## What Changes

- Rework the economic calendar list page into a calendar-first workspace with compact date navigation, search, sync, sort, and page-size controls.
- Group list rows by scheduled day so users can scan events in chronological context instead of reading a flat table only.
- Prioritize event time, currency, impact, title, actual, forecast, previous, and status/content availability in the row hierarchy.
- Add an expandable row detail pattern for event content or supporting text when available, while preserving canonical detail links.
- Keep the design minimal: no daily summary card deck, no decorative trading-terminal toolbar icons, and no UI controls for data not present in the current contract.
- Preserve existing URL-backed search, sort, page, and size behavior unless a later backend contract adds dedicated date/category filters.

## Capabilities

### New Capabilities
- `economic-calendar-list-workspace`: Covers the economic calendar list page as a compact calendar-first workspace with grouped chronological rows, focused controls, expandable event detail, and contract-aligned data hierarchy.

### Modified Capabilities

None.

## Impact

- Affected routes/components: `app/[lang]/(main)/economic-calendar/page.tsx`, `app/[lang]/(main)/economic-calendar/economic-calendar-list.tsx`, `app/[lang]/(main)/economic-calendar/economic-calendar-search.tsx`, and localized dictionary entries for any new labels.
- Affected shared UI usage: existing `AppListToolbar`, `AppListTable`, `AppPaginationControls`, shadcn wrappers, badges, buttons, and skeletons.
- No backend API, dependency, authentication, permission, or route group changes are expected.
