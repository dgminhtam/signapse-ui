## 1. Event Rail Simplification

- [x] 1.1 Remove bottom annotation milestone action rendering from `MarketChartAnnotationControls`.
- [x] 1.2 Remove `ToggleGroup` / `ToggleGroupItem` imports and usage from the market chart workbench.
- [x] 1.3 Simplify `MarketChartAnnotationControls` props so it no longer receives selection callbacks or selected group state.
- [x] 1.4 Render `Đang tải sự kiện` while annotation groups are loading.
- [x] 1.5 Render `N mốc sự kiện` only when `groups.length > 0`.
- [x] 1.6 Render only `Chưa có sự kiện trong khoảng hiện tại.` when `groups.length === 0`.
- [x] 1.7 Keep chart marker dots and popup behavior unchanged.

## 2. ToggleGroup Cleanup

- [x] 2.1 Search the repository for active `ToggleGroup`, `ToggleGroupItem`, `toggle-group`, `Toggle`, and `toggleVariants` usage after event rail simplification.
- [x] 2.2 Delete `components/ui/toggle-group.tsx` if it is unused.
- [x] 2.3 Delete `components/ui/toggle.tsx` if it is unused.
- [x] 2.4 Ensure no package or import cleanup is needed after deleting unused primitives.

## 3. Chart-Like Skeleton Polish

- [x] 3.1 Replace the mounted chart loading skeleton's large generic blocks with a chart-like structure.
- [x] 3.2 Add a compact legend-row cue to the chart-level loading skeleton.
- [x] 3.3 Add a main plot-area cue and lower volume/indicator pane cue to the chart-level loading skeleton.
- [x] 3.4 Update the page-level skeleton chart surface to use the same chart-like visual language.
- [x] 3.5 Ensure skeletons do not render fake symbol, timeframe, update-time, or event milestone labels inside the chart body.
- [x] 3.6 Use a compact status-rail cue only where the final annotation status rail can appear.

## 4. Verification

- [x] 4.1 Run targeted lint for market chart files and touched shared UI files.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `pnpm build`.
- [x] 4.4 Run `openspec validate --changes simplify-market-chart-event-status-and-skeleton`.
- [x] 4.5 Smoke check `/market-charts` with annotation data when an authenticated chart session is available; if unavailable, document the blocker.
  - Blocker: no authenticated Clerk chart session with annotation data is available from the terminal context, so visual smoke should be completed in the browser session.
