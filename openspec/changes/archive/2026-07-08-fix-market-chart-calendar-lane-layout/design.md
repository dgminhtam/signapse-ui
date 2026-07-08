## Context

Market Charts renders KLineCharts in `MarketChartCanvas` and adds React-owned overlays for annotation markers, warm bands, hover guides, and the economic calendar lane. The volume pane is a native KLineCharts indicator pane, but the calendar lane uses HTML/React so it can keep existing popovers and keyboard behavior.

## Goals / Non-Goals

**Goals:**
- Prevent the calendar lane from covering the KLineCharts canvas area, including the volume pane.
- Keep calendar markers horizontally aligned to the chart time axis.
- Put grouped calendar event counts inside the marker node.
- Keep the fix scoped to the existing chart canvas integration.

**Non-Goals:**
- Do not replace the calendar lane with a custom KLineCharts indicator pane.
- Do not change calendar API loading, range selection, quick list fields, or detail navigation.
- Do not add new dependencies or chart engine abstractions.

## Decisions

- Reserve vertical space in the React wrapper for the calendar lane and let KLineCharts resize through the existing `ResizeObserver`.
  - Alternative considered: implement a custom KLineCharts indicator pane. This would align with chart pane layout but requires canvas drawing, hit testing, and a popover bridge for behavior that already works in React.
- Keep the marker lane in the same horizontal coordinate system as the chart container.
  - Calendar marker `left` values already come from `chart.convertToPixel(...)`, so the lane root must share the chart container's x-origin.
- Reuse the existing annotation grouped-marker pattern for counts inside calendar nodes.
  - This avoids a second marker-count design and removes the floating badge that currently creates clutter.

## Risks / Trade-offs

- Chart vertical space is slightly reduced when calendar events are visible -> reserve only a compact lane height and keep the lane hidden when disabled or empty.
- React lane is not part of KLineCharts native export/canvas rendering -> acceptable because existing calendar quick list and popovers are React-owned.
- Horizontal alignment can drift if the lane receives extra left/right inset -> keep the positioning layer full-width and apply any visual inset only to the lane background.
