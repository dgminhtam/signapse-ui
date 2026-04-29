## Why

The current Sigma-based graph view needs repeated custom patches to approximate clustered force behavior, but the desired product direction is closer to G6's native D3 force graph: team clustering, collision, zoom/pan, and drag-force where connected nodes react in real time. This change rebuilds the graph canvas as a small G6 MVP so the team can validate the target interaction model before reintroducing advanced inspector and label behavior.

## What Changes

- **BREAKING**: Replace the current Sigma graph canvas implementation for `/graph-view` with a G6 canvas MVP.
- Add `@antv/g6` as the graph rendering and force-layout dependency.
- Map the existing backend graph response into G6 `nodes` and `edges` without changing the backend contract.
- Render a D3 force layout with collision, zoom/pan canvas behavior, and force-directed node dragging.
- Add a simple team-clustering model based on graph anchors such as assets, themes, and source-event relationships.
- Preserve the page shell, graph fetch flow, empty state, and high-level visual language.
- Defer hover full-title cards, modal detail inspection, local-focus controls, edge-label toggles, and position persistence until later phases.

## Capabilities

### New Capabilities

- `graph-view-g6-force-layout`: Graph view renders a G6 D3-force team clustering canvas from the current backend graph payload.

### Modified Capabilities

## Impact

- Affected frontend code in `app/(main)/graph-view/`, especially the canvas and graph model mapping.
- Adds a new dependency on `@antv/g6`.
- Removes or bypasses Sigma-specific runtime code for the first G6 MVP.
- No backend API changes, data persistence changes, permission changes, or route changes are expected.
- Existing in-progress Sigma readability changes may become superseded for the graph canvas once this MVP is applied.
