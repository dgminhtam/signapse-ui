## Why

The annotation API now returns `outcome.summary`, but the market chart popup does not expose it. Users can see predicted and actual reaction metrics, yet miss the backend-generated explanation of what happened during the evaluation window.

## What Changes

- Add frontend contract support for `MarketChartAnnotationOutcomeResponse.summary`.
- Show non-empty outcome summary text inside the existing reaction section, below the current prediction, actual direction, price change, and time range rows.
- Keep the popup compact: no new section, badge, icon, or label unless a later design change needs one.
- Continue omitting the reaction section when all reaction display fields, including outcome summary, are empty.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-annotation-popup-surface`: annotation popup reaction sections can display the backend-provided outcome summary.

## Impact

- Affects market chart annotation TypeScript response definitions and popup rendering in `market-chart-workbench.tsx`.
- No backend, route, marker grouping, chart drawing, or dependency changes.
