## Context

`/graph-view` now uses an AntV G6 force canvas with draggable nodes, bounded canvas pan, hover spotlight, recenter, and compact HUD overlays. The current behavior still includes G6 `zoom-canvas` with default wheel handling and a wide `zoomRange`, which can make a small wheel gesture zoom too far and leave users hunting for the graph.

The user selected the strictest interaction model: remove free wheel zoom and rely on explicit icon controls. This makes viewport movement deliberate while keeping graph exploration possible.

## Goals / Non-Goals

**Goals:**

- Disable mouse-wheel zoom on the graph canvas.
- Provide compact icon-only controls for zoom in, zoom out, and recenter.
- Keep zoom bounded to a conservative graph-analysis range.
- Preserve drag canvas, drag node, hover spotlight, dark-mode label readability, clustering, and graph rendering.
- Keep controls accessible with Vietnamese labels and no visible explanatory copy.

**Non-Goals:**

- Removing all zoom capability.
- Adding text-heavy control descriptions or settings panels.
- Changing force layout, cluster inference, graph payload mapping, or backend contracts.
- Persisting viewport or zoom state to the backend.
- Reworking global navigation, app header, theme tokens, or shadcn primitives.

## Decisions

### Remove `zoom-canvas` behavior

The implementation should remove the `"zoom-canvas"` behavior from the G6 behaviors list. This disables free wheel zoom at the graph interaction layer.

Why:
- The user's pain is accidental over-zooming from wheel gestures.
- Wheel zoom competes with ordinary page/device scrolling expectations.
- Removing it makes viewport changes explicit and predictable.

Alternative considered:
- Lower `zoom-canvas` sensitivity. Rejected because the user selected explicit controls over wheel zoom.

### Keep zoom via icon-only buttons

Add zoom in and zoom out icon buttons alongside the existing recenter control in the canvas HUD. Use Lucide `Plus`, `Minus`, and the existing recenter icon, with accessible Vietnamese names.

Why:
- Icon controls match map/chart interaction patterns.
- They are more deliberate than wheel gestures.
- They fit the existing canvas-first HUD direction without adding card chrome.

Alternative considered:
- Use text buttons. Rejected because the graph HUD is space constrained and existing guidance favors familiar icon controls.

### Use G6 viewport APIs for explicit zoom

Zoom controls should call G6 viewport APIs on the current graph instance, using a small fixed zoom step and animation. The implementation should clamp zoom to the configured `zoomRange`.

Suggested behavior:
- Zoom in: multiply current zoom by a small ratio such as `1.18`.
- Zoom out: divide current zoom by the same ratio.
- Recenter: keep existing `fitView` behavior.
- Range: use a narrower range than today, such as `[0.45, 2.2]`, unless implementation testing shows the graph needs slightly different bounds.

Why:
- Small steps avoid the same disorientation caused by wheel zoom.
- Clamping prevents users from losing the graph.
- Reusing G6 APIs avoids custom viewport math.

Alternative considered:
- Hard reset zoom on every interaction. Rejected because users still need local inspection control.

### Avoid adding visible instructional copy

The controls should use icons, `aria-label`, and `title`, not visible text explaining how zoom works.

Why:
- This screen is being simplified toward a pure canvas.
- Persistent instructional copy would add visual noise.

## Risks / Trade-offs

- [Users expect wheel zoom on maps] -> Provide clear icon controls in the same HUD cluster as recenter.
- [Icon controls may feel slower than wheel] -> Use a comfortable fixed step and animation so repeated taps feel controlled.
- [Graph can still be hard to inspect when very dense] -> Keep zoom in/out available and preserve node drag/hover spotlight.
- [Viewport API differences in G6 v5] -> Verify against installed `@antv/g6@5.1.0` before marking tasks complete.

## Migration Plan

1. Remove G6 wheel zoom behavior from the graph canvas.
2. Add icon-only zoom in/out controls near the recenter button.
3. Clamp explicit zoom to a conservative range.
4. Verify drag, hover, recenter, light/dark labels, and icon zoom.

Rollback strategy:
- Restore the previous `"zoom-canvas"` behavior and remove the extra icon controls.

## Open Questions

- Whether the zoom step should be `1.15`, `1.18`, or `1.2`; implementation can choose the smallest value that feels responsive.
