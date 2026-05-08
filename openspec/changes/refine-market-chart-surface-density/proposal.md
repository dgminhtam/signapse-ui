## Why

The market chart screen still feels denser and less consistent than the standardized list workspaces: the right summary rail reduces chart width, the chart surface uses custom radius values, the toolbar-to-chart gap does not match list pages, the event switch wrapper differs from shadcn control height/radius, and KLineChart text does not use the app font. Tightening these details makes the chart feel like a native Signapse workspace instead of a standalone embedded widget.

## What Changes

- Remove the right-side market summary card/rail so the chart can use the full workspace width.
- Normalize the spacing between the chart toolbar and chart surface to match list pages: the chart surface owns `mt-4` like `AppListTable`.
- Normalize the chart surface radius/border treatment to the same visual contract as list table surfaces: `rounded-xl`, `border-border`, `bg-card`, and controlled clipping only where needed.
- Replace custom chart radius values such as `rounded-[28px]` and `rounded-t-[28px]` with standard radius tokens/classes.
- Normalize the `Sự kiện` switch wrapper to align visually with default shadcn `Input`, `Button`, and `SelectTrigger` height/radius.
- Configure KLineChart text styles to use the same app sans font stack as the rest of Signapse.
- Preserve chart data loading, URL state, refresh behavior, annotation marker/popup behavior, and responsive usability.

## Capabilities

### New Capabilities

- `market-chart-surface-density`: Covers market chart surface density, spacing, radius, full-width chart layout, control wrapper alignment, and chart font consistency.

### Modified Capabilities

- None.

## Impact

- Affected frontend area: `app/(main)/market-charts/market-chart-workbench.tsx`.
- Affected chart-local component: `app/(main)/market-charts/market-chart-canvas.tsx`.
- No backend API, DTO, dependency, permission, or route changes are expected.
- Verification should include chart full-width layout, toolbar-to-chart spacing, switch wrapper height/radius, chart surface radius, chart font consistency, targeted market chart lint, typecheck, build, and OpenSpec validation.
