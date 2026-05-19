## Why

Graph view currently crashes when the backend returns multiple semantic relations between the same source and target nodes. This now blocks valid graph payloads because the frontend builds a multigraph model but Sigma still initializes with a simple graph at runtime.

## What Changes

- Update graph view's Sigma integration so the runtime graph supports multiple directed edges between the same two nodes.
- Preserve distinct parallel edges from the backend by edge key and relation type instead of rejecting them during canvas load.
- Add regression coverage for payloads that contain repeated source-target pairs with different edge identities.

## Capabilities

### New Capabilities
- `graph-view-multigraph-support`: Graph view can render backend payloads that contain parallel directed edges between the same nodes without crashing or dropping valid relations.

### Modified Capabilities

## Impact

- Affected frontend code in `app/(main)/graph-view/graph-view-canvas.tsx` and related graph model loading flow.
- No backend API contract changes; existing multigraph payloads remain valid.
- Impacts the `graphology` and `@react-sigma/core` integration path used by graph view.
