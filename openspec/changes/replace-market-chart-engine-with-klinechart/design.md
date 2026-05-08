## Context

`/market-charts` currently renders OHLCV candles through a client-only `MarketChartCanvas` that imports `lightweight-charts`. The surrounding workbench already has the desired product model: assets come from the workspace watchlist, route state is limited to `assetId` and `timeframe`, the request computes a latest seven-day rolling window, and annotation details open in a compact popup rather than a permanent rail.

The remaining issue is the chart engine boundary. Lightweight Charts leaks into the feature through the canvas imports, timestamp type `UTCTimestamp`, coordinate conversion helpers, TradingView attribution UI, dependency entries, and OpenSpec/docs references. A migration to KLineChart should be clean enough that no stale TradingView or Lightweight Charts implementation detail remains after apply.

## Goals / Non-Goals

**Goals:**

- Use the latest `klinecharts` package version available at implementation time.
- Keep the current market chart user flow and backend API contract unchanged.
- Replace the chart rendering engine with a KLineChart adapter isolated to the market chart feature.
- Preserve candlestick rendering, volume visibility, theme-aware styling, resize/dispose lifecycle, annotation notification markers, click-to-open annotation popup, mobile fallback, loading/error/empty states, and summary rail.
- Remove all Lightweight Charts and TradingView attribution remnants from runtime code, dependencies, docs, and active OpenSpec artifacts touched by this feature.
- Add a clean-migration rule to `AGENTS.md` so future vendor/library swaps do not leave unused source behind.
- Prepare the chart adapter shape for the follow-up lazy historical loading change.

**Non-Goals:**

- Do not implement lazy historical loading in this engine migration change; the follow-up `add-market-chart-lazy-history-loading` change owns that behavior.
- Do not add realtime subscriptions, indicators, drawing tools, trade recommendations, or alerting.
- Do not change the backend candle API or add new market chart endpoints.
- Do not replace shadcn UI shell components or alter global theme tokens.
- Do not retain compatibility wrappers for Lightweight Charts after migration.

## Decisions

### Use latest KLineChart intentionally

Implementation should add `klinecharts` using the latest version resolved by the package manager at apply time, then commit the resolved version in `package.json`/`pnpm-lock.yaml`.

Rationale: the user explicitly wants latest version. KLineChart's current documentation centers APIs such as `init`, `dispose`, `resize`, `setDataLoader`, overlays, and data records with millisecond `timestamp`, which align with follow-up lazy loading and chart overlays.

Alternative considered: pin stable `9.8.x`. Rejected for this proposal because the requested direction is latest, and preparing for follow-up lazy loading benefits from following the current API surface.

### Keep a single chart adapter boundary

`MarketChartCanvas` should remain the only component that imports from `klinecharts`. Workbench state, backend DTOs, annotation grouping, and shadcn UI controls should pass plain domain data into the canvas rather than KLineChart-specific types.

Rationale: this prevents chart vendor types from spreading through the feature again. The previous `UTCTimestamp` import in annotation utilities is the kind of coupling this migration should remove.

Alternative considered: expose KLineChart types from annotation helpers for stronger typing. Rejected because it makes future engine changes more expensive and leaks rendering concerns into domain grouping logic.

### Convert candle timestamps to KLineChart millisecond records at the canvas boundary

Backend candle `time` strings should be converted to KLineChart data records inside the canvas adapter:

```text
{ timestamp, open, high, low, close, volume? }
```

The adapter should sort and de-duplicate by timestamp before applying data to the chart.

Rationale: KLineChart data records use millisecond timestamps, while the existing Lightweight Charts adapter used second-based `UTCTimestamp`. Keeping conversion local avoids mismatched timestamp units across the feature.

### Render annotation notifications through a KLineChart-compatible strategy

The migration should choose one of two implementation strategies during apply:

- Prefer KLineChart custom overlay if it can provide reliable draw position, click handling, and selected/high-priority visual treatment.
- Use a chart-local DOM overlay synced through KLineChart coordinate conversion if native overlay click behavior is not reliable enough for the current popup UX.

Either strategy must preserve the product behavior: red notification dot, pulse animation when motion is allowed, group count when multiple annotations share a candle, keyboard-accessible external controls, popup detail on click, and no permanent right-side annotation detail rail.

Rationale: KLineChart's overlay model is a better long-term fit, but the current UX requires accessible React popup behavior. The implementation should prioritize reliable interaction over forcing all annotation UI into canvas primitives.

### Prepare lazy-load architecture for a follow-up change

The canvas adapter should be structured so lazy loading can be added without rewriting the workbench:

```text
Workbench domain data
        |
        v
MarketChartCanvas adapter props
        |
        v
KLineChart instance lifecycle + data apply boundary
        |
        v
Follow-up: setDataLoader / visible-boundary callback
```

This engine migration change should not call older-window APIs or fetch historical data when the user pans. It may include small internal helper names and comments that make the follow-up boundary clear, but it should not render future-feature copy in the UI.

Rationale: the product has already chosen not to expose manual `from/to`, and the intended future model is drag/scroll lazy loading. The current change should avoid painting itself into a corner without shipping unscoped behavior.

### Delete old source, do not park it behind comments

After migration, `rg "lightweight|Lightweight|TradingView|UTCTimestamp"` should return no runtime source references for the market chart engine, except if historical OpenSpec/archive text is intentionally left untouched. The temporary unused `MarketChartAnnotationPanel` and its eslint suppression should be removed.

Rationale: a chart engine migration is exactly where stale adapters and disabled code become misleading. Clean source is more valuable than preserving a fallback path nobody exercises.

## Risks / Trade-offs

- [Latest KLineChart is an alpha version] -> Verify against installed package types during apply, keep KLineChart imports isolated, and run lint/typecheck/build before marking tasks complete.
- [Overlay API mismatch] -> Keep the annotation UX requirement stable while allowing either native KLineChart overlay or DOM overlay synced to KLineChart coordinates.
- [Timestamp unit mistakes] -> Use explicit helper names for millisecond timestamps and remove the old `UTCTimestamp` type entirely.
- [Visual regression from engine swap] -> Preserve current chart shell dimensions, loading skeleton, summary rail, and annotation popup behavior; smoke test with a real or fixture candle response when possible.
- [Dead source remains] -> Add explicit cleanup tasks and a verification grep for stale Lightweight Charts/TradingView references.

## Migration Plan

1. Add `klinecharts` latest and remove `lightweight-charts`.
2. Rewrite `MarketChartCanvas` around KLineChart `init`, data application, style setup, resize, and dispose lifecycle.
3. Replace annotation timestamp typing/grouping with engine-neutral domain types.
4. Recreate annotation marker placement and click-to-popup behavior with KLineChart overlay or a KLineChart-synced DOM overlay.
5. Remove TradingView attribution footer, old Lightweight Charts adapter code, stale imports, the unused annotation rail panel, and related eslint suppression.
6. Update `AGENTS.md`, APIMAPPING notes, and active market-chart OpenSpec artifacts to describe KLineChart rather than Lightweight Charts.
7. Verify with dependency grep, lint, typecheck, build, and a browser smoke test if authenticated chart data is available.

Rollback during development is simple: revert the change branch before merge. After merge, rollback would require reintroducing Lightweight Charts dependency and adapter, so implementation should be validated carefully before archive.

## Open Questions

- The latest package resolved at apply time is `klinecharts@10.0.0-beta1`. Its public types expose `setDataLoader`, `setSymbol`, `setPeriod`, `resetData`, `convertToPixel`, `createOverlay`, `subscribeAction`, `resize`, `init`, and `dispose`; they do not expose the older v9 `applyNewData` API as the intended public data path.
- The final annotation rendering mechanism, native overlay versus synced DOM overlay, should be chosen during implementation after checking the installed package types and runtime behavior.
