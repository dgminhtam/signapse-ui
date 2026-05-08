## Why

The market chart control area currently looks like a form card rather than a compact workspace toolbar, so asset selection, timeframe, annotation filter, refresh, and freshness feedback do not feel visually aligned with the rest of Signapse list/control surfaces. Moving freshness into the chart legend also makes the chart itself carry the current-data context instead of leaving a detached timestamp beside the filters.

## What Changes

- Remove the bordered/card-like wrapper around the `/market-charts` top control group.
- Recompose market chart controls as a compact toolbar aligned with the existing list toolbar rhythm: primary asset selection on the leading side, timeframe/event toggle/refresh on the trailing side.
- Keep controls at default shadcn primitive height and avoid custom card chrome around the toolbar.
- Move latest update text out of the toolbar and into the chart area as chart context.
- Render a concise chart context label in the chart surface, formatted like `XAU/USD - 1 giờ - Cập nhật 10:17 07/05/2026`.
- Prefer a React-owned chart overlay/legend for this context label rather than coupling product copy to KLineChart internal tooltip/header behavior.
- Preserve existing chart request behavior, URL state, annotation toggle behavior, refresh behavior, and responsive/mobile usability.

## Capabilities

### New Capabilities

- `market-chart-control-toolbar`: Covers the market chart toolbar layout, chart-context freshness label, and responsive control hierarchy.

### Modified Capabilities

- None.

## Impact

- Affected frontend area: `app/(main)/market-charts/market-chart-workbench.tsx`.
- Potentially affected chart-local component: `app/(main)/market-charts/market-chart-canvas.tsx` if the chart context label is best colocated with the KLineChart canvas wrapper.
- No backend API, DTO, dependency, permission, or route changes are expected.
- Verification should include toolbar visual alignment, responsive behavior, freshness label placement, targeted market chart lint, typecheck, build, and OpenSpec validation.
