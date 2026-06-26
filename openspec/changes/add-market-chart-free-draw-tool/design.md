## Context

Market chart drawing tools already flow through `MarketChartDrawingTool`, palette mappings, `createMarketChartDrawingOverlay`, and KLineCharts overlays. Several Signapse-owned overlays already render multi-point line figures through the existing custom overlay template path.

The requested tool is a free multi-segment path, not continuous pointer-drag brush drawing.

## Goals / Non-Goals

**Goals:**

- Add a `free-draw` tool to the existing line palette.
- Let users place multiple connected segments and finish the drawing with double-click.
- Preserve existing drawing lifecycle behavior: active tool cleanup, selected overlay style toolbar, lock, magnet, visibility, delete, clear-all, and chart-context caching.
- Keep labels localized in English and Vietnamese.

**Non-Goals:**

- No continuous brush engine, smoothing, pressure, eraser, or custom canvas layer.
- No backend persistence or API changes.
- No new drawing palette or toolbar layout changes.

## Decisions

- Use a Signapse-owned KLineCharts overlay template for `free-draw`.
  - Rationale: the current code already registers custom overlay templates and applies Signapse metadata/styles through the same path.
  - Alternative considered: add a separate canvas pointer layer. Rejected because it duplicates chart coordinate conversion, selection, styling, and lifecycle code.

- Model free draw as a polyline with point-by-point placement and double-click completion.
  - Rationale: KLineCharts overlay drawing supports step-based point placement and force-completes on double-click, which fits a multi-segment free path with minimal code.
  - Alternative considered: true drag-to-draw brush behavior. Rejected for this change because it requires deeper event handling and has higher interaction risk.

- Add the tool to the existing line palette.
  - Rationale: the output is line-like, uses the same stroke style, and belongs beside trend line, ray, segment, and arrow tools.
  - Alternative considered: create a new sketch palette. Rejected because one new tool does not justify another toolbar group.

## Risks / Trade-offs

- Users may expect drag-to-draw brush behavior from the name "Free draw" -> Mitigation: keep implementation and copy scoped to a multi-segment drawing tool; revisit naming only if user testing shows confusion.
- A very high point limit could be awkward or expensive -> Mitigation: use a fixed practical maximum and rely on double-click completion for normal use.
- Double-click completion may be missed by keyboard-only users -> Mitigation: preserve existing toolbar keyboard access and do not regress cancel/delete flows; deeper keyboard point placement is outside the current chart engine behavior.
