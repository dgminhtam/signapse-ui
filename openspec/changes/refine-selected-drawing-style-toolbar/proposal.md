## Why

The selected drawing style toolbar is functional, but its inline color and size controls will become too wide once the preset palette grows. A compact popover-based treatment keeps the chart surface focused while giving users more practical color and stroke-width choices.

## What Changes

- Replace inline selected-drawing color choices with a compact swatch trigger that opens a small preset color popover.
- Expand drawing color presets from the current limited set to a broader fixed palette while still avoiding a free-form color picker.
- Replace inline selected-drawing stroke size toggles with a compact size trigger that opens a small size popover.
- Expand drawing stroke sizes from `1px`, `2px`, and `3px` to `1px` through `5px`.
- Represent stroke sizes visually with line previews instead of showing `1px` text as the primary visual.
- Use ghost button treatment for selected-drawing style toolbar controls because the toolbar/popover surfaces already provide the visual boundary.
- Keep selected delete as a compact ghost icon action and keep clear-all only in the existing confirmed destructive action.
- Preserve the existing drawing style metadata shape and chart update path; this change does not introduce custom HEX/HSL/RGB color input.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-drawing-toolbar`: refine selected-drawing style controls into compact popover controls with ghost button treatment and visual style previews.
- `market-chart-drawing-tool-palettes`: extend drawing style preset values while preserving style metadata and cross-tool restyling behavior.

## Impact

- Affected UI: selected drawing floating toolbar in the market chart workbench.
- Affected implementation: drawing style preset constants, selected drawing toolbar composition, localized drawing labels, and style preview rendering.
- Expected shadcn usage: compose with existing project `Popover`, `Button`, and `Separator` wrappers; do not import raw Radix primitives.
- No backend API, chart engine, route, auth, persistence storage, or color-picker dependency changes are expected.
