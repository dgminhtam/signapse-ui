## Context

The market chart annotation layer currently treats every valid annotation as a point event: it validates `id` and `time`, groups annotations by nearest candle time, and renders one marker per group. The updated backend contract adds `annotationType` with `HOT_EVENT`, `WARM_EVENT`, and `WARM_EPISODE`, plus warm period fields `periodStart` and `periodEnd`, optional warm identifiers, and optional top-level `outcome`.

The existing chart canvas already renders a transient HTML time-range band for outcome hover by converting timestamps to chart pixels and clamping to the candle pane. That is the smallest reusable pattern for warm periods.

## Goals / Non-Goals

**Goals:**
- Preserve new warm annotation API fields in frontend types and Zod response mapping.
- Render warm annotations as candle-pane time-range bands while keeping hot annotations as existing point markers.
- Let users open the existing annotation popup/detail preview from a warm band.
- Keep annotation layer toggle semantics unchanged: disabled means no markers or warm bands.
- Reuse existing direction color semantics and chart coordinate conversion.

**Non-Goals:**
- No klinecharts custom overlay for warm bands.
- No persisted drawing, selectable drawing metadata, or export behavior for warm bands.
- No new warm-layer toggle separate from the existing annotation layer toggle.
- No backend contract changes.
- No rich evidence/detail redesign inside the popup.

## Decisions

1. Render warm periods as HTML absolute price-range bands over the candle pane.
   - Rationale: the chart already has working HTML range-band positioning for outcome hover, and warm bands need the same viewport, resize, scroll, zoom, and clipping behavior. Warm bands additionally use the loaded candles inside the period to bound the vertical area from highest high to lowest low, so the layer highlights the affected price area instead of the full pane.
   - Alternative considered: klinecharts custom overlay. Rejected for now because warm bands are API annotations, not user drawings, and HTML avoids extra overlay registration and persistence concerns.

2. Split annotation rendering by `annotationType`.
   - `HOT_EVENT` and missing/unknown type continue through the existing marker grouping path.
   - `WARM_EVENT` and `WARM_EPISODE` with valid `periodStart` and `periodEnd` become bands.
   - Invalid warm periods are omitted like invalid marker times.

3. Reuse the existing popup surface for warm selection.
   - A warm band selection can be represented as a one-annotation group so the popup rendering path stays shared.
   - If `topMarketReaction.outcome` is missing but top-level `annotation.outcome` exists, the reaction preview uses the top-level outcome as the fallback.

4. Keep warm bands visual-only except for selection.
   - Bands sit below point markers, use low-opacity direction color, and do not create chart drawings.
   - The band hit target may open the popup, but the band must not block normal chart interactions more than needed.

## Risks / Trade-offs

- Warm bands could compete visually with candles → use low opacity, place below markers, and keep marker colors unchanged.
- Large numbers of warm annotations could add DOM nodes → derive only visible/mappable bands and keep rendering simple.
- Some warm responses may not include complete periods → omit those bands and still allow valid hot markers to render.
- Some warm periods may have no loaded candles inside the range → omit those bands until candle data is available.
- Top-level warm `outcome` may not have predicted reaction fields → only render available actual outcome content without placeholders.
