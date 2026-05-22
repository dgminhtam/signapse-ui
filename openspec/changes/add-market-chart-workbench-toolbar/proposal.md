## Why

The market chart controls are still shaped like a generic list toolbar, while the product direction is moving toward a chart workbench with fast chart-native commands. Consolidating asset selection, timeframe switching, annotation visibility, indicators, screenshot, and fullscreen into a chart top toolbar gives users a more TradingView-like workflow without adopting a vendor UI shell.

## What Changes

- Replace the current list-style market chart control layout with a chart workbench top toolbar that belongs to the chart surface.
- Keep asset selection watchlist-only and visible as the primary leading control.
- Replace the timeframe select with a shadcn `ToggleGroup` style control for quick timeframe switching.
- Present annotation visibility as a toolbar command/toggle instead of a form-like switch treatment.
- Add an indicator command that opens a Signapse-owned UI surface for applying supported KLineChart indicators.
- Add a screenshot command that captures the current chart image through the KLineChart adapter boundary.
- Add a fullscreen command that expands the chart workbench surface while keeping toolbar controls available.
- Preserve responsive behavior, accessible labels, Vietnamese UI copy, status rail placement, and existing route state.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-control-toolbar`: Update the market chart controls from a generic list toolbar into a chart workbench toolbar with asset selection, timeframe toggles, annotation toggle, indicator, screenshot, and fullscreen commands.

## Impact

- Affected UI: `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`, market chart skeletons, and localized market chart dictionary copy.
- Affected chart adapter: `app/[lang]/(main)/market-charts/market-chart-canvas.tsx` may need a narrow imperative handle for indicator and screenshot commands without leaking raw KLineChart instances.
- No backend API changes are expected.
- No dependency change is expected; use existing KLineCharts and shadcn wrappers already in the repo.
