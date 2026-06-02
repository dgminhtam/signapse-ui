## 1. Restore Core Graph Behavior

- [x] 1.1 Restore graph-level animation so dense graph payloads do not disable animation solely due to node or edge count.
- [x] 1.2 Restore `hover-activate` behavior for all graph sizes so hover dim/focus remains behavior-equivalent to the previous graph.
- [x] 1.3 Restore force layout tuning constants that affect drag reaction and linked-node motion unless a change is proven behavior-equivalent.
- [x] 1.4 Preserve `BoundedDragElementForce` registration and `fixed: true` drag behavior for all graph sizes.

## 2. Keep Behavior-Safe Optimizations Only

- [x] 2.1 Keep or add adjacency-map cluster lookup optimization where it does not change graph behavior.
- [x] 2.2 Keep label budget optimization only if hidden labels still reveal full title on hover or selection.
- [x] 2.3 Keep default visual-cost optimization only if hovered, selected, and related graph emphasis remains visually equivalent.
- [x] 2.4 Remove dense-graph branches that disable hover, animation, force reaction, drag, or selection behavior.

## 3. Preserve Interaction Surface

- [x] 3.1 Confirm node drag moves the dragged node and keeps linked force reaction behavior.
- [x] 3.2 Confirm hover still dims or recedes unrelated graph context while emphasizing related nodes and edges.
- [x] 3.3 Confirm click selection, selected-node inspector, canvas-click clearing, and quick detail actions remain available.
- [x] 3.4 Confirm graph optimization does not introduce separate node tooltip or hover card for title reveal.

## 4. Verification

- [x] 4.1 Run `openspec validate preserve-graph-view-behavior-during-performance-optimization`.
- [x] 4.2 Run static comparison against the previous working Graph View behavior points: `animation: true`, always-attached `hover-activate`, old force layout constants, and always-attached bounded drag.
- [x] 4.3 Run static search confirming no dense-graph branch disables hover, animation, drag, or force layout behavior.
- [x] 4.4 Run `pnpm typecheck`.
- [x] 4.5 Run `pnpm lint` or document unrelated pre-existing lint blockers if the command fails outside Graph View. Note: `pnpm lint` ran and failed on unrelated existing `components/logo.tsx` error; Graph View has no lint error.

User-owned manual QA note: verify drag, hover dim/focus, and motion feel in the browser against the previous working Graph View experience.
