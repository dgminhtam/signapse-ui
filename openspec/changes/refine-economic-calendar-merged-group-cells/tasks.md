## 1. Row-Span View Model

- [x] 1.1 Add helpers to count visible rows for time buckets and currency/region buckets, including expanded support rows.
- [x] 1.2 Preserve UTC+7 day/time grouping and currencyCode-only currency/region grouping from the current view model.
- [x] 1.3 Keep day group anchors stable for week-strip day chip navigation.

## 2. Table Rendering

- [x] 2.1 Replace standalone time group rows with `Time` column cells that span the relevant visible bucket rows.
- [x] 2.2 Replace standalone currency/region group rows with `Currency` column cells that span the relevant visible currency/region rows.
- [x] 2.3 Keep day separators as compact full-width table rows.
- [x] 2.4 Keep event rows focused on impact, title, actual, forecast, previous, status, expand action, and detail action.
- [x] 2.5 Update expanded support rows so their `colSpan` preserves table alignment while time/currency cells are row-spanned.
- [x] 2.6 Keep compact empty-day treatment for selected days without events.

## 3. Current-Time Line And Loading

- [x] 3.1 Preserve current-time line placement between time buckets in the current UTC+7 week.
- [x] 3.2 Render the current-time line inside today's day shell when today's day has no events.
- [x] 3.3 Keep the current-time line hidden for non-current UTC+7 weeks.
- [x] 3.4 Update skeleton/loading rows to approximate merged time and currency/region cells.
- [x] 3.5 Review responsive table width and long text handling after merged-cell rendering.

## 4. Verification

- [x] 4.1 Run `openspec validate refine-economic-calendar-merged-group-cells --strict`.
- [x] 4.2 Run targeted lint for economic calendar files touched by this change.
- [x] 4.3 Run `pnpm typecheck` or the repo slash-command equivalent.
- [x] 4.4 Run `git diff --check`.
- [x] 4.5 Perform static review for hardcoded UI copy, country/flag inference, broken row-span alignment, stale sort behavior, shadcn composition drift, table width handling, and hydration-sensitive current-time rendering.
