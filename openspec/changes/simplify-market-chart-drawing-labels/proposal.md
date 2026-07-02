## Why

Market chart drawing overlays currently add too much selected-overlay text on top of an already dense candlestick workspace. Fibonacci labels, selected anchor dates, and selected anchor prices compete with the chart axis, crosshair, candles, volume pane, and annotation markers.

## What Changes

- Remove detailed price values from Fibonacci line labels while keeping all Fibonacci percentage labels visible.
- Keep Fibonacci segment and Fibonacci extension percentage labels visible for every configured level.
- Hide selected drawing anchor date labels and selection range fills on the X axis.
- Hide selected drawing anchor price labels and selection range fills on the Y axis except for tools whose purpose is explicit price-level inspection.
- Make drawing overlay text use a readable chart text color instead of inheriting the drawing stroke color.
- Keep existing drawing tool palettes, drawing persistence, selected style metadata, and backend contracts unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-drawing-tool-palettes`: Drawing overlays should reduce selected-overlay label clutter while preserving useful Fibonacci percentage, price-line, and pattern labels.

## Impact

- Affected code: market chart drawing overlay templates, drawing tool to KLineChart overlay mapping, and chart drawing overlay style helper.
- Affected UX: drawing labels become less cluttered and more legible; Fibonacci keeps all percentage levels but no longer shows detailed price values in labels.
- No API, dependency, routing, dictionary, or persistence contract changes are expected.
