## Why

Graph view already shows how events, news articles, assets, and themes relate, but users cannot click a node to inspect the underlying entity. This makes the canvas useful for structure discovery but weak for analysis follow-through, because users must leave the graph mentally before seeing the details behind a node.

## What Changes

- Add click selection for graph nodes.
- Show a compact in-canvas detail inspector for the selected node.
- Present node details from the existing `/graph-view` payload first: title, type, metadata, timestamps, source URL, confidence, and related counts where available.
- Preserve hover preview, drag node, drag canvas, bounded space, icon zoom, and recenter behavior.
- Highlight the selected node and its directly related nodes/edges while the inspector is open.
- Provide direct navigation actions for entities that already have detail routes:
  - Event nodes open `/events/[id]`.
  - News article nodes open `/news-articles/[id]`.
- Keep asset and theme nodes inspectable without requiring new backend endpoints.

## Capabilities

### New Capabilities

- `graph-view-node-detail-inspector`: Covers node click selection, in-canvas node detail display, related graph emphasis, and detail-route actions for event and news article nodes.

### Modified Capabilities

None.

## Impact

- Affects `app/(main)/graph-view/graph-view-canvas.tsx` and likely `app/(main)/graph-view/graph-view-workbench.tsx`.
- Uses existing graph view contract from `app/lib/graph-view/definitions.ts`; no backend API change is required for the first version.
- Uses existing event and news article detail routes.
- No new dependency expected.
- No global theme token, shadcn primitive, or navigation changes expected.
