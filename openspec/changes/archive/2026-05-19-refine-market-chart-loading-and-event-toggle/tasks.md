## 1. shadcn ToggleGroup Setup

- [x] 1.1 Check whether `components/ui/toggle-group.tsx` exists.
- [x] 1.2 If missing, add the official shadcn `toggle-group` primitive using the shadcn CLI and do not manually customize existing `components/ui` primitives.
- [x] 1.3 Import `ToggleGroup` and `ToggleGroupItem` only from the local shadcn primitive.

## 2. Event Rail ToggleGroup Refactor

- [x] 2.1 Replace bottom event rail milestone `Button` mapping with a controlled `ToggleGroup type="single"`.
- [x] 2.2 Render each milestone as a `ToggleGroupItem` using the annotation group id as `value`.
- [x] 2.3 Preserve the current milestone dot, formatted time label, grouped annotation count badge, and annotation selection callback.
- [x] 2.4 Ensure selected milestone feedback uses ToggleGroup selected state semantics and does not use filled primary action styling.
- [x] 2.5 Tune the milestone scroll wrapper so focus and active states do not create vertical scrollbar artifacts while horizontal overflow still works.

## 3. Page-Level Skeleton

- [x] 3.1 Update `MarketChartWorkbenchSkeleton` in `page.tsx` to mirror the current cardless toolbar shape.
- [x] 3.2 Remove the old right-side summary rail skeleton and old main card toolbar skeleton.
- [x] 3.3 Render a single chart surface skeleton with current `mt-4`, `rounded-xl`, border, and `bg-card` rhythm.
- [x] 3.4 Keep page-level skeleton shape-based and avoid duplicating live chart data internals.

## 4. Chart-Level Skeleton

- [x] 4.1 Update the `ChartSurface` loading state to remove fake in-chart metadata/header skeleton pills.
- [x] 4.2 Mirror the chart canvas area and lower pane proportions inside the chart surface.
- [x] 4.3 Render a compact event rail skeleton only when annotation layer is enabled.
- [x] 4.4 Ensure chart-level loading keeps the mounted toolbar visible and only replaces the chart/data region.

## 5. Verification

- [x] 5.1 Run targeted lint for market chart files.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm build`.
- [x] 5.4 Run `openspec validate --changes refine-market-chart-loading-and-event-toggle`.
- [x] 5.5 Smoke check `/market-charts` with annotation data when an authenticated chart session is available; if unavailable, document the blocker. Blocked: no authenticated Clerk workspace/provider candle session with annotation data is available in this terminal context.
