## Why

The economic calendar lane currently overlays the chart area, which can cover the volume pane and make chart reading harder. Group counts also render as separate badges outside the marker node, creating visual clutter in dense event areas.

## What Changes

- Move the economic calendar lane into reserved space below the KLineCharts canvas area so it no longer covers candles, indicators, or the volume pane.
- Keep calendar marker positions aligned to the chart x-axis while the lane sits below the chart.
- Render grouped calendar event counts inside the marker node instead of as a separate floating badge.
- Keep the existing calendar API loading, quick list, detail navigation, and layer toggle behavior unchanged.

## Capabilities

### New Capabilities

### Modified Capabilities
- `market-chart-economic-calendar-events`: Refine calendar lane layout and grouped marker count presentation.

## Impact

- Affected UI: Market Charts economic calendar lane and marker rendering.
- Affected code: `app/[lang]/(main)/market-charts/market-chart-canvas.tsx`.
- APIs, permissions, and dependencies remain unchanged.
