## Context

`/graph-view` now uses G6 state updates to emphasize the selected node and its direct relations. The current selection effect can run after `graphRef.current` is assigned but before `graph.render()` has completed. During this window, G6 has model data but its internal element renderer may not be ready, so `graph.setElementState()` can call into an undefined element controller and throw `Cannot read properties of undefined (reading 'draw')`.

The fix should stay local to graph view lifecycle management. The inspector behavior remains correct; the unstable part is when and how G6 state updates are pushed.

## Goals / Non-Goals

**Goals:**

- Prevent selection state updates from running before the G6 graph has completed initial render.
- Avoid unnecessary G6 state writes for the initial `null` selection.
- Batch node and edge state changes into a single `setElementState` call when possible.
- Preserve current selection, inspector, hover, drag, zoom, recenter, and cleanup behavior.
- Keep async G6 state update errors contained and logged only when the graph is still alive.

**Non-Goals:**

- Changing node inspector layout or copy.
- Changing graph clustering, force layout, or backend graph data.
- Adding new graph behaviors or dependencies.
- Removing selected relation emphasis.
- Solving unrelated G6 lifecycle warnings from other graph changes.

## Decisions

### Track render readiness explicitly

The graph canvas should maintain a render-ready signal that is set only after `graph.render()` completes and the graph is not disposed or destroyed.

Why:
- `graphRef.current` alone means the instance exists, not that elements are drawable.
- The crash happens in the gap between instance creation and draw readiness.
- A simple readiness gate keeps React state effects from racing G6 internals.

Alternative considered:
- Wrap `setElementState()` in `try/catch` only. Rejected because it hides the crash but still performs invalid lifecycle work.

### Skip initial null selection state writes

Selection state application should not call G6 when there is no selected node and no previous selection state to clear.

Why:
- The initial unselected state is already the graph's default visual state.
- Calling `setElementState()` for every element on initial mount creates work and can trigger the lifecycle race.

Alternative considered:
- Always apply an empty state for every node after render. Rejected as unnecessary and less efficient.

### Batch selection state updates

The implementation should build a single `Record<ID, State[]>` for all node and edge state changes and call `graph.setElementState(record, false)` once.

Why:
- G6's `setElementState()` triggers a draw stage.
- Calling it once per node/edge can cause dozens or hundreds of redraw attempts.
- Batch updates reduce race surface and improve performance for dense graphs.

Alternative considered:
- Keep per-element calls with async catches. Rejected because it still redraws repeatedly and makes lifecycle ordering harder to reason about.

### Track whether selection has been applied before

The effect needs to distinguish initial no-selection from clearing a real previous selection. A ref such as `hasAppliedSelectionRef` can allow:

- Skip when selected node is null and no selection state was applied before.
- Apply clearing states when selected node becomes null after an earlier selection.

Why:
- This preserves clear-selection behavior without doing initial work.

## Risks / Trade-offs

- [Selection before render is temporarily ignored] -> Re-apply selected state when render readiness flips true.
- [Batch update may include ids whose elements are not currently rendered] -> Build the batch from current graph model and only run after render completion; catch and log alive-graph errors defensively.
- [Async state promise rejects after unmount] -> Check `graph.destroyed` before logging.
- [Selection clear could be skipped incorrectly] -> Use an explicit ref to remember whether selection state was ever applied.

## Migration Plan

1. Add render-ready state or ref around the existing `renderGraph()` success path.
2. Gate selection state effect on render readiness.
3. Add a ref to skip the initial null selection update but allow clearing previous selection state.
4. Convert selection state application to batch updates.
5. Catch rejected G6 state promises while respecting destroyed graph instances.
6. Run focused lint and typecheck.

Rollback strategy:
- Revert to the prior selection effect and per-element state update logic, though that would reintroduce the reported crash.

## Open Questions

None for the first fix; browser smoke testing should confirm no crash when loading the graph with no selected node and when selecting/clearing nodes.
