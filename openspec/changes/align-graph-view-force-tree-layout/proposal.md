## Why

Graph View currently renders as a radial fan instead of the compact tree-like force layout shown by the G6 reference sample. The main drift comes from Signapse-specific seed positions and edge force classification that keep layout memory from the initial ring and shorten some root-to-terminal links too aggressively.

## What Changes

- Remove deterministic circular node seed positions from the initial G6 data so `d3-force` can settle naturally.
- Classify force links by hierarchy depth, matching the sample pattern: root/asset-to-child links stay longer and weaker, while branch-to-leaf links are shorter and stronger.
- Keep the current backend topology, node kinds, edge kinds, labels, HUD, quick detail, and interaction behavior unchanged.
- Keep tuning scoped to the existing `d3-force` layout; do not introduce G6 combo/cluster/BubbleSets or a new layout engine.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `graph-view-g6-force-layout`: Graph View force layout should produce a compact tree-like structure by letting G6 settle from natural positions and by applying branch/leaf force rules from the hierarchy.

## Impact

- Graph View canvas force data preparation and layout tuning in `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`.
- Existing Graph View G6 force layout OpenSpec requirements.
- Verification through OpenSpec validation, TypeScript, lint, and static search/review of layout-only changes.
