## Why

The market chart event buttons add secondary navigation that competes with the red annotation markers already visible on the chart, and they introduce layout/active-state complexity when many events exist. The chart loading skeleton also still feels like generic content blocks rather than a lightweight preview of the KLineChart canvas.

## What Changes

- Remove bottom event milestone action buttons entirely from the market chart annotation rail.
- Keep the bottom rail as a minimal status surface only.
- When annotations are loading, show `Đang tải sự kiện`.
- When annotation groups exist, show only `N mốc sự kiện`.
- When there are no annotation groups, show only `Chưa có sự kiện trong khoảng hiện tại.` and do not show `0 mốc sự kiện`.
- Keep chart marker dots as the only direct annotation opening affordance.
- Remove `ToggleGroup`/`ToggleGroupItem` usage from the market chart event rail.
- If the shadcn `toggle` and `toggle-group` primitives are unused after removing the rail actions, delete those files to keep source clean.
- Refine the page-level and chart-level loading skeletons so the chart area looks more like a chart canvas: legend row, main plot area, lower volume pane, and optional status rail.
- Do not change backend APIs, annotation grouping, chart marker rendering, popup content, lazy history loading, route params, or global theme tokens.

## Capabilities

### New Capabilities

- `market-chart-event-status-rail`: Covers status-only behavior for the bottom annotation rail after removing milestone action buttons.
- `market-chart-chartlike-skeleton`: Covers chart-like loading skeleton structure for the market chart page and mounted chart loading state.

### Modified Capabilities

- None.

## Impact

- Affected frontend files:
  - `app/(main)/market-charts/page.tsx`
  - `app/(main)/market-charts/market-chart-workbench.tsx`
- Potential cleanup files if unused:
  - `components/ui/toggle.tsx`
  - `components/ui/toggle-group.tsx`
- No backend API, chart engine, annotation marker, popup content, dependency, global theme token, or route state changes are expected.
- Verification should include targeted market chart lint, typecheck, build, OpenSpec validation, and visual smoke when an authenticated chart session with annotations is available.
