## 1. Viewport Behavior

- [x] 1.1 Inspect current G6 zoom behavior and viewport API in `graph-view-canvas.tsx`.
- [x] 1.2 Remove free wheel zoom behavior from the G6 behaviors list.
- [x] 1.3 Narrow the graph zoom range to a conservative analysis range.

## 2. Icon Zoom Controls

- [x] 2.1 Add icon-only zoom in and zoom out controls near the existing recenter control.
- [x] 2.2 Implement zoom in and zoom out handlers using the current G6 graph instance.
- [x] 2.3 Clamp explicit zoom steps to the configured zoom range.
- [x] 2.4 Keep all controls accessible with Vietnamese `aria-label` and `title` text.

## 3. Regression Checks

- [x] 3.1 Verify drag canvas, drag node, hover spotlight, tooltip, and recenter still work with wheel zoom removed.
- [x] 3.2 Verify light and dark mode labels remain readable after the control cluster changes.
- [x] 3.3 Run lint for touched graph-view files.
- [x] 3.4 Run typecheck.
