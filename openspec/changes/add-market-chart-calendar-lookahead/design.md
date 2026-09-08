## Context

Market Chart currently treats economic calendar data as supplemental candle data. Initial and lazy-history requests derive calendar ranges from returned candles, and the Calendar control governs loading plus marker, lane, quick-list, and legend visibility. This preserves historical alignment but prevents the calendar from serving its advance-warning purpose on short timeframes, outside trading sessions, or when candle history is empty.

The existing authenticated endpoint accepts `assetId`, half-open `from`/`to` timestamps, and repeated impact values. The frontend merges events by identity and limits each request chunk to 366 days. Its response requires `time`, permits nullable `scheduledAt`, and exposes `PENDING` or `AVAILABLE`; the live contract must establish the timestamp and status semantics before implementation relies on them.

KLineCharts 10 already extrapolates configured periods beyond the last candle. The current canvas can therefore calculate future x-coordinates without synthetic candles, subject to viewport bounds and validation across market gaps and calendar-based timeframes.

## Goals / Non-Goals

**Goals:**

- Give users an asset-relevant seven-day economic calendar lookahead independent of candle availability and chart timeframe.
- Make the nearest upcoming event, the 24-hour/seven-day upcoming list, and overdue PENDING events easy to scan without forcing chart navigation.
- Preserve historical calendar context and marker-specific inspection while simplifying duplicated footer interaction.
- Keep calendar fetching, refresh failures, and freshness separate from the price-data lifecycle.
- Reuse the existing endpoint, chart engine, localization, accessibility patterns, and fixture-backed test seam.

**Non-Goals:**

- Push, sound, email, Telegram, or other reminder delivery.
- Synthetic or future candles, automatic chart zooming, or a chart-engine replacement.
- An unbounded future-data loader or a duplicate of the full Economic Calendar page.
- Frontend inference of asset relevance, cancellation, publication, or provider completeness.

## Decisions

### Separate historical and future calendar ranges

Calendar state will combine two independently requested ranges for the selected asset and impacts:

- historical ranges derived from displayed candle pages, preserving current marker context; and
- a rolling half-open future range from the current time through seven days later.

Responses are merged by event identity. The future range is loaded even when candle loading is empty or fails, provided the selected asset is valid. Changing timeframe for the same asset reuses future data and recomputes marker positions; changing asset invalidates it and guards against stale responses. The existing per-request chunk bound remains in force.

This keeps the price and schedule models honest. Extending the candle-derived range was rejected because it would still couple advance visibility to price availability. Replacing all historical loading with one broad request was rejected because lazy candle history should continue to request only the historical context the user reaches.

### Derive presentation state from scheduled time and publication status

The client maintains a minute-resolution current-time value only while the document is visible. It recomputes:

- upcoming events: selected-impact events scheduled after now and within the active 24-hour or seven-day list interval;
- next event: the earliest event in that upcoming set; and
- awaiting publication: PENDING events from their scheduled time until 60 minutes later.

The waiting deadline is always the schedule timestamp plus 60 minutes, so reloads and timeframe changes cannot extend it. AVAILABLE items leave the waiting group. Exiting the group after 60 minutes changes only presentation; it does not mutate or reinterpret backend status.

The implementation must first confirm which response timestamp is authoritative. It will use one contract-backed scheduled instant consistently for querying, ordering, countdowns, waiting deadlines, grouping, and display rather than silently mixing `time` and `scheduledAt`.

### Keep calendar data available when markers are hidden

The existing Calendar state is split conceptually into calendar data availability and marker visibility. The localized control becomes “Show calendar on chart” and controls markers, the marker lane, hover/focus guide, and calendar legend. It does not stop future loading or hide the next-event summary, upcoming list, waiting group, or their errors.

Impact selection remains the shared content filter for all calendar presentations. The 24-hour/seven-day selector affects only the upcoming list and next-event summary; the marker set retains loaded historical events and the seven-day future coverage.

### Use one primary aggregate calendar entry point

The next-event summary is the workbench entry point to the upcoming calendar list. When there is no next event, the same area provides an explicit way to open the list so empty, filtered, loading, and failure states remain discoverable.

The aggregate footer count becomes non-interactive metadata if retained. Its full-list popover is removed. Popovers attached to individual or grouped markers remain because they explain a specific chart position and provide detail navigation.

### Render future markers only when the time coordinate is visible

Future events keep their actual scheduled timestamp. KLineCharts period extrapolation supplies a candidate x-coordinate after the last candle; the canvas renders the marker only when that coordinate is valid and within the current viewport. The feature does not create a candle, clamp the event to the last candle, or change zoom/scroll to expose it.

Market closures, weekends, daylight boundaries, and daily/weekly/monthly periods require deterministic verification. If the engine cannot produce a valid visible coordinate, the event remains available through the next-event summary and upcoming list.

### Refresh without destabilizing the workbench

The future calendar range refreshes once per minute while the document is visible and immediately when visibility returns. Asset, selected impacts, and explicit chart refresh also request current future data. Only one logical generation may commit for the active selection.

A failed initial calendar request displays a calendar-specific error while leaving price data usable. A failed refresh retains the last successful events and timestamp, marks them stale, and offers retry. An empty successful response is presented distinctly from loading and failure. The timer updates countdown presentation without resetting chart data or marker selection.

### Test at the workbench seam with deterministic time

The primary acceptance seam is the existing fixture-backed Market Chart browser journey because it covers server actions, localized UI, chart controls, and user interaction. The fixture gains future, pending, available, empty, delayed, and failed calendar scenarios plus request capture.

Deterministic helper tests cover interval classification, next-event selection, 60-minute waiting boundaries, merge behavior, and future coordinate grouping. Action tests cover request serialization and validation. Browser tests cover the user-visible composition, toggle semantics, removal of the footer popover, recovery, keyboard access, and responsive behavior.

## Risks / Trade-offs

- [Backend does not provide seven days of future schedules] → Verify the live contract and representative responses first; describe successful empty coverage honestly rather than implying completeness.
- [`time` and `scheduledAt` have different meanings] → Resolve the contract hierarchy before implementing a canonical scheduled instant and sync API mapping documentation when needed.
- [Minute refresh creates duplicate requests or stale commits] → Pause while hidden, scope requests by asset and impacts, and use the existing generation/merge patterns.
- [Future coordinate extrapolation is inaccurate across market gaps or calendar periods] → Test those boundaries and omit invalid off-viewport markers while preserving list access.
- [The upcoming entry adds density to an already busy workbench] → Keep it compact, decision-focused, responsive, and use the full calendar route for deeper exploration.
- [Removing the footer popover reduces a familiar access path] → Make the next-event area an explicit, keyboard-accessible list entry even in empty and error states.

## Migration Plan

1. Confirm the live endpoint's future coverage, timestamp precedence, and status semantics; update mapping documentation if the contract differs from the current ledger.
2. Add deterministic future-range and presentation-state behavior behind the existing Market Chart calendar integration.
3. Introduce the next-event/upcoming surface and change marker-toggle semantics before removing the duplicate footer popover.
4. Extend fixtures and automated checks, then validate localized responsive and fullscreen states.

Rollback restores the prior candle-bounded loading, whole-layer Calendar toggle, and footer count popover without data migration because the change adds no persisted user state or backend mutation.

## Open Questions

- Does the backend guarantee any future schedule coverage, or does it return only whatever the provider has already supplied within the requested interval?
- Which field is the canonical scheduled instant when both `time` and `scheduledAt` are present, and may either change when an event is rescheduled?
- Can statuses represent delayed, cancelled, or revised announcements beyond `PENDING` and `AVAILABLE` in the current live contract?

These are contract facts to resolve during the first implementation task, not unresolved product choices.
