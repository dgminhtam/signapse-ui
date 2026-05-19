## 1. Sigma Integration

- [x] 1.1 Update graph view canvas initialization so `SigmaContainer` uses a multigraph-compatible graph instance or constructor instead of the default simple graph.
- [x] 1.2 Keep the existing `buildGraphModel` and `useLoadGraph` flow working with the multigraph runtime without changing current selection, camera, or settings behavior.

## 2. Regression Coverage

- [x] 2.1 Add a focused regression check for payloads that include repeated source-target pairs with distinct edge IDs and relation types.
- [x] 2.2 Verify that valid parallel edges remain independently addressable after the graph is loaded into the canvas.

## 3. Verification

- [x] 3.1 Run the relevant validation commands for the graph-view frontend change.
- [x] 3.2 Smoke-check graph view against a payload containing parallel edges and confirm the duplicate-edge runtime error no longer appears.
