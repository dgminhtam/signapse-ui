## Context

Recent market chart refinements moved the top controls toward a list-toolbar pattern and placed freshness context inside the chart. The remaining surface issues are mostly visual-system alignment: the chart still has a right summary rail, custom radius values, a toolbar-to-chart gap controlled by parent layout instead of the chart surface, a switch wrapper that does not match default control dimensions, and KLineChart text that uses its own default font.

The repo already has an app-level table surface contract through `AppListTable`: `mt-4 overflow-hidden rounded-xl border border-border bg-card`. The chart is not a table, but it should follow the same outer rhythm where the user sees a primary data surface after toolbar controls.

## Goals / Non-Goals

**Goals:**

- Let the chart use the full available workspace width by removing the right summary rail.
- Match list page toolbar-to-surface spacing by making the chart surface own `mt-4`.
- Match list table radius and border treatment with `rounded-xl`, `border-border`, and `bg-card`.
- Keep chart canvas clipping controlled without reintroducing popup clipping.
- Align the event switch wrapper with default shadcn control height, radius, border, and shadow treatment.
- Make KLineChart text use the app sans font stack.

**Non-Goals:**

- Do not change backend candle APIs, request windows, DTO schemas, permissions, or route state.
- Do not reintroduce a summary rail in another location during this change.
- Do not add new metrics, chart indicators, overlays, lazy loading, or manual date controls.
- Do not modify shadcn primitives or global theme tokens.
- Do not redesign annotation marker/popup behavior beyond preserving it under the new surface shape.

## Decisions

### Remove the right summary rail entirely

The current right rail repeats data already discoverable from the chart and consumes horizontal space from the main task. This change should remove the `MarketChartSummaryPanel` rendering path rather than moving the same card elsewhere.

Rationale: the user specifically wants to optimize chart view. If summary metrics are needed later, they should return as compact chart-level affordances, not as a permanent rail that competes with the chart.

Alternative considered: collapse the rail under the chart. Rejected because it keeps a non-essential card on the page and does not improve initial chart focus enough.

### Treat chart surface like the list table surface

The chart surface should use the same outer visual primitives as `AppListTable`: top margin from controls, rounded-xl radius, border, and card background. The existing custom `rounded-[28px]` and `rounded-t-[28px]` values should be removed.

Rationale: this reduces one-off UI styling and makes dense data surfaces feel consistent across list and chart screens.

Alternative considered: define a new shared chart/table surface component now. Rejected because only the market chart needs this exact refinement today; local composition is enough.

### Keep popup layer outside clipped canvas content

The chart canvas may still need clipping to respect rounded corners, but annotation popups must remain outside the clipped canvas region. The implementation should preserve the previous two-layer approach: clipped chart visual region plus un-clipped popup layer in the chart surface stacking context.

Rationale: radius normalization must not regress annotation popup readability near chart edges.

### Normalize the event switch wrapper as a control

The `Sự kiện` switch wrapper should match default control height and radius. Use local classes that align with primitives, such as `h-9`, `rounded-lg`, `border-input`, `bg-transparent`, and `shadow-xs`, without changing `Switch` or other shadcn files.

Rationale: the switch is part of the toolbar control group, so it should sit at the same visual rhythm as `SelectTrigger` and `Button`.

### Apply app font stack inside KLineChart styles

KLineChart draws text on canvas and does not automatically inherit DOM font classes. The chart adapter should resolve the app font from CSS variables or a local fallback and apply it to supported KLineChart text style entries such as axis ticks, crosshair labels, and tooltip/legend text.

Rationale: canvas-rendered labels should still look native to Signapse. This stays local to the chart adapter and avoids global theme changes.

## Risks / Trade-offs

- [Losing quick summary metrics] -> Accept for this change; the chart view is the primary task and metrics can return later as compact overlays if product value is clear.
- [Popup clipping regression] -> Keep popup layer outside the clipped visual wrapper and verify selected marker popups still render above the surface.
- [KLineChart text style API may not cover every label] -> Apply font family to the supported style keys and document any remaining library-rendered text that cannot be styled.
- [Toolbar-to-chart spacing becomes duplicated] -> Ensure parent layout does not also add a separate large gap; the chart surface should own the `mt-4` rhythm.
