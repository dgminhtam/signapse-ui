## Why

The market chart indicator set does not yet provide volatility analysis through ATR or directional trend analysis through DMI. Adding both completes the next agreed indicator scope while reusing KLineCharts' built-in DMI support and keeping Ichimoku deferred.

## What Changes

- Add ATR and DMI to the curated market chart indicator controls with locale-neutral technical labels.
- Register a custom Wilder ATR indicator with a fixed default period of 14 and render it in a deterministic secondary pane.
- Enable the KLineCharts 10 built-in DMI indicator under the unchanged `DMI` name, including its PDI, MDI, ADX, and ADXR figures.
- Preserve the mounted chart instance and prevent duplicate panes when either indicator is toggled repeatedly.
- Keep Ichimoku, indicator parameter editing, and persisted indicator selection out of scope.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-control-toolbar`: Extend the curated indicator control surface and accessible labels with ATR and DMI.
- `market-chart-klinechart-engine`: Define ATR calculation/rendering and DMI secondary-pane behavior on the stable KLineCharts 10 adapter.

## Impact

- Affected code is limited to the market chart canvas/workbench adapter, market chart indicator labels, and one small ATR calculation/registration module.
- No backend API, candle DTO, database, route, or dependency changes are required.
- Existing indicators, Volume availability rules, live updates, lazy history, and chart instance lifecycle remain unchanged.
