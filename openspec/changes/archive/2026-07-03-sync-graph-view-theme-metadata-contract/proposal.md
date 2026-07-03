## Why

The backend Graph View contract now removes theme nodes and event-theme edges, and exposes theme context as `metadata.themes[]` on event and narrative nodes. The frontend still models `theme` and `event-theme` as valid graph topology, so response validation, visuals, counts, labels, and inspector content need to be brought back in line before further graph layout work.

## What Changes

- **BREAKING** Remove `theme` from the frontend Graph View node contract.
- **BREAKING** Remove `event-theme` from the frontend Graph View edge contract.
- Add frontend Graph View metadata support for `metadata.themes[]` items with `title` and `relationType`.
- Preserve event theme context from backend `EventTheme[]` and narrative theme context from `Narrative.primaryTheme` as inspector metadata instead of synthetic graph nodes or edges.
- Update Graph View documentation/spec deltas so the implemented schema and API mapping describe the same contract.
- Keep this change limited to contract sync and theme metadata presentation; do not redesign the graph into a new leaf layout in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `graph-view-backend-contract`: update accepted node/edge kinds and preserve `metadata.themes[]` for event and narrative nodes.
- `graph-view-node-detail-inspector`: remove theme-node inspector behavior and show theme metadata on event/narrative node details.

## Impact

- Affected backend API surface: `GET /graph-view` response contract already captured in `docs/api_mapping.json`.
- Affected frontend code: `app/lib/graph-view/definitions.ts`, `app/api/graph-view/action.ts`, `app/[lang]/(main)/graph-view/graph-view-workbench.tsx`, `app/[lang]/(main)/graph-view/graph-view-visuals.ts`, `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`, and graph view dictionary entries in `app/lib/i18n/dictionaries/en.ts` and `app/lib/i18n/dictionaries/vi.ts`.
- Affected docs/specs: `docs/APIMAPPING.md` has been updated first; OpenSpec graph-view specs need matching deltas.
- No dependency, backend, auth, route, or global theme-token changes are expected.
