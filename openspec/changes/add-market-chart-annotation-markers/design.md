## Context

The market chart workbench already selects assets from the current workspace watchlist, computes a latest rolling candle window, and renders OHLCV data through the active financial chart engine. The latest backend candle contract exposes `includeAnnotations` on `GET /market-charts/candles` and returns `annotations[]` with event timing, direction, severity, confidence, reaction context, evidence, and optional event detail links.

The current frontend intentionally sends `includeAnnotations=false` and only parses the annotation payload. This proposal turns that parsed contract into a visible event layer without adding fake markers, recommendations, or explanatory copy that competes with the chart.

## Goals / Non-Goals

**Goals:**

- Let users visually locate backend event annotations on the candlestick chart.
- Keep annotation visibility user-controlled so the chart can remain clean during price-focused reading.
- Render markers from real backend `annotations[]` only.
- Let users inspect selected annotation details without relying on hover-only canvas interactions.
- Preserve the minimal chart workspace direction: controls and data first, copy only when it helps decision-making.
- Keep API use aligned with the current `assetId`, `timeframe`, `from`, `to`, and `includeAnnotations` contract.

**Non-Goals:**

- Do not add manual symbol input, manual `from/to` inputs, realtime updates, lazy historical loading, technical indicators, drawing tools, or trade recommendations.
- Do not create a separate annotation endpoint or client-side event derivation.
- Do not render long annotation labels directly over the chart canvas.
- Do not add placeholder panels for future event features that do not have data.
- Do not change global theme tokens or shadcn primitive implementations.

## Decisions

### Use a user-controlled annotation layer

The workbench should add a compact annotation visibility control near the existing chart controls. When the layer is enabled, candle requests send `includeAnnotations=true`; when disabled, requests send `includeAnnotations=false`.

Rationale: the BE contract already supports conditional annotation payloads. A toggle keeps the default chart reading experience calm and gives users control when event context matters.

Alternative considered: always request annotations. Rejected because annotation density can clutter the chart and increase payload cost even when the user only wants price movement.

### Render annotations as chart notification markers

The chart canvas should map `annotations[]` into compact notification markers attached to the matching candle time. Direction should drive visual meaning:

- `BULLISH`: positive/up marker, preferably below the candle.
- `BEARISH`: negative/down marker, preferably above the candle.
- `MIXED`: neutral marker treatment.
- `NEUTRAL`: muted marker treatment.

Severity can influence emphasis, but marker color should remain semantic and readable. Confidence should be shown in details rather than encoded as another chart color.

Rationale: marker primitives or a chart-synced overlay are designed for event points on a time series. They keep the annotation layer tied to candle time instead of building a detached detail panel.

Alternative considered: render shadcn popovers directly over the canvas without chart-coordinate sync. Rejected because coordinate anchoring, resize, scroll, and mobile behavior make it brittle.

### Group annotations that share a candle time

If multiple annotations map to the same chart time bucket, the chart should render a single grouped marker with a short count or neutral marker text. The detail surface should show the group contents.

Rationale: overlapping markers are hard to scan and can become visually noisy. Grouping preserves signal without hiding that more than one event exists.

Alternative considered: render every annotation separately. Rejected because same-time markers can overlap and create accidental emphasis.

### Use marker selection plus an accessible detail surface

Selecting an annotation marker should update workbench state and show annotation details in a side rail on desktop. On narrower layouts, details can appear in a sheet or a collapsible below-chart area. The detail surface should show only useful fields:

- title and time
- direction, severity, and confidence when present
- summary or reaction reasoning when present
- evidence items with publisher/title/date when present
- event detail link when `links.eventDetail` exists

The UI must also provide a keyboard-accessible annotation list or grouped annotation rows outside the canvas, because canvas marker interactions alone are not sufficient for accessibility.

Rationale: marker selection gives visual context, while the external detail surface supports reading, keyboard access, and mobile.

Alternative considered: hover-only tooltip. Rejected because it is hard to use on touch devices and not enough for screen reader or keyboard workflows.

### Keep annotation copy minimal

The chart should not add explanatory hero text, backend implementation copy, or permanent long descriptions for the annotation layer. Empty annotation states should be short and contextual, such as "Chua co su kien trong khoang hien tai" when the layer is enabled and the backend returns no annotations.

Rationale: the project now has an explicit minimal-screen convention. Annotation UI should help users inspect events, not narrate how the feature works.

Alternative considered: reintroduce a future event panel. Rejected because the backend now has real annotation data and placeholder text would compete with the chart.

### Preserve current URL model

The route URL should continue storing only `assetId` and `timeframe`. Annotation visibility can be local UI state unless implementation finds a strong shareability need.

Rationale: chart links should reopen the latest chart for the asset/timeframe. Annotation state is a view layer, not a data identity. Keeping it out of the URL avoids widening the route contract prematurely.

Alternative considered: add `annotations=true` to the URL. Deferred until there is a clear product reason to share an event-layer view.

## Risks / Trade-offs

- [Annotation density] -> Group same-time annotations and keep the layer user-controlled. Add filters later only if real data density requires it.
- [Marker click support limitations] -> Keep a keyboard-accessible annotation list/detail surface as a fallback and do not depend solely on canvas marker click behavior.
- [Time alignment] -> Normalize annotation `time` with the same chart time conversion used for candles and ignore invalid or out-of-range annotation times.
- [Payload cost] -> Only request `includeAnnotations=true` when the user enables the layer.
- [Visual clutter] -> Avoid long marker text and avoid permanent chart overlays; show detail outside the canvas.
- [Contract drift] -> Keep schemas tolerant of nullable optional annotation fields and update `docs/APIMAPPING.md` if backend shape changes.

## Migration Plan

1. Keep the existing candle workbench, asset selection, timeframe selection, and rolling latest window behavior.
2. Add annotation layer state and pass `includeAnnotations` through the existing market chart request builder.
3. Map returned `annotations[]` into chart marker data and grouped annotation view models.
4. Extend the chart canvas to render and clean up marker primitives with the candlestick series lifecycle.
5. Add the annotation detail surface and accessible annotation list using existing shadcn primitives where possible.
6. Update `docs/APIMAPPING.md` to state that annotation rendering is implemented behind the annotation layer control.
7. Verify successful candles with annotations enabled, candles with no annotations, disabled annotation layer behavior, invalid annotation times, and responsive detail behavior.

## Open Questions

- No blocking open questions.
- Implementation should confirm the active chart engine coordinate/overlay API before choosing the final marker click handler.
- If the installed shadcn set lacks an ideal mobile detail primitive, use the existing `Sheet` if available or keep details below the chart rather than adding a broad UI dependency.
