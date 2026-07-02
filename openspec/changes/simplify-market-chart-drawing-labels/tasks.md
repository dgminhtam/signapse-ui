## 1. Drawing Label Behavior

- [x] 1.1 Add a Signapse-owned Fibonacci line overlay that keeps all configured percentage labels and omits price values.
- [x] 1.2 Reuse the Fibonacci level rendering path so Fibonacci line, segment, and extension keep every configured percentage label.
- [x] 1.3 Disable selected-overlay X-axis date labels and range fills for drawing overlays.
- [x] 1.4 Disable selected-overlay Y-axis anchor price labels and range fills for non-price-level drawing overlays.
- [x] 1.5 Preserve useful price feedback for price-line and horizontal price-level drawing tools.

## 2. Text Styling

- [x] 2.1 Update drawing overlay text styling to use a chart-readable text color independent of the selected drawing stroke color.
- [x] 2.2 Confirm drawing line, border, fill, and point styles still follow selected drawing style metadata.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate simplify-market-chart-drawing-labels --strict`.
- [x] 3.2 Run `pnpm.cmd typecheck`.
- [x] 3.3 Perform a deterministic review of drawing overlay mappings and selected-axis defaults for the affected tools.
