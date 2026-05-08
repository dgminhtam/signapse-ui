## Context

`/market-charts` currently loads the latest rolling candle window for a selected workspace watchlist asset and timeframe. The UI intentionally hides manual `from` and `to` controls, keeps route state to `assetId` and `timeframe`, and renders OHLCV candles through KLineChart.

The installed KLineChart package exposes `setDataLoader()`, `getDataList()`, `getVisibleRange()`, and action subscriptions. The current `MarketChartCanvas` already calls `setDataLoader()`, but its loader only returns initial data and returns no data for later load types. KLineChart's v10 data loader naming is slightly counterintuitive: in the installed package, the left-edge historical prepend path uses `type === "forward"` and provides the current first candle timestamp, while `type === "backward"` appends to the right side. This proposal needs older history only, so the implementation should support the `forward` load path and explicitly keep `backward` disabled.

The main implementation risk is data ownership. If older candles are loaded by updating React candle props in a way that recreates the KLineChart instance, users will lose their viewport right when they pan into older history. The lazy-load design therefore needs an imperative chart-adapter boundary that can prepend bars through KLineChart's callback while keeping React state updates from causing chart reset.

## Goals / Non-Goals

**Goals:**

- Load older candle history when the user pans toward the oldest loaded candle.
- Keep the initial latest-window behavior: `to = now`, `from = now - 7 days`.
- Keep `assetId` and `timeframe` as the only chart URL state.
- Keep manual `from` and `to` hidden from the UI.
- Use the existing `GET /market-charts/candles` endpoint for both initial and lazy older windows.
- Preserve the user's current chart viewport when older data is prepended.
- Merge and de-duplicate candles by timestamp.
- Merge and de-duplicate annotations when the annotation layer is enabled.
- Provide compact lazy-load feedback without replacing the chart surface.
- Reset history safely when chart identity or annotation request scope changes.

**Non-Goals:**

- Do not add realtime streaming or right-edge future loading.
- Do not add toolbar redesign, indicators, drawing tools, screenshot, or fullscreen controls.
- Do not expose manual date range controls or add `from`/`to` to the route.
- Do not introduce a new backend endpoint, cursor contract, dependency, permission, or global theme token.
- Do not promise infinite history if the backend/provider has no more candles.

## Decisions

### 1. Use KLineChart data loader as the prepend boundary

Older candles should be loaded through `chart.setDataLoader().getBars()` and delivered through KLineChart's `callback(data, more)` rather than replacing the chart data through a React-driven re-render.

Rationale: KLineChart adjusts the visible range when data is prepended through the loader. This is the safest way to keep the user's viewport stable.

Alternative considered: store the full candle array in Workbench React state and pass it back into `MarketChartCanvas`. Rejected because the current canvas effect depends on candle props and would likely recreate the chart instance unless significantly refactored first.

### 2. Treat KLineChart `forward` as the older-history path

The installed package prepends bars when loader `type === "forward"` and passes the first loaded candle timestamp. The implementation should call the older-window API from this branch and keep `backward` loading disabled.

Rationale: This matches the actual package behavior in `node_modules/klinecharts/dist`, not the intuitive English meaning of the type name.

Alternative considered: infer older loading from `onVisibleRangeChange` and manually scroll/merge. Rejected because it duplicates work already owned by KLineChart and increases the risk of viewport jumps.

### 3. Keep lazy range computation local and timeframe-aware

Initial chart loads continue to request the latest seven days. Lazy older requests should compute:

```text
to = oldestLoadedCandleTime - one timeframe interval
from = to - lazyWindowFor(timeframe)
```

The lazy window should be conservative and timeframe-aware so small timeframes do not repeatedly request very large payloads. The exact helper can target a bounded candle count rather than a fixed number of days for every timeframe.

Rationale: A seven-day chunk is reasonable for the initial UX, but too heavy for repeated `1m` lazy loads and too small for weekly/monthly charts.

Alternative considered: always load another seven days. Rejected because it does not scale across `1m` and `1mo`.

### 4. Maintain a chart-local loaded data store with explicit reset keys

The canvas adapter should maintain loaded candle and annotation refs keyed by chart identity:

```text
assetId + timeframe + includeAnnotations + refresh version
```

When the key changes, the chart resets to the new initial response. When older data arrives for an old key, the response is ignored.

Rationale: Server actions cannot always be canceled once started. Keyed response guards prevent stale asset/timeframe responses from merging into the current chart.

Alternative considered: rely only on KLineChart's internal `_loading` flag. Rejected because it prevents concurrent loader calls inside one chart instance but does not protect against React-level selection changes.

### 5. Merge annotations with loaded history only when requested

When the annotation layer is enabled, lazy requests should pass `includeAnnotations=true` and merge returned annotations into the loaded annotation set. Markers and accessible annotation controls should be recomputed from the loaded candle/annotation refs after each successful prepend.

When the annotation layer is disabled, lazy requests should pass `includeAnnotations=false`, avoid storing annotation payloads, and avoid rendering annotation empty-state copy.

Rationale: Annotation markers must remain spatially correct across newly loaded history, but annotation payload should not be fetched or processed when the user has disabled that layer.

Alternative considered: keep annotations only for the initial seven-day window. Rejected because older loaded candles would then look event-free even when backend has annotations for those ranges.

### 6. Use compact non-blocking lazy states

Initial chart loading can keep the current skeleton. Lazy older loading should show small in-chart feedback such as `Đang tải lịch sử...` near the chart edge or chart status area. Lazy errors should not clear the existing chart; they should surface concise retry guidance and allow the next boundary-triggered request to retry.

Rationale: Lazy loading is a background extension of visible data, not a full screen state.

Alternative considered: reuse the existing chart skeleton for every lazy request. Rejected because it would hide the chart while the user is actively navigating it.

## Risks / Trade-offs

- [KLineChart loader naming is confusing] -> Document and implement a small helper/comment around the `forward` older-history branch.
- [Viewport jumps after React updates] -> Keep older candle prepend inside the canvas data loader and avoid making lazy candle arrays a dependency that reinitializes the chart.
- [Backend returns overlapping windows] -> Sort and de-duplicate candles by millisecond timestamp before passing older bars to KLineChart.
- [Backend returns empty older data] -> Mark older history as exhausted and return `more.forward=false`.
- [Slow provider or transient API error] -> Keep existing data visible, show compact lazy-error feedback, and allow later retry.
- [Annotation controls drift from chart data] -> Recompute annotation groups from the same loaded candle/annotation store used for marker positioning after every successful merge.
- [Very small timeframes produce large payloads] -> Use timeframe-aware lazy windows with bounded candle targets.
- [Stale responses after asset/timeframe switch] -> Guard every lazy response by the active chart reset key before merging.

## Migration Plan

1. Add market chart range/window helper utilities for timeframe intervals and lazy chunk sizes.
2. Refactor the chart canvas data-loader boundary so initial data, older loading, marker positioning, and annotation group updates do not recreate the chart during lazy prepends.
3. Add an older-window loader that calls `getMarketChartCandles()` with computed `from/to`, selected `assetId`, timeframe, and annotation toggle.
4. Merge/de-duplicate older candles and annotations, then return only genuinely older bars to KLineChart's loader callback.
5. Add compact lazy pending/error/exhausted feedback.
6. Update APIMAPPING and active OpenSpec notes to mark older historical loading as implemented.
7. Verify with targeted lint, typecheck, build, OpenSpec validation, and an authenticated chart smoke test if a workspace/provider fixture is available.

Rollback during development is straightforward: revert the change branch. After merge, rollback should disable the older-history loader by returning no data for `forward` and setting `more.forward=false`, preserving the initial chart flow.

## Open Questions

- The backend does not expose a cursor, total count, or explicit `hasMoreHistory`. The frontend will infer exhaustion from empty older responses or from responses that contain no new candle timestamps after de-duplication.
- The exact timeframe-to-window mapping can be tuned during implementation based on observed backend/provider performance, but it should start conservative for minute timeframes.
