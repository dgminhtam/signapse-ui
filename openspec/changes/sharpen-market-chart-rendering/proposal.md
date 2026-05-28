## Why

The market chart currently feels softer than TradingView even after the KLineChart migration, especially around candle edges, grid lines, and user-created drawing objects. This makes the chart feel less precise for a trading workstation, and the current neutral drawing palette can read as low-emphasis gray instead of an intentional tool layer.

## What Changes

- Sharpen market chart rendering by reviewing the canvas/container pixel path and adjusting chart-local grid styling so visual guides stay low-noise without looking blurred.
- Change drawing overlay colors from neutral gray/white to a chart-tool blue palette that is visually distinct from candle red/green and annotation sentiment colors.
- Restore drawing overlay stroke widths to crisp chart-friendly values while keeping the style scoped to the KLineChart adapter.
- Keep the existing KLineChart engine, data APIs, SSE behavior, toolbar behavior, annotation behavior, screenshot/fullscreen behavior, and global shadcn theme tokens unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-grid-readability`: grid lines remain dashed and low-noise, but should render with crisp canvas-friendly sizing rather than subpixel softness.
- `market-chart-display-polish`: market chart drawing objects should use a dedicated tool palette and crisp stroke treatment that feels intentional on both light and dark themes.

## Impact

- Affected code: `app/[lang]/(main)/market-charts/market-chart-canvas.tsx`.
- No backend API changes.
- No dependency changes.
- No route, locale, toolbar, annotation, lazy-history, screenshot, fullscreen, or global theme token changes.
