## Why

`/graph-view` still fails response validation after the news article edge rename because the backend now returns narrative graph data. Runtime backend source shows `GraphNodeKind.NARRATIVE` plus `NARRATIVE_EVENT` and `NARRATIVE_ASSET` edges, while the frontend Graph View schema and render maps still only accept events, assets, themes, and news articles.

## What Changes

- Extend Graph View response typing and Zod validation to accept `narrative` nodes.
- Extend Graph View edge typing and validation to accept `narrative-event` and `narrative-asset`.
- Add narrative metadata fields returned by backend: `narrativeStatus` and `thesis`.
- Add localized visual labels and styling for narrative nodes and narrative edges in the canvas HUD, node inspector, and graph visuals.
- Update graph clustering/rendering so narrative nodes render as first-class graph nodes without breaking existing event, asset, theme, and news article behavior.
- Update Graph View API mapping notes so documentation reflects the backend runtime contract.
- Do not add a dedicated narrative detail route or quick-detail drawer in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `graph-view-backend-contract`: Extend the implemented Graph View backend contract to include narrative nodes and narrative relationships.

## Impact

- Affects `app/lib/graph-view/definitions.ts`.
- Affects Graph View rendering files under `app/[lang]/(main)/graph-view/`.
- Affects graph view dictionary labels in `app/lib/i18n/dictionaries/`.
- Affects `docs/APIMAPPING.md` Graph View contract notes.
- No backend endpoint, permission, dependency, or G6 engine change is expected.
