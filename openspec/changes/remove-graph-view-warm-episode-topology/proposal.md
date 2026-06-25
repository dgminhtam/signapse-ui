## Why

`GET /graph-view` live contract no longer returns warm episode nodes or warm episode relationship edges. The frontend still accepts and renders that removed topology, so Graph View validation, docs, specs, and canvas behavior can drift from the backend source of truth.

## What Changes

- **BREAKING**: Stop accepting `warm-episode` as a Graph View node kind.
- **BREAKING**: Stop accepting `asset-warm-episode` and `warm-episode-event` as Graph View edge kinds.
- Remove warm episode rendering surfaces from Graph View counts, visuals, layout hierarchy, and node inspector.
- Keep `metadata.knowledgeLayer` available on current graph nodes because the backend still exposes `HOT` / `WARM` as metadata.
- Update API mapping and OpenSpec wording to describe the current Graph View topology.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `graph-view-backend-contract`: Graph View node and edge requirements must match the warm-free backend contract.
- `graph-view-node-detail-inspector`: The inspector must no longer include warm episode-specific node detail behavior.

## Impact

- Frontend Graph View contract types and Zod schemas in `app/lib/graph-view`.
- Graph View workbench, canvas layout, visuals, and localization dictionaries.
- `docs/APIMAPPING.md` Graph View contract notes.
- OpenSpec graph-view backend and inspector requirements.
