## Why

Annotation outcomes include an anchor-to-evaluation time range, but users currently need to read the popup text and mentally map that window back onto the chart. Highlighting the range on hover makes the predicted-versus-actual reaction easier to inspect in context.

## What Changes

- Show a transient chart highlight band when the user hovers a popup reaction section with both `outcome.anchorTime` and `outcome.evaluationTime`.
- Render the highlight as a non-interactive HTML absolute band over the candle pane using chart pixel conversion.
- Clear the highlight when hover leaves, the popup closes, or the hovered outcome has no complete time range.
- Keep the band visual-only: no persistence, drawing tool integration, klinecharts custom overlay, screenshot/export requirement, or backend change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-annotation-popup-interaction`: annotation popup hover can temporarily highlight the outcome evaluation time window on the chart.

## Impact

- Affects market chart annotation popup hover handling, chart canvas overlay rendering, and related state wiring between `market-chart-workbench.tsx` and `market-chart-canvas.tsx`.
- No API contract, backend, dependency, drawing persistence, marker grouping, or routing changes.
