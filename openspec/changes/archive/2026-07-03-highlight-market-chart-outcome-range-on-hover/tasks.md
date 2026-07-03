## 1. Hover Range State

- [x] 1.1 Add a small outcome hover range type with `anchorTime` and `evaluationTime`.
- [x] 1.2 Wire reaction section hover/focus handlers to set and clear the active outcome range.
- [x] 1.3 Clear the active outcome range when the annotation popup closes.

## 2. Chart Highlight Band

- [x] 2.1 Pass the active outcome range from the workbench into `MarketChartCanvas`.
- [x] 2.2 Convert the active range timestamps to candle-pane x coordinates using the existing chart pixel conversion path.
- [x] 2.3 Render a pointer-events-none HTML absolute band clipped to the candle pane bounds.
- [x] 2.4 Keep the band aligned when the chart scrolls, zooms, visible range changes, resizes, or data updates.
- [x] 2.5 Omit the band when either endpoint is missing, invalid, or outside mappable visible coordinates.

## 3. Verification

- [x] 3.1 Run `openspec validate highlight-market-chart-outcome-range-on-hover --strict`.
- [x] 3.2 Run `pnpm typecheck`.
