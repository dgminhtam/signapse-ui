## Why

Drawing tools are becoming part of the market chart workstation, but users currently cannot adjust a drawing after placing it except deleting it from the side rail. A lightweight selected-drawing toolbar gives users the practical TradingView-like controls they need without expanding into a full drawing settings system.

## What Changes

- Show a compact chart-local toolbar when a Signapse drawing overlay is selected.
- Let users change the selected drawing color from a small preset palette.
- Let users change the selected drawing stroke size with limited options: `1px`, `2px`, and `3px`.
- Keep the existing selected drawing delete action available from the selected-drawing toolbar.
- Store drawing style in overlay metadata so color/size survive chart theme sync, overlay cache/restore, and future persistence integration.
- Keep the feature intentionally small: no opacity control, line style selector, text editing, backend persistence, or advanced per-tool configuration in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-drawing-toolbar`: add selected-drawing style controls and selected delete behavior near the active drawing.
- `market-chart-drawing-tool-palettes`: ensure drawings created from every palette carry stable style metadata and can be restyled after selection.

## Impact

- Affected UI: market chart canvas/workbench drawing selection layer and drawing toolbar controls.
- Affected implementation: drawing overlay style helpers, drawing overlay metadata, canvas handle methods, and localized drawing labels.
- Expected shadcn usage: compose the selected-drawing toolbar from project `Button`, `ToggleGroup`, and related wrappers; no raw Radix primitive imports.
- No backend API, route, auth, chart dependency, or persistence storage changes are expected.
- Coordination note: active drawing changes such as `persist-drawings-across-timeframes` and `add-drawing-shape-fills` may also touch overlay metadata/styles; implementation should preserve their metadata instead of overwriting `extendData`.
