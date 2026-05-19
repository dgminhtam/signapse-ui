## Why

Backend has finalized the `GET /graph-view` API contract and the frontend direction is now clear enough to commit to a concrete implementation path. The admin app still lacks a first-class browse surface for shared knowledge relationships, which leaves operators unable to inspect how events, assets, themes, and source documents connect across the system.

## What Changes

- Add a protected frontend graph-view feature that loads authenticated `GET /graph-view` data and renders a browseable knowledge graph inside the admin app.
- Introduce a dedicated graph-view route and navigation entry so authorized users can discover the feature alongside other content surfaces.
- Use `Sigma.js + graphology + @react-sigma/core` as the graph rendering stack for force-directed layout, pan/zoom interactions, and node/edge event handling.
- Map backend `nodes[]` and `edges[]` into frontend graph primitives without changing the backend contract.
- Provide graph interactions needed for MVP browsing:
  - pan and zoom
  - hover highlight for connected relations
  - node and edge selection
  - side-panel detail summaries driven by response metadata
  - permission-aware click-through into related entity detail pages where supported
- Keep frontend responsible for graph layout and visual styling, consistent with the documented contract that backend does not return coordinates or layout hints.
- Gate the page and navigation with `graph-view:read`.
- Update API mapping documentation so `/graph-view` is marked as implemented in the frontend surface once this change lands.

## Capabilities

### New Capabilities
- `graph-view-browse`: Browse the shared knowledge graph with force-directed visualization, selection, highlighting, and permission-aware drill-down into related entities.

### Modified Capabilities
- None.

## Impact

- New frontend files under `app/api/graph-view/*`, `app/lib/graph-view/*`, and `app/(main)/graph-view/*`.
- Navigation updates in `config/site.ts`.
- New client dependency on `sigma`, `graphology`, and `@react-sigma/core` plus the graphology layout package used for client-side positioning.
- Documentation updates in `docs/APIMAPPING.md`.
