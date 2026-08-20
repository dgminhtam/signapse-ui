## Why

Market Charts currently asks for candles by calendar-time range. Assets with sparse provider history can return no candles for that range even though older available candles exist, leaving the chart empty and preventing useful historical navigation. The backend now supports count-back retrieval, so the frontend can request available candles rather than assume continuous time slots.

## What Changes

- Replace market-chart candle requests based on `from`/`to` ranges with count-back requests anchored at an exclusive `to` timestamp.
- Use the agreed per-timeframe counts for initial and older-history pages, with a frontend validation bound of 1 through 1000.
- Use a UTC-aligned, exclusive end boundary for initial and refreshed requests, including ISO Monday 00:00Z weekly boundaries; use the oldest returned candle time unchanged as the next older-history anchor.
- Use count-back retrieval for both initial/refresh loading and lazy older-history loading; keep short non-empty pages pageable, classify only an exact empty response at the requested anchor as exhausted history, and preserve retry behavior for API or response-contract errors.
- Derive the displayed candle interval from returned available candles, then load annotations and economic-calendar data only for that interval.
- Preserve and render partial candles, preserve live SSE updates without immediate historical trimming, add a localized no-data retry state, and avoid a legacy time-range fallback.
- Add deterministic fixtures and behavior-level tests for sparse history, pagination, exhaustion, failures, and metadata alignment.
- Update the frontend API mapping ledger to mark the count-back contract as integrated when implementation is complete.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-candle-workbench`: Load the selected chart through a bounded count-back request and show the agreed no-data recovery behavior.
- `market-chart-lazy-history-loading`: Retrieve older available candles through exclusive count-back pages and classify history exhaustion correctly.
- `market-chart-economic-calendar-events`: Scope calendar retrieval to the displayed candle interval instead of a requested calendar-time window.
- `market-chart-deterministic-helpers`: Provide deterministic request, interval, and page-outcome helpers for the count-back policy.

## Impact

- Affected frontend contract types, runtime validation, authenticated candle transport, chart-loading orchestration, annotation/calendar range construction, partial-candle mapping, and localized empty/retry states.
- Affected test fixtures and market-chart behavior tests; no new runtime dependency, route parameter, chart engine, or backend API field is required.
- The backend must continue to honor the confirmed contract: a count-back request returns up to N available candles before its exclusive `to` anchor while ignoring provider gaps; a short non-empty page can be caused by sparse history, and only an empty response with `from = to = anchor` confirms no older available candles.
