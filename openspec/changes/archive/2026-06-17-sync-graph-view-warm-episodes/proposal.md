## Why

The latest backend Graph View contract now returns `warm-episode` nodes, warm episode relationship edges, and `knowledgeLayer`/period metadata. The current frontend schema and graph rendering only support up to narrative nodes, so new backend payloads can fail validation before the Graph View workspace renders.

## What Changes

- Accept `warm-episode` nodes from `GET /graph-view`.
- Accept `asset-warm-episode` and `warm-episode-event` edges from `GET /graph-view`.
- Preserve and render warm episode metadata from `GraphNodeMetadata`, including `periodStart`, `periodEnd`, and `knowledgeLayer`.
- Show warm episode nodes and relationships in Graph View counts, visuals, localized labels, clustering, and node inspection.
- Keep warm episodes browse-only for now; do not add a new detail route, drawer, or backend fetch.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `graph-view-backend-contract`: Update accepted node/edge kinds and graph presentation coverage for warm episode contract fields.
- `graph-view-node-detail-inspector`: Add kind-specific inspection behavior for warm episode nodes without adding unavailable navigation actions.

## Impact

- Affected frontend schema/action path: `app/lib/graph-view/definitions.ts`, `app/api/graph-view/action.ts`.
- Affected Graph View UI: `app/[lang]/(main)/graph-view/graph-view-workbench.tsx`, `graph-view-canvas.tsx`, and `graph-view-visuals.ts`.
- Affected localization: `app/lib/i18n/dictionaries/en.ts`, `app/lib/i18n/dictionaries/vi.ts`, and dictionary typing if required.
- No dependency changes, new routes, or new backend calls are expected.
