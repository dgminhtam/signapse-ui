## Why

Graph view currently allows mouse-wheel zoom freely, which can make one small wheel gesture jump too far and disorient users while they analyze dense graphs. Replacing wheel zoom with explicit icon controls keeps viewport changes intentional while preserving the ability to inspect dense areas.

## What Changes

- Remove free mouse-wheel zoom from the graph canvas.
- Add compact icon-only zoom controls inside the canvas for zoom in, zoom out, and recenter.
- Keep drag canvas, drag node, hover spotlight, clustering, bounded space, and existing graph data behavior intact.
- Limit zoom to a conservative analysis range so users cannot easily lose the graph.
- Keep controls accessible with Vietnamese aria labels and titles.

## Capabilities

### New Capabilities

- `graph-view-controlled-zoom`: Covers explicit icon-based graph zoom controls, disabled free wheel zoom, zoom bounds, and recenter behavior.

### Modified Capabilities

None.

## Impact

- Affects `app/(main)/graph-view/graph-view-canvas.tsx`.
- No backend API or data contract changes.
- No new dependency expected; uses existing G6 viewport APIs and Lucide icons.
- No global theme token or shadcn primitive changes.
