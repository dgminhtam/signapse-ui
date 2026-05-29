## Why

Market chart is now useful enough that small surface issues directly interrupt analysis: the chart leaves unused vertical space on large screens, annotation popups can feel clipped or visually inconsistent, and live candle updates can pull users away from the historical area they are reviewing. This change stabilizes the chart reading workspace before adding more advanced chart tools.

## What Changes

- Make the market chart surface consume available viewport height in normal workbench mode instead of using a fixed-height canvas that leaves a large blank area below on larger screens.
- Keep chart loading skeletons aligned with the final viewport-aware chart surface so pending states do not introduce layout shift.
- Stabilize live candle rendering so incoming live updates update or append the latest candle without resetting chart data or forcing the visible viewport back to realtime while the user is reviewing history.
- Align annotation popup marker color with the selected annotation direction/reaction color used on the chart marker.
- Improve annotation popup placement and internal scrolling so desktop popups remain readable and are not visually cut off near chart edges.
- Add a compact annotation color legend above the chart footer so users can understand positive, negative, neutral, and mixed event markers without opening a popup.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-candle-workbench`: require viewport-aware chart height and live candle updates that do not reset or steal the user's visible chart range.
- `market-chart-annotation-markers`: require a concise annotation color legend that uses the same direction/reaction mapping as chart markers.
- `market-chart-annotation-popup-surface`: require popup dot/pulse color consistency with chart markers and stronger clipping/scroll containment.
- `market-chart-chartlike-skeleton`: require skeletons to mirror the viewport-aware chart surface height and footer/legend structure.
- `market-chart-surface-density`: require the chart surface to prioritize vertical reading space without adding a separate panel or redundant copy.

## Impact

- Affected UI: `app/[lang]/(main)/market-charts` workbench, canvas, annotation popup, status/footer area, and chart skeletons.
- Affected behavior: live candle updates should flow through KLineChart's realtime update path or an equivalent non-reset path instead of `resetData()` on every tick.
- Affected i18n: add or reuse concise Vietnamese/English copy for the annotation legend where needed.
- No backend API, dependency, route, or authentication changes are expected.
