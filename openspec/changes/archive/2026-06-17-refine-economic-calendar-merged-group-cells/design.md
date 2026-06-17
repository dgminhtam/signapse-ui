## Context

The economic calendar now has the right data hierarchy: selected UTC+7 week, day shells, time buckets, and currency/region buckets. The current rendering expresses time and currency buckets as standalone table rows, which makes dense days taller and visually interrupts the event stream.

The desired presentation is closer to a market calendar table: the day remains a full-width separator, while repeated time and currency values occupy merged cells beside the related event rows.

## Goals / Non-Goals

**Goals:**

- Render time and currency/region grouping as merged table cells instead of standalone group rows.
- Preserve the existing table columns and shared list table surface.
- Keep row alignment correct when an event's supporting content is expanded.
- Keep the current-time line visible and meaningful inside the day flow.
- Preserve week strip navigation, adjacent-week loading, UTC+7 filtering, stale sort normalization, search, sync, and detail actions.

**Non-Goals:**

- No country-name inference, flags, category tabs, countdowns, daily cards, or backend changes.
- No replacement of the shared table surface with cards or a custom grid.
- No change to the economic calendar detail route.

## Decisions

### Use Native Table Row Spans

Time and currency/region cells should render in the existing `Time` and `Currency` columns with `rowSpan`, not as separate group header rows. This keeps the visual grammar of a table and reduces repeated text.

Alternative considered: keep group header rows but reduce styling. That still creates extra vertical stops and does not match the user's requested merged-cell mental model.

### Keep Day Rows Full Width

The day row remains a compact full-width separator. It is the correct high-level navigation target for the week strip and gives users a clear boundary between dates.

Alternative considered: merge day into a column as well. That would compete with time as the primary scan axis and make long weeks harder to navigate.

### Count Expanded Support Rows In Row Spans

The row span for each time and currency/region cell must include both event rows and any expanded support rows inside the same bucket. Expanded support rows should omit the already-spanned time/currency cells and fill the remaining columns with an appropriate `colSpan`.

Alternative considered: place expanded content in a full-width row that ignores row spans. That risks broken table alignment and visual jumps when expanding rows.

### Place The Current-Time Line Between Buckets

The current-time line should remain a full-width separator row inside today's day shell. It should be placed before the first time bucket at or after the current UTC+7 time for ascending sort, before the first time bucket at or before the current UTC+7 time for descending sort, or after the last bucket when the current time is beyond the rendered buckets. If today's day shell has no events, the line should render before the empty-day row.

Alternative considered: render the line inside the merged `Time` column. That would make the line less visible and harder to align across all columns.

### Preserve Contract-Honest Currency/Region Labels

Currency/region labels continue to derive from `currencyCode` only. The merged-cell treatment must not introduce flags, country names, or inferred country controls.

Alternative considered: map currency codes to countries for a more calendar-like look. This remains out of scope because the frontend contract does not provide reliable country fields.

## Risks / Trade-offs

- Row-span math can break alignment when expanded rows appear -> compute visual row counts from visible event rows plus expanded support rows.
- Sparse days still render empty day shells -> keep empty-day treatment compact and localized.
- Full-width current-time rows interrupt row spans -> render now-line between time buckets or before empty-day content, not inside an active time/currency span.
- Shared table wrapper may have nowrap defaults -> keep long event/support cells locally `whitespace-normal`, `min-w-0`, and constrained.

## Migration Plan

1. Reuse the existing nested day/time/currency view model.
2. Add visual-row count helpers for time and currency groups based on expanded state.
3. Replace standalone time/currency group rows with `rowSpan` cells in the first event row of each relevant group.
4. Adjust expanded support rows to preserve table column alignment.
5. Preserve current-time line placement across empty days and bucket boundaries.
6. Update skeleton rows to approximate merged time/currency cells.
7. Run OpenSpec validation, targeted lint, typecheck, diff check, and deterministic static review.

## Open Questions

None. The requested direction is specific enough to implement.
