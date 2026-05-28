## 1. Theme Palette Boundary

- [x] 1.1 Add a chart-local theme mode resolver that maps `resolvedTheme === "dark"` to `dark` and all other states to `light`.
- [x] 1.2 Add a deterministic chart palette helper for light and dark modes covering candles, grid, axes, tooltip, crosshair, volume, and drawing overlays.
- [x] 1.3 Remove theme-sensitive color reads and OKLCH canvas conversion from core KLineCharts style creation.

## 2. KLineCharts Style Application

- [x] 2.1 Update `createChartStyles()` to accept the chart theme palette and return deterministic KLineCharts styles for the active theme.
- [x] 2.2 Update drawing overlay style creation to use the same chart theme palette instead of reading theme-sensitive CSS vars.
- [x] 2.3 Ensure theme changes continue to update the active chart style path without changing candle data, live SSE state, annotations, lazy history, drawing commands, toolbar controls, or URL state.

## 3. Runtime Safety Review

- [x] 3.1 Review the final theme path to confirm light → dark → light resolves to the same light palette values.
- [x] 3.2 Confirm KLineCharts palette helpers remain inside the market chart adapter boundary and do not change global shadcn theme tokens or app-wide `next-themes` behavior.
- [x] 3.3 Confirm any remaining CSS variable reads in the chart adapter are non-theme-color reads or intentionally safe.

## 4. Verification

- [x] 4.1 Run `openspec validate stabilize-market-chart-theme-palette --strict`.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `pnpm lint`.
- [x] 4.4 Run static search for `getCssVariable`, `resolveColor`, `colorCache`, `createChartStyles`, and `createDrawingOverlayStyles` to confirm the core palette path is deterministic and scoped.
- [x] 4.5 Deterministically review the final diff against the original theme-drift path and confirm chart core colors no longer depend on timing-sensitive DOM color reads.

User-owned manual QA note: after implementation, open `/vi/market-charts`, switch light → dark → light, and confirm candle/grid/axis/crosshair colors return to the same light palette without drift.
