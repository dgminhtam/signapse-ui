## Context

Market chart annotation popups already render reaction outcome data from `topMarketReaction.outcome`, including `anchorTime` and `evaluationTime`. Annotation markers are positioned as React/HTML overlays on top of the klinecharts canvas using `chart.convertToPixel`, so a transient hover highlight can reuse that same coordinate bridge.

## Goals / Non-Goals

**Goals:**

- Highlight the outcome evaluation time window while the user hovers a reaction section in the annotation popup.
- Render the highlight over the candle pane as a non-interactive HTML absolute band.
- Keep the highlight synced with chart scroll, zoom, visible range changes, resize, and popup close.
- Omit the highlight when either range endpoint is missing or cannot be mapped to chart pixels.

**Non-Goals:**

- Do not create a klinecharts custom overlay for this hover-only state.
- Do not persist, select, edit, export, or screenshot the highlight as a chart drawing.
- Do not change backend annotation contracts, marker grouping, or popup placement.

## Decisions

- Use React state to hold the currently hovered outcome range and pass it to `MarketChartCanvas`.
- Trigger the state from the reaction section mouse/focus hover affordance, using `anchorTime` and `evaluationTime` only when both are present.
- In `MarketChartCanvas`, calculate the band from timestamps with `chart.convertToPixel` and candle pane bounds from `chart.getSize` or `chart.getDom`.
- Render the band as `pointer-events-none` HTML above the chart canvas and below marker/popover controls.
- Recompute the band in the existing marker-position update path that already responds to chart scroll, zoom, visible range changes, live candle updates, and resize.

## Risks / Trade-offs

- HTML bands are not native klinecharts overlays -> acceptable because this is a hover hint, not a persisted chart artifact.
- Partially visible ranges can extend beyond the viewport -> clamp the rendered band to the candle pane bounds.
- Missing or invalid outcome times can create misleading highlights -> render nothing unless both timestamps convert to finite coordinates.
