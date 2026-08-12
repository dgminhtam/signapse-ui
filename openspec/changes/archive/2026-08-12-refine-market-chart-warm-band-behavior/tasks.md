## 1. Timeframe Eligibility

- [x] 1.1 Add an explicit warm-band timeframe policy for `1d` and `1w` beside the market-chart view-model/timeframe logic.
- [x] 1.2 Apply the policy before creating warm annotation groups so unsupported timeframes do not calculate, render, or resolve selectable warm bands while hot-event markers remain unchanged.

## 2. Non-Blocking Warm Band Interaction

- [x] 2.1 Split each visible warm band into a pointer-transparent visual range and a compact positioned button used as the controlled popover trigger.
- [x] 2.2 Preserve direction styling, selected-state emphasis, viewport alignment, localized accessible naming, visible keyboard focus, touch target sizing, and the existing desktop/mobile detail presentation.
- [x] 2.3 Keep the compact trigger non-interactive while a drawing tool is active so chart drawing gestures retain priority.

## 3. Verification

- [x] 3.1 Run `pnpm.cmd lint` and `pnpm.cmd typecheck`.
- [x] 3.2 Run `openspec.cmd validate refine-market-chart-warm-band-behavior --strict`.
- [x] 3.3 Perform a deterministic static review confirming only `1d` and `1w` derive warm groups and the full painted warm-band rectangle is no longer a pointer hit target.

User-owned manual QA: In an authenticated environment with warm episode data, verify band visibility across every supported timeframe and confirm pan, scroll, zoom, pointer/touch inspection, keyboard activation, and drawing-tool behavior through a visible band.
