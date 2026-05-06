## 1. Dependency And Cleanup Baseline

- [x] 1.1 Add the latest `klinecharts` package version resolved at implementation time.
- [x] 1.2 Remove `lightweight-charts` from `package.json` and `pnpm-lock.yaml`.
- [x] 1.3 Inspect installed KLineChart type exports and confirm the exact APIs for `init`, data apply/loading, resize, dispose, coordinate conversion, overlays, and action subscriptions.
- [x] 1.4 Record any installed-version API caveat in the change notes or design if the latest package differs from the expected docs.

## 2. KLineChart Canvas Adapter

- [x] 2.1 Rewrite `MarketChartCanvas` so it creates, styles, resizes, and disposes a KLineChart instance safely in a client component.
- [x] 2.2 Convert backend candles to sorted, de-duplicated KLineChart records with millisecond `timestamp`, `open`, `high`, `low`, `close`, and optional `volume`.
- [x] 2.3 Preserve current chart dimensions, theme-aware colors, grid/axis readability, and volume visibility.
- [x] 2.4 Keep KLineChart imports and vendor-specific types inside `MarketChartCanvas` or chart-local helper code only.
- [x] 2.5 Structure the canvas data-apply boundary so a later lazy-load change can plug into KLineChart data loading without changing workbench route state or DTOs.

## 3. Annotation Migration

- [x] 3.1 Replace `UTCTimestamp` usage in `market-chart-annotations.ts` with engine-neutral timestamp typing.
- [x] 3.2 Preserve annotation grouping by nearest candle time and high-priority detection.
- [x] 3.3 Implement annotation notification markers with a KLineChart custom overlay or a KLineChart-synced DOM overlay.
- [x] 3.4 Preserve red pulse marker styling, grouped marker count, selected state, reduced-motion behavior, and click-to-open popup placement.
- [x] 3.5 Preserve accessible annotation controls outside the canvas and mobile popup fallback.
- [x] 3.6 Confirm the old right-side annotation panel is not rendered or restored.

## 4. Workbench And UI Cleanup

- [x] 4.1 Remove TradingView attribution footer/copy from the market chart surface.
- [x] 4.2 Remove unused `MarketChartAnnotationPanel`, related `Separator` import, eslint suppression, and any other dead chart-engine fallback code.
- [x] 4.3 Preserve watchlist-only asset selection, timeframe selection, latest seven-day rolling request window, annotation toggle, refresh behavior, URL query params, loading/error/empty states, and summary rail.
- [x] 4.4 Ensure no UI copy exposes implementation details about KLineChart, future lazy loading, backend `from/to`, or chart engine internals.

## 5. Documentation And Rules

- [x] 5.1 Add a clean vendor/library migration rule to `AGENTS.md` requiring stale dependency, import, adapter, attribution, documentation, and dead-code cleanup.
- [x] 5.2 Update `docs/APIMAPPING.md` to describe the chart UI without Lightweight Charts or TradingView attribution references.
- [x] 5.3 Update active market-chart OpenSpec artifacts that still describe Lightweight Charts as the selected engine or TradingView attribution as a runtime requirement.
- [x] 5.4 Leave archived historical OpenSpec content untouched unless it is part of an active verification path.

## 6. Verification

- [x] 6.1 Run `rg "lightweight|Lightweight|TradingView|UTCTimestamp" package.json pnpm-lock.yaml app docs openspec/changes/add-market-chart-candle-workbench openspec/changes/add-market-chart-annotation-markers openspec/changes/refine-market-chart-annotation-popups openspec/changes/replace-market-chart-engine-with-klinechart` and verify only acceptable historical/archive or intentionally updated references remain.
  - Verification: runtime app/package/APIMAPPING no longer references Lightweight Charts, TradingView, or `UTCTimestamp`; remaining matches are intentional migration context inside `replace-market-chart-engine-with-klinechart` and active docs noting KLineChart avoids TradingView runtime attribution.
- [x] 6.2 Run targeted lint for market chart files.
  - Verification: `pnpm lint -- "app/(main)/market-charts" "app/lib/market-charts" "app/api/market-charts/action.ts"` passed.
- [x] 6.3 Run `pnpm typecheck`.
  - Verification: `pnpm typecheck` passed.
- [x] 6.4 Run `pnpm build`.
  - Verification: `pnpm build` passed.
- [x] 6.5 Run `openspec validate --changes replace-market-chart-engine-with-klinechart`.
  - Verification: OpenSpec validation passed.
- [x] 6.6 Smoke test `/market-charts` with authenticated chart data when available; if unavailable, document the exact blocker.
  - Blocked locally: no authenticated Clerk browser session and backend/provider candle fixture is available in this thread, so interactive `/market-charts` smoke with real chart data still needs a logged-in workspace session.
