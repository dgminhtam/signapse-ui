## Why

The market chart toolbar is close to the intended workbench treatment, but the timeframe controls can still appear clipped at the edge and the command buttons are visually larger than the dense chart toolbar needs. This refinement tightens the toolbar polish without changing chart data behavior or adding new commands.

## What Changes

- Prevent the timeframe toggle group from visually losing rounded corners inside its horizontal overflow container.
- Use the smallest practical shadcn-supported toolbar control size consistently across timeframe toggles, annotation toggle, indicator, screenshot, and fullscreen commands.
- Add an inline icon to the annotation event toggle so it visually aligns with the other icon-led toolbar commands.
- Keep the existing watchlist-only asset selector, route state, annotation behavior, indicator command, screenshot command, fullscreen command, and bottom status rail unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-control-toolbar`: Refine the market chart toolbar control density, event toggle icon treatment, and clipped-radius handling for the timeframe toggle group.

## Impact

- Affected UI: `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`.
- Affected skeletons: market chart skeletons should stay visually aligned with the compact toolbar if placeholder dimensions need adjustment.
- No backend API, chart engine, routing, dependency, or localization contract changes are expected.
