## Why

Market chart currently renders a volume pane even when the selected asset has no usable volume data, which can make missing provider data look like zero volume. The drawing tool rail also has a few visual rough edges: drawing strokes feel heavy, chart-owned text is not fully aligned with the Signapse font, and the collapse button adds complexity without clear value now that the rail is already a dedicated chart region.

## What Changes

- Make market chart volume rendering data-aware: render the volume pane only when historical or live candles include usable numeric volume.
- Treat missing volume as unavailable data, not as zero-filled data.
- Keep OHLC candles, lazy history loading, live partial candle merging, annotations, indicators, screenshot, fullscreen, and route state behavior intact.
- Lighten drawing overlay strokes and selected-point treatment so drawn shapes do not dominate the candle view.
- Extend KLineChart style configuration so chart text owned by KLineChart uses the Signapse app font consistently across visible chart labels, markers, tooltips, axes, and drawing text.
- Remove the drawing toolbar collapse affordance and related state so the left tool rail starts directly with drawing tools.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-klinechart-engine`: Chart rendering becomes volume-aware, and KLineChart adapter-owned drawing/font styling is refined for a cleaner Signapse-aligned canvas.

## Impact

- Affects market chart files under `app/[lang]/(main)/market-charts/`, especially `market-chart-canvas.tsx`, `market-chart-drawing.ts`, `market-chart-drawing-toolbar.tsx`, and the workbench drawing state wiring.
- No backend API, auth, dependency, vendor, route, or global shadcn token changes.
- Verification should include OpenSpec validation, typecheck, lint, static search for removed collapse state and volume-pane conditions, and deterministic review of volume/no-volume chart layout paths.
