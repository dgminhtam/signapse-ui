## Context

`/market-charts` currently has two valid loading layers, but both still carry pieces of older UI. The page-level Suspense fallback still resembles the previous carded toolbar plus right-side summary rail, while the mounted workbench loading state shows fake in-chart metadata pills even though metadata has moved to the trailing toolbar.

The bottom event rail also recently moved from custom chips to shadcn `Button variant="outline"`, but the semantics are still closer to a mutually exclusive option set. The current implementation can reveal unwanted scrollbars when a milestone receives focus/active transform, and selected state feedback is weaker than expected because `aria-pressed` is being styled manually.

## Goals / Non-Goals

**Goals:**

- Preserve the two-level skeleton model.
- Make the page-level skeleton mirror the final cardless toolbar and single chart surface.
- Make the chart-level skeleton mirror the KLineChart canvas and optional bottom event rail.
- Remove stale skeleton elements from old layouts, including the right summary rail and fake in-chart metadata/header pills.
- Use shadcn `ToggleGroup` / `ToggleGroupItem` for bottom event rail milestone selection.
- Fix event milestone focus/active scroll artifacts.
- Make selected/focused event milestones visually clear using ToggleGroup state semantics.

**Non-Goals:**

- Do not collapse the two skeleton levels into one.
- Do not change server data fetching, permission checks, watchlist API calls, candle API calls, or lazy history loading.
- Do not add a custom timeline scrubber or mini chart.
- Do not change annotation popup content or chart marker rendering.
- Do not manually edit existing shadcn primitives.
- Do not change global theme tokens or route query params.

## Decisions

### 1. Keep page skeleton for server bootstrap only

The page-level fallback should represent the state before `MarketChartWorkbench` has mounted. It should mirror the current body structure:

- `AppListToolbar`-like shape: leading asset select skeleton, trailing timeframe, event switch, refresh button, and freshness text placeholders.
- A single chart surface placeholder with `mt-4`, `rounded-xl`, border, `bg-card`, and a large canvas-like skeleton.
- No right-side summary rail or carded toolbar wrapper.

Rationale: Page skeleton is about the whole workbench arriving, not candle refresh. It should avoid layout shift once the actual toolbar/chart shell mounts.

Alternative considered: reuse the mounted chart skeleton in the page fallback. Rejected because the page fallback also needs to show toolbar bootstrap placeholders before watchlist assets are available.

### 2. Keep chart skeleton for mounted candle fetches

The chart-level loading state should render inside `ChartSurface` after the toolbar is already visible. It should only replace the chart/data area:

- Canvas plot skeleton matching `min-h-[520px]` and chart padding/radius.
- Optional volume/axis-like sub-shapes if useful for mapping, but no fake metadata header.
- Event rail skeleton only when the annotation layer is enabled, because the final rail only appears in that mode.

Rationale: Once the workbench is mounted, users still need stable toolbar controls while candle data refreshes. The loading state should not pretend there is a chart header that no longer exists.

Alternative considered: show only a centered spinner. Rejected because the chart is large and a shape-preserving skeleton better communicates the final layout and avoids perceived jump.

### 3. Use ToggleGroup for event milestone selection

Install/add the official shadcn `toggle-group` primitive if absent, then render the bottom milestone list as:

- `ToggleGroup type="single"` controlled by the selected annotation group id.
- `ToggleGroupItem variant="outline"` for each milestone.
- `value={group.id}` and `onValueChange` mapped to the existing annotation selection callback.

Rationale: The rail is a single-selection option set. ToggleGroup gives correct semantics and state styling hooks (`data-state="on"`) without manually approximating pressed state on `Button`.

Alternative considered: continue with `Button` and improve `aria-pressed` classes. Rejected because it still leaves this as a hand-rolled option group and is easier to regress.

### 4. Prevent focus/active scrollbar artifacts at the rail boundary

The milestone scroller should provide enough vertical breathing room for focus rings and active state while hiding accidental vertical overflow. Use local wrapper/layout treatment such as:

- `overflow-x-auto overflow-y-hidden`
- small vertical padding for ring space
- negative horizontal margin/padding only when needed to keep edge alignment

Rationale: Focus rings should remain visible without causing a tiny vertical scrollbar in the rail.

Alternative considered: remove focus ring/active transform. Rejected because that weakens keyboard accessibility and moves away from shadcn control behavior.

## Risks / Trade-offs

- [Adding ToggleGroup touches `components/ui`] -> Use the official shadcn CLI-generated primitive only; do not manually customize existing primitives.
- [ToggleGroup command needs network during apply] -> If the primitive is unavailable locally, request approval/escalation when installing through `pnpm dlx shadcn@latest add toggle-group`.
- [Page skeleton may over-specify layout] -> Keep it shape-based and minimal, not a duplicate of all internal component markup.
- [Chart skeleton may not perfectly resemble vendor canvas] -> Prioritize stable dimensions, chart surface rhythm, and absence of stale fake header content.
- [Event rail active state may become too strong] -> Use ToggleGroup outline state and semantic tokens; avoid filled primary treatment unless visual smoke proves it necessary.

## Migration Plan

1. Add the official shadcn `toggle-group` component if missing.
2. Refactor event rail milestones from `Button` to controlled `ToggleGroup` / `ToggleGroupItem`.
3. Tune the event rail scroll wrapper so focus/active state does not create vertical scrollbar artifacts.
4. Update page-level Suspense skeleton to mirror the current toolbar and single chart surface.
5. Update chart-level loading skeleton to mirror the chart canvas and optional event rail only.
6. Run targeted market chart lint, typecheck, build, and OpenSpec validation.
7. Smoke check `/market-charts` visually with authenticated chart and annotation data when available.

## Open Questions

- No blocking open questions. The direction is to keep two skeleton layers and use shadcn ToggleGroup for event rail single selection.
