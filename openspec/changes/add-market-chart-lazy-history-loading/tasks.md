## 1. Range And Merge Helpers

- [x] 1.1 Inspect the installed KLineChart loader behavior during implementation and confirm that `forward` is the older-history prepend path for the active package version.
- [x] 1.2 Add market chart helper utilities for timeframe interval duration and conservative lazy-window duration per supported timeframe.
- [x] 1.3 Add or refactor candle normalization helpers so backend candles become sorted, de-duplicated KLineChart records by millisecond timestamp.
- [x] 1.4 Add annotation merge/de-duplication helpers keyed by stable annotation identity for lazy-loaded annotation payloads.

## 2. Chart Data Loader

- [x] 2.1 Refactor `MarketChartCanvas` so the KLineChart instance is reset only when chart identity changes, not when older candles are prepended.
- [x] 2.2 Introduce a chart reset key derived from selected `assetId`, timeframe, annotation layer state, and refresh cycle.
- [x] 2.3 Configure KLineChart `setDataLoader()` so initial data advertises older-history availability through the correct load-more flag.
- [x] 2.4 Implement the `forward` lazy-load branch to request the older window ending before the current oldest loaded candle.
- [x] 2.5 Keep `backward` or right-edge/future loading disabled for this change.
- [x] 2.6 Guard lazy-load responses so stale asset, timeframe, annotation state, or refresh responses cannot merge into the active chart.
- [x] 2.7 Return only genuinely older, sorted, de-duplicated candles to the KLineChart callback and set the correct load-more state.

## 3. Workbench Integration

- [x] 3.1 Wire the selected watchlist asset `assetId`, timeframe, annotation toggle, and refresh cycle into the canvas lazy-load boundary.
- [x] 3.2 Reuse `getMarketChartCandles()` for lazy older-window requests with computed `from/to` and current `includeAnnotations`.
- [x] 3.3 Reset loaded history, older-history exhaustion, selected annotation popup, and lazy-load state when asset, timeframe, annotation toggle, refresh, invalid selection, or watchlist context changes.
- [x] 3.4 Preserve the route query model so lazy loading never writes `from`, `to`, `symbol`, cursor, or lazy-load params to the URL.

## 4. Annotation And Feedback UX

- [x] 4.1 Merge lazy-loaded annotations into the chart annotation group source when the annotation layer is enabled.
- [x] 4.2 Recompute marker positions and accessible annotation controls after older candles or annotations are merged.
- [x] 4.3 Keep annotation requests, markers, controls, and empty-state copy disabled when the annotation layer is off.
- [x] 4.4 Add compact in-chart pending feedback for older-history loading without replacing the visible chart with the initial skeleton.
- [x] 4.5 Add compact Vietnamese lazy-load error feedback that keeps existing chart data visible and allows retry on a later boundary request.
- [x] 4.6 Stop older-history requests for the active chart identity when the backend returns no new older candles.

## 5. Documentation And Verification

- [x] 5.1 Update `docs/APIMAPPING.md` to mark older historical loading as implemented for `/market-charts` and note that it still uses the existing candle endpoint.
- [x] 5.2 Update active market-chart OpenSpec notes if they still state that lazy historical loading is future scope.
- [x] 5.3 Run targeted lint for market chart files.
  - Verification: `pnpm lint -- "app/(main)/market-charts" "app/lib/market-charts" "app/api/market-charts/action.ts"` passed.
- [x] 5.4 Run `pnpm typecheck`.
  - Verification: `pnpm typecheck` passed.
- [x] 5.5 Run `pnpm build`.
  - Verification: `pnpm build` passed.
- [x] 5.6 Run `openspec validate --changes add-market-chart-lazy-history-loading`.
  - Verification: OpenSpec validation passed.
- [x] 5.7 Smoke test `/market-charts` with authenticated chart data by panning left far enough to trigger an older-history load; if unavailable, document the exact authenticated/backend/provider blocker.
  - Blocked locally: no authenticated Clerk browser session with a workspace/provider candle fixture is available in this thread, so interactive `/market-charts` pan-left smoke still needs a logged-in workspace session.
