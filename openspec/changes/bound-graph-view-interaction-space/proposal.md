## Why

Graph view drag interaction is now useful for analysis, but users can still pan the canvas or drag nodes far away from the working area and then have to search for the graph again. The canvas needs a bounded exploration space so dragging remains flexible without making the graph feel easy to lose.

## What Changes

- Add a light pan boundary so the viewport can move naturally but cannot drift indefinitely away from the graph.
- Clamp dragged nodes inside a frontend-only analysis bounds around the visible graph workspace.
- Add a visible recovery control labeled `Đưa về trung tâm` that recenters the graph when the user wants to return to the main analysis area.
- Keep node drag positions session-local; do not persist manual layout positions or mutate backend graph data.
- Preserve the current G6 force layout, clustering behavior, graph data mapping, colors, loading state, and empty state.

## Capabilities

### New Capabilities

- `graph-view-interaction-space`: Constrains graph view panning and node dragging to a recoverable analysis space and exposes a recenter action.

### Modified Capabilities

## Impact

- Affected frontend code: `app/(main)/graph-view/graph-view-canvas.tsx`.
- No backend API changes.
- No dependency changes.
- No changes to graph payload shape, route structure, auth, permissions, or persisted data.
