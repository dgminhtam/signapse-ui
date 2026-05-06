## Why

The first annotation layer makes backend events visible on the market chart, but the current marker treatment is too subtle and the right-side detail panel pulls attention away from the chart location that triggered the event. Users need annotation points to feel like noticeable chart notifications and need event details to open close to the marker they selected.

This refinement keeps the chart data-first while making annotations easier to notice, inspect, and understand without implying buy/sell recommendations.

## What Changes

- Replace direction-shaped annotation markers with a notification-style red event dot.
- Add a subtle pulse/ripple treatment to active or important annotation dots so they stand out against candles and grid lines.
- Use grouped notification dots with compact count text when multiple annotations share the same chart time.
- Move annotation detail inspection from the persistent right-side panel to a popup opened by clicking an annotation marker.
- Use a responsive fallback detail surface on narrow screens, such as a sheet or below-chart popup, so detail reading remains usable on mobile.
- Keep `direction`, `severity`, `confidence`, `reaction`, `evidence`, and event detail link inside the popup instead of encoding direction as chart marker shape.
- Preserve an accessible non-canvas way to inspect annotations, because chart marker click alone is not enough for keyboard and assistive technology users.
- Respect reduced-motion preferences by replacing pulse animation with a static ring when motion should be minimized.
- Keep the annotation layer optional and continue using the existing backend `annotations[]` contract.

## Capabilities

### New Capabilities

- `market-chart-annotation-popup-interaction`: Provides prominent notification-style chart annotation markers and marker-triggered event detail popups.

### Modified Capabilities

- None.

## Impact

- Affected frontend areas: `app/(main)/market-charts/market-chart-annotations.ts`, `app/(main)/market-charts/market-chart-canvas.tsx`, `app/(main)/market-charts/market-chart-workbench.tsx`, and related annotation UI documentation.
- Uses existing backend `GET /market-charts/candles` response fields; no backend changes are required.
- Uses the active chart engine coordinate/overlay support and current shadcn primitives where suitable.
- May add a small local chart overlay component, but should not add broad dependencies or edit `components/ui`.
- Does not add trading recommendations, technical indicators, drawing tools, or a separate annotation endpoint.
