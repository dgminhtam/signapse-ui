## 1. Theme-Aware Canvas Readability

- [x] 1.1 Inspect current graph canvas label, node, edge, and HUD styling in light and dark mode.
- [x] 1.2 Add graph-view-local light/dark palette values for canvas labels, label backing or outline, hover title, active state, highlight state, and inactive state.
- [x] 1.3 Wire the graph canvas to the resolved theme without modifying global theme tokens or shadcn primitives.
- [x] 1.4 Ensure visible node labels use readable text treatment in both light and dark mode.

## 2. Hover Spotlight State

- [x] 2.1 Add G6 node and edge state styles for hovered, related-highlighted, and unrelated-inactive visual states.
- [x] 2.2 Add node-only hover activation using G6 behavior or pointer events with first-degree relationship scope.
- [x] 2.3 Ensure hover state updates do not mutate graph data, restart the force layout, change node radius, or affect drag/pan/zoom behavior.
- [x] 2.4 Keep unrelated elements softly dimmed instead of hidden or near-invisible.

## 3. Full-Title Hover Surface

- [x] 3.1 Add local hover title state for the currently hovered node.
- [x] 3.2 Render a compact in-canvas DOM tooltip with the full node title and optional node kind context.
- [x] 3.3 Position the hover title near the node or pointer while keeping it inside the canvas when practical.
- [x] 3.4 Hide the hover title on pointer leave, graph unmount, and drag start.

## 4. Verification

- [x] 4.1 Run lint for `app/(main)/graph-view/graph-view-canvas.tsx` and any touched graph-view files.
- [x] 4.2 Run typecheck.
- [x] 4.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke test `/graph-view` in light mode: hover shows full title, related elements are emphasized, unrelated context remains visible, drag/pan/zoom still work.
- [x] 4.4 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke test `/graph-view` in dark mode: labels and hover title remain readable and hover does not make the canvas visually muddy.
