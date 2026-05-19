## 1. Render Readiness

- [x] 1.1 Inspect current graph render scheduling and selection state effect in `graph-view-canvas.tsx`.
- [x] 1.2 Add a render-ready signal that flips only after `graph.render()` completes successfully.
- [x] 1.3 Reset render-ready tracking during cleanup and graph re-creation.

## 2. Selection State Application

- [x] 2.1 Skip selection-state writes when there is no selected node and no previous selection state to clear.
- [x] 2.2 Gate selection-state writes on render readiness and live graph instance checks.
- [x] 2.3 Preserve clear-selection behavior after a real selection has been applied.

## 3. Batched G6 Update

- [x] 3.1 Refactor selected node and edge state computation into a single batched state object.
- [x] 3.2 Replace per-element `setElementState()` calls with one batched `graph.setElementState()` call.
- [x] 3.3 Handle rejected G6 state update promises without crashing after graph teardown.

## 4. Regression Checks

- [x] 4.1 Verify initial graph load with no selection does not call selection state before render readiness.
- [x] 4.2 Verify selecting a node still highlights direct relations and opens the inspector.
- [x] 4.3 Verify clearing selection removes selection-specific graph states.
- [x] 4.4 Run lint for touched graph-view files.
- [x] 4.5 Run typecheck.
