## Why

Market chart already supports watchlist assets, timeframe controls, indicators, screenshots, fullscreen, lazy history, and annotation markers, but users still need to leave Signapse for basic chart drawing workflows. Adding a lightweight drawing toolbar keeps analysis inside the chart workspace while reusing KLineCharts' native overlay system instead of rebuilding drawing behavior with DOM elements.

## What Changes

- Add a compact left-side drawing toolbar inside the market chart surface for common drawing actions.
- Support an initial drawing tool set backed by KLineCharts overlays: horizontal line, trend/segment line, channel/parallel line, fibonacci line, circle, and rectangle/area.
- Add drawing state controls for magnet/snap mode, lock/unlock drawings, show/hide drawings, delete selected drawing, and clear drawings.
- Keep the toolbar built from shadcn UI primitives and Signapse-owned icons/copy, not KLineChart Pro chrome.
- Keep drawing overlays separate from backend annotation markers; annotations remain event markers, drawings remain user-created chart overlays.
- Do not add drawing persistence or backend APIs in this change; structure the drawing group/id model so persistence can be added later.

## Capabilities

### New Capabilities
- `market-chart-drawing-toolbar`: Enables users to create and manage basic chart drawing overlays from a compact chart-local toolbar.

### Modified Capabilities
- None.

## Impact

- Affects the market chart workbench and canvas adapter under `app/[lang]/(main)/market-charts/`.
- Reuses installed `klinecharts` overlay APIs and custom overlay registration when a shape is not built in; no chart engine migration and no new chart dependency.
- Reuses existing shadcn UI wrappers from `@/components/ui/`; no direct primitive imports from feature code.
- Requires localized Vietnamese UI copy for drawing tools and accessible labels.
- Requires care around annotation marker pointer events so active drawing mode does not conflict with event marker selection.
