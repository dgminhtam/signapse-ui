## Context

The market chart annotation layer currently has two ways to inspect events: red marker dots on the chart and a bottom rail with milestone action controls. After several polish passes, the bottom action controls continue to create visual and layout cost, especially when many events exist. The chart markers already provide the clearest spatial affordance because they sit directly on the relevant candle/time.

The loading skeleton also needs one more refinement. The current mounted chart skeleton is stable but too generic: it shows large blocks instead of recognizable chart structure. Users should see a lightweight preview of the chart surface, not another nested content card.

## Goals / Non-Goals

**Goals:**

- Remove bottom event milestone action buttons.
- Keep the annotation rail as a minimal status strip.
- Show `Chưa có sự kiện trong khoảng hiện tại.` instead of `0 mốc sự kiện` when no annotation groups exist.
- Keep `N mốc sự kiện` when annotation groups exist.
- Keep `Đang tải sự kiện` while annotation data is loading.
- Keep red chart marker dots as the direct annotation opening interaction.
- Remove now-unused ToggleGroup usage and delete `toggle` / `toggle-group` primitives if they are unused elsewhere.
- Make chart skeletons more chart-like with legend, plot, lower pane, and optional rail cues.

**Non-Goals:**

- Do not remove chart annotation marker dots.
- Do not change annotation grouping, marker positioning, popup behavior, or backend annotation API.
- Do not add a timeline scrubber, carousel, pagination, or hidden overflow menu for events.
- Do not add new dependencies or global theme tokens.
- Do not change chart engine, lazy history loading, route params, or toolbar behavior.

## Decisions

### 1. Make the bottom rail status-only

`MarketChartAnnotationControls` should no longer accept or render `selectedGroup` / `onSelectGroup` action props. It should only render:

- Loading: `Đang tải sự kiện`
- Empty: `Chưa có sự kiện trong khoảng hiện tại.`
- Non-empty: `<count> mốc sự kiện`

Rationale: Event marker dots already carry the interactive burden and map directly to the chart. Removing the duplicate milestone controls eliminates layout expansion and active/focus complexity.

Alternative considered: keep ToggleGroup and reduce density. Rejected because even a compact action list still duplicates chart markers and can become noisy at high event counts.

### 2. Empty state takes precedence over numeric zero

When `groups.length === 0`, the rail should render only the Vietnamese empty message and should not render the leading `0 mốc sự kiện` label.

Rationale: `0 mốc sự kiện` reads like a metric, while the empty message better explains the current range state.

Alternative considered: show both `0 mốc sự kiện` and the empty message. Rejected because it repeats the same information and makes the small rail feel heavier than needed.

### 3. Remove unused ToggleGroup source

After removing event rail buttons, the implementation should search for `ToggleGroup`, `ToggleGroupItem`, `toggle-group`, and `toggleVariants`. If the shadcn `toggle.tsx` and `toggle-group.tsx` files are unused, delete them.

Rationale: The repo rule for replaced UI/source cleanup favors removing unused primitives and avoiding dead source introduced by prior experiments.

Alternative considered: keep the primitives for possible future use. Rejected because there is no active product usage after this change.

### 4. Make skeletons chart-like without overbuilding a fake chart

Both page-level and chart-level skeletons should use a shared visual idea:

- A small legend row resembling Time/Open/High/Low/Close/Volume.
- A main plot skeleton area with subtle grid-like or layered chart structure.
- A lower pane skeleton representing volume/indicator area.
- A compact bottom rail skeleton only where the final event rail can appear.

Rationale: This maps to the KLineChart surface while avoiding complex candle placeholders or fake data.

Alternative considered: keep a single large block. Rejected because it reads as a generic card placeholder rather than a chart loading state.

## Risks / Trade-offs

- [Users lose bottom rail direct navigation] -> Chart marker dots remain the direct interaction and are more spatially meaningful.
- [Some events may be off-screen after zoom/pan] -> The rail count still signals event presence; deeper event navigation can be revisited with a dedicated timeline if needed.
- [Deleting ToggleGroup could remove a useful primitive] -> Delete only if repository search confirms no active usage remains.
- [Chart-like skeleton could become visually noisy] -> Keep the skeleton low contrast, shape-based, and free of real labels/copy beyond toolbar skeleton.

## Migration Plan

1. Remove ToggleGroup imports and milestone action rendering from `MarketChartAnnotationControls`.
2. Simplify `MarketChartAnnotationControls` props to only what status rendering needs.
3. Update `ChartSurface` call sites accordingly.
4. Search for ToggleGroup/toggle usage and delete `components/ui/toggle.tsx` and `components/ui/toggle-group.tsx` if unused.
5. Refine page-level and chart-level skeleton structure to show legend, plot, lower pane, and optional rail cues.
6. Run targeted lint, typecheck, build, OpenSpec validation, and visual smoke when authenticated chart data is available.

## Open Questions

- No blocking open questions. The direction is status-only event rail plus chart-like skeleton polish.
