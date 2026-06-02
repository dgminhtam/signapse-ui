## 1. Drawing Style Model

- [x] 1.1 Add a market chart drawing style type with preset color and size values.
- [x] 1.2 Update drawing overlay metadata so each Signapse drawing stores tool identity and style metadata without overwriting existing metadata.
- [x] 1.3 Update drawing style helper logic so overlay styles can be built from chart theme defaults plus optional user-selected style.

## 2. Canvas Selection And Style API

- [x] 2.1 Extend drawing selection reporting from boolean-only to selected drawing metadata including id, anchor point, and current style.
- [x] 2.2 Compute selected drawing toolbar anchor from selected overlay points and update it on select, draw end, scroll, zoom, resize, and deselect.
- [x] 2.3 Add a `MarketChartCanvasHandle` method to update the selected drawing style through `chart.overrideOverlay`.
- [x] 2.4 Ensure color/size updates preserve overlay points, lock state, visibility state, group id, tool metadata, and any existing extension metadata.

## 3. Selected Drawing Toolbar UI

- [x] 3.1 Add a compact selected-drawing toolbar in the market chart surface that appears only when a drawing overlay is selected.
- [x] 3.2 Add preset color controls with active state and localized accessible names.
- [x] 3.3 Add size controls for `1px`, `2px`, and `3px` with active state and localized accessible names.
- [x] 3.4 Add delete selected action to the selected-drawing toolbar while keeping clear-all only in the existing confirmed action.
- [x] 3.5 Clamp toolbar placement within the chart surface and hide it while a new drawing is actively being placed.

## 4. Integration And Copy

- [x] 4.1 Update drawing creation so new overlays start with default drawing style metadata.
- [x] 4.2 Ensure cached/restored drawings reapply stored style metadata.
- [x] 4.3 Add localized Vietnamese and English labels for drawing color, drawing size, selected drawing toolbar, and delete selected drawing.

## 5. Verification

- [x] 5.1 Run `openspec validate add-market-chart-selected-drawing-style-toolbar --strict`.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm lint`.
- [x] 5.4 Run a deterministic code review for metadata merge safety, selected overlay preservation, shadcn wrapper usage, and representative line/shape/fibonacci/pattern style mapping.

User-owned manual QA note: after implementation, manually verify selecting a drawing shows the toolbar, changing color/size updates the selected drawing without recreating it, delete removes only the selected drawing, and style remains stable after chart pan/zoom/theme changes.
