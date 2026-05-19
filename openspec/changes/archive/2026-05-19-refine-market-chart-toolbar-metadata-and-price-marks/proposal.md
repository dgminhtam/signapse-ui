## Why

The market chart should keep the plot area free for candles, crosshair, and event markers. The current in-chart symbol/timeframe/update pill repeats existing controls and can cover chart content, while KLineChart's default price mark typography and high/low labels do not fully match the Signapse interface.

## What Changes

- Remove the in-chart `symbol - timeframe - updated time` pill from the plot area.
- Move only the useful freshness metadata to the trailing toolbar, near the refresh action, using subtle text rather than a badge or bordered pill.
- Do not repeat symbol or timeframe in the new metadata text because those values already exist in the asset selector and timeframe control.
- Keep the chart surface cardless and data-first; do not add a chart header row, extra Card shell, or descriptive copy.
- Override `candle.priceMark.last.text` so the last price marker uses the same font family as the rest of the system.
- Hide KLineChart high and low price marks by setting `candle.priceMark.high.show=false` and `candle.priceMark.low.show=false`.
- Keep the last price marker visible.
- Do not add toolbar redesign, indicators, drawing tools, grid changes, or new chart controls in this change.

## Capabilities

### New Capabilities

- `market-chart-display-polish`: Covers small display refinements for market chart metadata placement and KLineChart price mark styling.

### Modified Capabilities

- None.

## Impact

- Affected frontend files: `app/(main)/market-charts/market-chart-workbench.tsx` and `app/(main)/market-charts/market-chart-canvas.tsx`.
- No backend API, route state, dependency, permission, global theme token, or shadcn primitive changes are required.
- Verification should include targeted market chart lint, typecheck, build, and visual smoke when an authenticated chart session is available.
