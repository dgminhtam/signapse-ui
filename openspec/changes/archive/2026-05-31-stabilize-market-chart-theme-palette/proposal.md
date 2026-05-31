## Why

Market chart colors can drift when users switch between light and dark mode because the KLineCharts adapter snapshots CSS variables during chart initialization. If chart initialization runs before the `next-themes` class change has fully settled, KLineCharts receives the wrong theme palette and keeps that stale canvas style until the next rebuild.

## What Changes

- Make market chart KLineCharts styling deterministic from the resolved theme mode instead of relying on timing-sensitive DOM CSS variable reads for core chart colors.
- Ensure candle, grid, axis, tooltip, crosshair, volume, and drawing overlay colors update consistently when switching light → dark → light.
- Keep KLineCharts-specific palette logic inside the market chart canvas adapter boundary.
- Preserve existing candle data, live SSE, annotation markers, lazy history, drawing tools, toolbar controls, and route-state behavior.
- Avoid changing global shadcn theme tokens or app-wide `next-themes` behavior to solve a chart-local rendering issue.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-klinechart-engine`: KLineCharts adapter styling must be deterministic per theme and must not snapshot stale CSS variables when the app switches theme.

## Impact

- Affects market chart files under `app/[lang]/(main)/market-charts/`, especially KLineCharts style creation and theme-change handling in the canvas adapter.
- No backend API, auth, data contract, dependency, route, or global theme token changes.
- Verification should include OpenSpec validation, typecheck, lint, static search/diff review, and a deterministic review of the light/dark/light palette path.
