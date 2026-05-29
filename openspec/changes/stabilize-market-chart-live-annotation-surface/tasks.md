## 1. Viewport-Aware Chart Surface

- [x] 1.1 Update the mounted market chart surface/container so the chart uses available viewport height with a safe minimum height.
- [x] 1.2 Update `MarketChartCanvas` sizing so normal mode can fill the parent surface instead of forcing a fixed canvas height.
- [x] 1.3 Ensure chart resize handling still works for window resize, sidebar changes, and full-screen state without resetting chart data.

## 2. Stable Live Candle Updates

- [x] 2.1 Replace the `liveCandle` effect's chart-wide `resetData()` path with a non-reset live candle update path.
- [x] 2.2 Wire KLineChart data loader `subscribeBar` or an equivalent local callback so SSE candle updates update/append KLineData incrementally.
- [x] 2.3 Guard live update callbacks by current chart identity so stale asset/timeframe updates cannot mutate the current chart.
- [x] 2.4 Keep lazy-loaded historical candles and the user's visible range stable when live updates arrive while the user is reviewing older candles.

## 3. Annotation Color And Legend

- [x] 3.1 Centralize annotation direction/reaction color mapping for chart markers, popup dot/pulse, footer cues, and legend items.
- [x] 3.2 Update annotation popup marker affordances to use the shared color mapping instead of hardcoded destructive/red styling.
- [x] 3.3 Add a compact annotation legend strip above the chart footer when annotation markers are enabled and present.
- [x] 3.4 Hide annotation legend copy when annotations are disabled or when there are no visible annotations.

## 4. Annotation Popup Containment

- [x] 4.1 Refine desktop annotation popup positioning so it clamps or flips inside the available chart surface/viewport near edges.
- [x] 4.2 Split popup frame and body scrolling so the outer rounded frame remains intact and only event content scrolls.
- [x] 4.3 Keep popup header and close action visible and usable while popup content scrolls.

## 5. Skeleton Alignment

- [x] 5.1 Update chart-level loading skeleton to mirror the viewport-aware chart surface, optional legend strip, and footer rail structure.
- [x] 5.2 Update page-level market chart skeleton to avoid short fixed-height placeholders on tall viewports.
- [x] 5.3 Keep skeleton cues shape-based and avoid fake symbol/timeframe/update-time or annotation copy.

## 6. Verification

- [x] 6.1 Run `openspec validate stabilize-market-chart-live-annotation-surface --strict`.
- [x] 6.2 Run `pnpm typecheck`.
- [x] 6.3 Run `pnpm lint`.
- [x] 6.4 Run a deterministic code review of market chart canvas/workbench/skeleton changes for viewport stability, live update identity guards, and annotation color consistency.

User-owned manual QA note: after implementation, manually confirm in the browser that panning away from realtime stays stable while live data arrives, annotation popup placement is readable near edges, and the chart uses more vertical space on a large screen.
