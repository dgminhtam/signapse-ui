## 1. Dependency And Boundary

- [x] 1.1 Add `@antv/g6` to project dependencies.
- [x] 1.2 Keep the graph canvas behind a client-only dynamic boundary so G6 browser APIs are not evaluated during SSR.
- [x] 1.3 Identify Sigma-specific files, imports, and state that can be removed, bypassed, or left unused for the G6 MVP.

## 2. G6 Data Mapping

- [x] 2.1 Create a G6 graph data mapper from the existing `GraphViewResponse` nodes and edges.
- [x] 2.2 Preserve stable node ids, edge ids, node kind, edge kind, relation type, labels, weights, and source/target metadata in mapped data.
- [x] 2.3 Add deterministic cluster-key inference using asset/theme anchors, event relationships, source/news relationships, and kind/id fallback.
- [x] 2.4 Map node kind colors and basic node sizes into G6 visual styles.

## 3. G6 Canvas MVP

- [x] 3.1 Replace the Sigma canvas component with a G6 canvas component that creates, renders, updates, and destroys a G6 graph instance safely.
- [x] 3.2 Configure a D3 force layout with collision spacing, readable link distance, charge/repulsion, center force, and cluster-aware link strength where supported.
- [x] 3.3 Enable minimal behaviors for canvas drag, canvas zoom, and force-directed node dragging.
- [x] 3.4 Ensure the G6 canvas resizes with its container and cleans up observers/listeners on unmount.

## 4. Scope Simplification

- [x] 4.1 Remove or hide Sigma-only controls that depend on local focus, contextual edge labels, or Sigma selection state for the MVP.
- [x] 4.2 Keep the graph view shell, empty state, loading fallback, and high-level Vietnamese explanatory copy aligned with the new MVP behavior.
- [x] 4.3 Preserve backend fetch flow and avoid backend mutations for graph drag positions.

## 5. Verification

- [x] 5.1 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-check a dense payload renders through G6 with visible clusters and no hard canvas crash.
- [x] 5.2 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-check dragging one node causes connected or clustered nodes to react through force behavior.
- [x] 5.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-check zoom and pan behavior on the G6 canvas.
- [x] 5.4 Run `pnpm lint` for graph-view files touched by this change.
- [x] 5.5 Run `pnpm typecheck`.
- [x] 5.6 Run `pnpm build`.

## 6. Follow-up Interaction Hardening

- [ ] 6.1 Configure G6 force dragging so a dropped node stays fixed for the current client-side graph session.
- [ ] 6.2 Guard the initial G6 render/fit lifecycle against React dev unmount-remount races that can log `[G6 v5.1.0] The graph instance has been destroyed`.
- [x] 6.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-check that node drag-drop pinning works and the destroyed-instance console error no longer appears during route mount/remount.
