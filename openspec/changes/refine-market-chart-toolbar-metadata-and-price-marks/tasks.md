## 1. Toolbar Metadata

- [x] 1.1 Remove the in-chart `chartContextLabel` pill from `ChartSurface`.
- [x] 1.2 Replace the old symbol/timeframe/update helper with a freshness-only helper that returns `Cập nhật HH:mm dd/MM/yyyy` from successful chart data.
- [x] 1.3 Render the freshness metadata in `AppListToolbarTrailing` near the refresh action using subdued non-interactive text.
- [x] 1.4 Ensure the toolbar metadata does not add `symbol`, `timeframe`, `from`, `to`, cursor, or lazy-load params to the URL.

## 2. KLineChart Price Marks

- [x] 2.1 Update `createChartStyles()` so `candle.priceMark.last.text.family` uses the resolved app font family.
- [x] 2.2 Set `candle.priceMark.high.show=false` and `candle.priceMark.low.show=false`.
- [x] 2.3 Keep the last price marker enabled and avoid setting `candle.priceMark.show=false`.

## 3. Verification

- [x] 3.1 Run targeted lint for market chart files.
- [x] 3.2 Run `pnpm typecheck`.
- [x] 3.3 Run `pnpm build`.
- [x] 3.4 Run `openspec validate --changes refine-market-chart-toolbar-metadata-and-price-marks`.
- [x] 3.5 Smoke check `/market-charts` visually with authenticated chart data when available; if unavailable, document the blocker. Blocked: no authenticated Clerk workspace/provider candle session is available in this terminal context.
