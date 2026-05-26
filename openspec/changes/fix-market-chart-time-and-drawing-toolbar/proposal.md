## Why

Market chart is currently fragile when candle or annotation collections contain an invalid item, because chart helpers read `.time` before guarding the item. The drawing toolbar also sits as an absolute overlay on top of the chart, which can cover candles and make drawing tool clicks feel unreliable.

## What Changes

- Harden market chart candle and annotation normalization so malformed, null, or transiently undefined items cannot crash the chart when `.time` is read.
- Keep lazy historical candle and annotation merges non-crashing, de-duplicated, and chronological even when a response or local merge contains invalid entries.
- Move the drawing toolbar from an absolute overlay inside the chart plot to a dedicated chart-local side rail that pushes the chart viewport to the right.
- Preserve drawing commands, annotation marker behavior, screenshot support, fullscreen behavior, and chart sizing after the toolbar layout changes.
- Keep the toolbar composed from existing shadcn UI wrappers and avoid introducing `@klinecharts/pro` or a new chart dependency.

## Capabilities

### New Capabilities

- `market-chart-drawing-toolbar-rail`: Defines the dedicated side-rail placement, sizing, accessibility, and interaction behavior for chart drawing controls.

### Modified Capabilities

- `market-chart-klinechart-engine`: The chart adapter must sanitize candle data before timestamp conversion and must not crash when invalid candle items are present.
- `market-chart-lazy-history-loading`: Lazy history merge must ignore invalid candle or annotation items without resetting or breaking the active chart.
- `market-chart-annotation-markers`: Annotation grouping and marker placement must ignore malformed annotation entries before reading annotation `time`.

## Impact

- Affects market chart files under `app/[lang]/(main)/market-charts/`, especially the canvas adapter, annotation helpers, drawing toolbar, and workbench layout.
- No backend API, dependency, auth, or route changes.
- Requires focused verification with OpenSpec validation, typecheck, lint, and static review around `.time` reads and drawing toolbar placement.
