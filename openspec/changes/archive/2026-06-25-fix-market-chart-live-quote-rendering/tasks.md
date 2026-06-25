## 1. Live Stream Contract

- [x] 1.1 Add `MARKET_CLOSED` to `MarketChartLiveStreamState` and `marketChartLiveStreamStateSchema`.
- [x] 1.2 Map `MARKET_CLOSED` to a non-error live status label and tone in the market chart workbench.

## 2. Quote-Derived Candle Rendering

- [x] 2.1 Add a market chart helper that derives a display-only live candle from a live quote, current candle data, and active timeframe.
- [x] 2.2 Keep derived candle volume unavailable unless the quote has finite volume.
- [x] 2.3 Ensure stale quote buckets do not regress the displayed latest candle.
- [x] 2.4 Ensure real live candle events supersede quote-derived candle values for the same bucket.

## 3. Workbench Integration

- [x] 3.1 Feed quote-derived candles through the existing `liveCandle` path passed to `MarketChartCanvas`.
- [x] 3.2 Keep `MarketChartCanvas` candle-only; do not add a quote-specific chart API.
- [x] 3.3 Keep historical candles, annotations, indicators, and drawings visible during quote-derived live updates.

## 4. Verification

- [x] 4.1 Add or update the smallest deterministic helper checks for quote bucket derivation and stale quote handling.
- [x] 4.2 Run `openspec.cmd validate fix-market-chart-live-quote-rendering --strict`.
- [x] 4.3 Run `pnpm.cmd typecheck`.
- [x] 4.4 Run `pnpm.cmd lint`.
