## Context

The current selected drawing style toolbar shows color choices and stroke sizes inline. That works for a very small palette, but the agreed direction expands color and size choices, so keeping all controls inline would make the floating toolbar visually heavy and more likely to cover chart content.

The existing style model already stores preset color and numeric size metadata and applies updates through `chart.overrideOverlay`. This change should refine the UI and preset list without changing that metadata shape or adding a custom color picker dependency.

## Goals / Non-Goals

**Goals:**

- Keep the selected drawing toolbar compact with one trigger for color, one trigger for size, and one delete action.
- Move color selection into a small popover grid of fixed preset swatches.
- Move size selection into a small popover list/grid that previews stroke width with line samples.
- Expand color presets and stroke size presets while preserving the existing `{ color, size }` drawing style shape.
- Use ghost button treatment inside the selected drawing toolbar because the toolbar and popovers already provide the boundary.
- Keep controls accessible with localized labels and selected-state communication.

**Non-Goals:**

- Do not add a free-form color picker, HEX input, HSL/RGB controls, opacity control, or alpha support.
- Do not add `react-colorful` or any other color-picker dependency.
- Do not change chart engine integration, backend APIs, routes, or drawing persistence storage.
- Do not redesign the left drawing rail or drawing tool palette menus.
- Do not introduce a new `ToggleGroup` size just for this change unless implementation reveals it is still needed.

## Decisions

### Use compact popovers for both color and size

The selected drawing toolbar should render as:

```text
[ color swatch trigger ] [ size line trigger ] [ delete ]
```

Color and size choices open from their own shadcn `Popover` controls. This avoids a wide floating toolbar and keeps the chart surface available for reading and drawing.

Alternative considered: keep colors and sizes inline with smaller ToggleGroup controls. This would require adding `xs` to `ToggleGroup` and still becomes crowded once the color palette grows.

### Keep preset-only style values

The color control remains a fixed preset palette, and size remains a fixed numeric preset list. The existing style metadata shape remains `{ color, size }`, with color and size unions derived from preset constants.

Alternative considered: store custom HEX colors. That would expand validation, i18n, active-state handling, and future persistence concerns without current product need.

### Represent size visually with line previews

The size trigger and size popover options should primarily show a horizontal line preview at the selected stroke width. Text such as `1px` through `5px` remains available through localized accessible labels, not as the main visual.

Alternative considered: keep text labels. Text is less chart-native and visually heavier for a compact drawing toolbar.

### Use ghost treatment for selected-style controls

Selected drawing style controls should use ghost button treatment because the floating toolbar surface and popover surfaces already have border/background chrome. The selected state should be communicated through the active swatch/line preview treatment and accessible pressed/selected state rather than outline borders on every control.

Alternative considered: keep `variant="outline"` for every color/size control. That duplicates borders inside an already bordered surface and makes the compact toolbar visually noisy.

## Risks / Trade-offs

- Larger color palette may make active state harder to see → keep the selected swatch visibly distinct and expose localized accessible labels.
- Popover controls add one click compared with inline options → toolbar stays smaller and less likely to cover chart content.
- Line previews require small visual markup inside controls → keep custom styling limited to the preview content, not shadcn primitive chrome.
- Existing active drawing style metadata may contain old preset values only → normalizer continues to accept existing values and default safely when missing.
