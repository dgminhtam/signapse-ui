## Context

The market chart drawing layer already supports creating overlays, selecting a drawing, deleting the selected drawing, and overriding overlay state through KLineChart APIs. Current drawing styles are generated from the chart theme at creation time. That is enough for default visuals, but not enough for user-selected color and stroke size.

The new control should be small and local to the selected drawing. It should not expand the left drawing rail or top chart toolbar, and it should not introduce backend persistence.

## Goals / Non-Goals

**Goals:**

- Provide a compact floating toolbar for the selected drawing overlay.
- Support a small preset color palette and stroke sizes `1px`, `2px`, and `3px`.
- Keep selected delete available from the floating toolbar.
- Apply style changes through KLineChart overlay override without recreating drawings.
- Store drawing style in overlay metadata so style survives theme sync, overlay cache/restore, and future persistence work.

**Non-Goals:**

- Do not add free-form color picker, opacity, dashed/solid line style, text editing, or per-tool advanced settings.
- Do not persist drawings or drawing styles to backend storage in this change.
- Do not redesign the existing left drawing rail or drawing palette groups.
- Do not change annotation marker behavior or market chart data loading.

## Decisions

### Use preset style tokens instead of arbitrary values

Define a small Signapse-owned drawing style model with `color` and `size`. Colors should come from a fixed preset list that works in light and dark mode; size should be limited to `1`, `2`, and `3`.

Alternative considered: a full color picker and free numeric size input. This adds more UI complexity and validation without current product need.

### Store style in overlay `extendData`

Each Signapse drawing overlay should keep its style metadata under the existing drawing `extendData`, preserving existing metadata keys such as source/tool and any future fill/persistence metadata. When style changes, merge metadata rather than replacing it.

Alternative considered: only storing resolved KLineChart `styles`. That makes it harder to recover user intent after theme changes, cache/restore, or future persistence.

### Update selected overlays with `overrideOverlay`

The canvas should expose an imperative method such as `updateSelectedDrawingStyle(partialStyle)` through `MarketChartCanvasHandle`. The method reads the selected overlay, merges style metadata, builds KLineChart overlay styles, and calls `chart.overrideOverlay({ id, styles, extendData })`.

Alternative considered: remove and recreate the selected overlay. That risks losing points, active selection, and user interaction state.

### Keep floating toolbar owned by the chart surface

The selected-drawing toolbar should be rendered by the market chart workbench/surface layer, because that layer already owns drawing state and delete callbacks. The canvas should report selection metadata including selected id, style, and anchor point.

Alternative considered: render toolbar entirely inside `MarketChartCanvas`. That would hide UI state inside the canvas adapter and make it harder to compose with shadcn controls and existing workbench actions.

### Derive anchor from selected overlay points

The canvas should compute a simple anchor point from selected overlay points using `chart.convertToPixel(...)`, preferably a midpoint or bounding center. The floating toolbar can clamp within the chart surface similarly to annotation popup placement.

Alternative considered: always show the toolbar at a fixed corner. That is simpler but weaker UX because users lose the association between selected drawing and controls.

## Risks / Trade-offs

- Built-in and custom overlays may interpret style keys differently -> apply color/size across `line`, `rect`, `polygon`, and `circle`, then verify representative line, shape, fibonacci, and pattern tools.
- Active theme changes may override user style -> theme sync must preserve overlays with user style metadata or reapply user styles after theme style updates.
- Active changes may also touch overlay metadata -> use additive metadata merge and avoid replacing `extendData`.
- Floating toolbar may overlap candles or annotation popups -> keep it compact, clamp to chart surface, and hide it while a new drawing tool is actively being placed.
- Narrow viewport may not have enough room for a floating toolbar -> allow wrap/compact layout or fallback to a fixed bottom/inside placement for small screens.
