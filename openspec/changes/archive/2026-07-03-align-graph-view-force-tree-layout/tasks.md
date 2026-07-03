## 1. Layout Data

- [x] 1.1 Remove deterministic circular seed position assignment from Graph View G6 node data.
- [x] 1.2 Remove dead seed-position helper code after node data no longer uses it.
- [x] 1.3 Keep node ids, labels, visual sizes, metadata, and existing interaction data unchanged.

## 2. Force Rules

- [x] 2.1 Replace child-terminal link classification with hierarchy-depth link classification.
- [x] 2.2 Ensure asset/root-level links use the longer weaker branch force.
- [x] 2.3 Ensure lower branch-to-leaf links use the shorter stronger leaf force.
- [x] 2.4 Keep existing drag-element-force, hover, selection, zoom, recenter, and quick-detail behavior intact.

## 3. Spec Sync

- [x] 3.1 Update the main `graph-view-g6-force-layout` spec after implementation if the final behavior differs from this delta.
- [x] 3.2 Confirm no contract, node kind, edge kind, dictionary, HUD, or inspector changes were introduced.

## 4. Verification

- [x] 4.1 Run `openspec.cmd validate align-graph-view-force-tree-layout --strict`.
- [x] 4.2 Run `pnpm.cmd typecheck`.
- [x] 4.3 Run `pnpm.cmd lint`.
- [x] 4.4 Run a static search for removed seed helpers and stale link-classification names.

User-owned visual QA: compare a dense Graph View payload against the reference tree sample after the implementation is applied.
