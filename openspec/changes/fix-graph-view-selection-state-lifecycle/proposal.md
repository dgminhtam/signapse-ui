## Why

Graph view can crash at runtime with `Cannot read properties of undefined (reading 'draw')` when the node selection effect calls G6 `setElementState()` before the graph has completed its first render. This blocks the new node detail inspector from being safely usable and needs a focused lifecycle fix before further graph interaction work.

## What Changes

- Gate selected-node state application until the G6 graph has completed its initial render.
- Avoid calling G6 `setElementState()` during the initial unselected state.
- Apply node and edge selection states in a batched update rather than one redraw per element.
- Preserve the existing node inspector, hover tooltip, drag node, drag canvas, zoom, and recenter behavior.
- Add defensive handling around async G6 state updates so lifecycle races do not surface as unhandled runtime errors.

## Capabilities

### New Capabilities

- `graph-view-selection-state-lifecycle`: Covers safe timing and batching for graph selection state updates after the G6 render lifecycle is ready.

### Modified Capabilities

None.

## Impact

- Affects `app/(main)/graph-view/graph-view-canvas.tsx`.
- No backend API or data contract changes.
- No dependency changes.
- No visual redesign intended; this is a stability fix for the existing inspector behavior.
