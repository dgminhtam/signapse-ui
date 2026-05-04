## Why

The new G6 graph view is visually closer to the desired team-clustering layout, but two interaction bugs make it feel unstable: dragged nodes snap back after release, and Next.js development remounts can log `[G6 v5.1.0] The graph instance has been destroyed`.

This change hardens the G6 canvas lifecycle and drag behavior without expanding scope back into advanced inspector, labels, or modal features.

## What Changes

- Keep force-directed node dragging enabled, but make dropped nodes remain fixed for the current client-side graph session.
- Keep fixed drag positions frontend-only; do not persist node positions or mutate the backend graph payload.
- Guard the initial G6 render/fit lifecycle so immediate React dev cleanup does not start or continue stale graph work.
- Make graph cleanup idempotent by avoiding destroy calls against an already destroyed instance.
- Reduce redundant fit work where practical so G6 has one clear fit path after render.
- Preserve current graph data mapping, clustering, colors, route shell, loading, and empty states.

## Capabilities

### New Capabilities

- `graph-view-g6-drag-lifecycle`: Hardens G6 graph drag-drop pinning and render/destroy lifecycle safety for the graph view canvas.

### Modified Capabilities

## Impact

- Affected frontend code: `app/(main)/graph-view/graph-view-canvas.tsx`.
- No backend API changes.
- No dependency changes.
- No changes to graph payload shape, route structure, auth, permissions, or persisted data.
