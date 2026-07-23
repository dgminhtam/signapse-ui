## Why

The backend now accepts the `4h` market-chart timeframe, but the frontend rejects it and has no chart, history, live-bucket, or localized control mappings for it. Adding the missing frontend contract lets users request and analyze four-hour candles through the existing market chart workflow.

## What Changes

- Add `4h` to the shared frontend timeframe contract and runtime validation.
- Expose `4H` between `1H` and `1D` in the existing timeframe control, with English and Vietnamese labels.
- Map `4h` to a four-hour KLineCharts period and use timeframe-aware initial and older-history windows.
- Bucket quote-only live updates into four-hour intervals while preserving the existing chart lifecycle.
- Add deterministic assertions for the `4h` contract, chart period, history request, and live quote behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-candle-workbench`: Accept, display, persist, and request the backend `4h` timeframe.
- `market-chart-klinechart-engine`: Render `4h` data with the KLineCharts four-hour period.
- `market-chart-lazy-history-loading`: Build valid older-history ranges for `4h`.
- `market-chart-live-sse-stream`: Apply quote-only updates using four-hour bucket boundaries.

## Impact

- Shared market-chart DTO and Zod definitions.
- Market-chart toolbar, URL state, initial request window, KLineCharts period adapter, lazy-history helpers, and live quote helper.
- English and Vietnamese market-chart dictionaries.
- No backend API, route shape, chart dependency, or new UI component is required.
