## Why

The new `graph-view` surface currently fails against the real backend payload even though the API shape is otherwise correct. The frontend validation layer rejects node metadata fields that the backend legitimately returns as `null`, which prevents the graph page from rendering and blocks end-to-end verification of the feature.

## What Changes

- Harden frontend `GET /graph-view` response handling so nullable node metadata from the backend does not fail runtime validation.
- Align the frontend graph-view response schema with the backend's actual nullability behavior for metadata fields such as `slug`, `canonicalKey`, `symbol`, `assetType`, `sourceName`, `url`, and `active`.
- Preserve graph rendering, selection, and side-panel behavior when metadata fields are absent or explicitly `null`.
- Improve the graph-view validation failure path so truly incompatible payloads remain diagnosable without treating backend-null metadata as a fatal contract error.
- Complete the previously blocked verification path for `/graph-view` using a real backend payload once the frontend parsing mismatch is resolved.

## Capabilities

### New Capabilities
- `graph-view-response-validation`: Accept real `graph-view` payload nullability in node metadata so the frontend can validate, render, and inspect the shared graph reliably.

### Modified Capabilities
- None.

## Impact

- Affected graph-view DTO parsing and runtime validation in `app/lib/graph-view/definitions.ts` and `app/api/graph-view/action.ts`.
- Possible small null-safe display adjustments in `app/(main)/graph-view/*` if the UI currently assumes metadata strings or booleans are always present when the object exists.
- Verification and task tracking updates for the existing graph-view rollout under `openspec/changes/add-graph-view-browse/*`.
- No backend API change; `GET /graph-view` remains the same endpoint and payload family.
