## Context

`/graph-view` now renders the graph canvas with AntV G6 and a D3 force layout. The current canvas enables `drag-element-force`, but the behavior is configured with `fixed: false`, so G6 clears fixed coordinates on drag end and the force layout can pull the node away from the dropped position.

The console error `[G6 v5.1.0] The graph instance has been destroyed` is a separate frontend lifecycle race. G6 `Graph.render()` is asynchronous and its internal `prepare()` step yields once before initializing runtime. In Next.js development mode, React can mount, immediately clean up, and remount client effects; cleanup may call `graph.destroy()` before the pending render resumes, causing G6 to log the destroyed-instance error.

## Goals / Non-Goals

**Goals:**

- Make node drag-drop feel real by keeping the dragged node fixed after release for the current client session.
- Preserve force reactions for connected or clustered nodes while dragging.
- Prevent expected mount/unmount races from surfacing as destroyed-instance console errors.
- Keep graph cleanup safe and idempotent.
- Keep the fix surgical within the G6 canvas implementation.

**Non-Goals:**

- Persisting graph node positions to the backend.
- Rebuilding modal inspection, hover title cards, advanced edge labels, or Sigma-era controls.
- Changing backend graph response shape, clustering semantics, route layout, or dependencies.
- Muting all G6 warnings globally.

## Decisions

### Use G6 fixed drag behavior for drop pinning

Configure `drag-element-force` with `fixed: true`. In G6 v5, `fixed: true` means the node remains fixed after dragging ends; with `fixed: false`, `onDragEnd` clears fixed position via `setFixedPosition(id, [null, null, null])`.

Why:
- This matches the user's expected analysis workflow: drag a node aside, inspect relationships, and keep that local arrangement.
- It uses G6's native behavior rather than custom drag math.
- It does not require backend state.

Alternative considered:
- Store fixed positions in React state and reapply them. Rejected for this bug fix because G6 already supports runtime fixed positions and persistence is explicitly out of scope.

### Cancel stale initial render before calling G6

Schedule the initial `graph.render()` behind a cancellable browser task such as `requestAnimationFrame`. Cleanup should cancel that task if React immediately unmounts the component before render starts.

Why:
- It avoids the exact G6 `prepare()` race where the graph is destroyed before async render resumes.
- It keeps the fix local and avoids global G6 console monkey-patching.

Alternative considered:
- Catch the render promise only. Rejected as the primary fix because G6 logs the destroyed-instance message internally instead of throwing it from `prepare()`, so catching the promise is not sufficient by itself.

### Keep lifecycle guards around render, fit, resize, and destroy

The component should keep an `isDisposed` flag and check `graph.destroyed` before resize, fit, or destroy operations. Cleanup should only destroy an instance that is not already destroyed, and it should clear `graphRef.current` only if it still points to the same instance.

Why:
- React remounts and data changes can create overlapping graph instances.
- Guarding the ref avoids a stale cleanup wiping out a newer instance.

Alternative considered:
- Leave cleanup as-is because `destroy()` is normally called once. Rejected because Next dev remounts make lifecycle races visible and noisy.

### Prefer one fit path after initial render

Avoid redundant fit work where practical. If explicit guarded `fitView()` remains after render, disable `autoFit: "view"`; if relying on G6 `autoFit`, avoid a second manual `fitView()`.

Why:
- Reducing async viewport work reduces race surface.
- It makes the lifecycle easier to reason about.

## Risks / Trade-offs

- [Dropped nodes stay fixed until remount] -> This is intentional for analysis, and reset-on-remount keeps the feature frontend-only.
- [Scheduling render one frame later slightly delays initial canvas paint] -> The delay is negligible and trades a tiny paint delay for lifecycle stability.
- [Destroy race could still occur after render starts during a later data change] -> Keep guards around follow-up fit/resize/destroy paths and verify with route remount smoke checks.
- [G6 behavior API changes in future versions] -> Keep the change localized to the behavior configuration and lifecycle wrapper.
