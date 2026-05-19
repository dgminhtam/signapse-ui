## Why

The market chart still carries a little visual noise: solid grid lines compete with candle data, while the update timestamp lives in the toolbar instead of the chart surface it describes. The status rail is becoming the natural home for chart context, so it should be stable, always present, and reflected by the loading skeleton.

## What Changes

- Change KLineChart horizontal and vertical grid lines from solid to dashed to reduce visual density.
- Move the `Cập nhật HH:mm dd/MM/yyyy` label out of the toolbar and into the bottom chart status rail.
- Render the bottom chart status rail consistently even when the event switch is off.
- When the event switch is off, hide event milestone text while keeping the rail and update timestamp visible.
- When the event switch is on, keep the current event status behavior: loading label, non-empty count, or empty message.
- Update market chart skeletons so the status rail placement mirrors the final chart surface.
- Remove the toolbar skeleton placeholder for update time because that metadata no longer belongs in the toolbar.
- Do not change backend APIs, chart data loading, lazy history loading, annotation marker rendering, popup behavior, or global theme tokens.

## Capabilities

### New Capabilities

- `market-chart-grid-readability`: Covers low-noise dashed grid styling for the KLineChart canvas.
- `market-chart-status-rail`: Covers the always-present bottom status rail, update timestamp placement, event-status visibility rules, and matching skeleton behavior.

### Modified Capabilities

- None.

## Impact

- Affected frontend files:
  - `app/(main)/market-charts/market-chart-canvas.tsx`
  - `app/(main)/market-charts/market-chart-workbench.tsx`
  - `app/(main)/market-charts/market-chart-skeleton.tsx`
  - `app/(main)/market-charts/page.tsx`
- No backend API, dependency, chart engine, route param, annotation data, or global theme changes are expected.
- Verification should include targeted market chart lint, typecheck, build, OpenSpec validation, and visual smoke when an authenticated chart session is available.
