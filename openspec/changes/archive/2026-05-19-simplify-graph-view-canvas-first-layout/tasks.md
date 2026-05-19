## 1. Workbench Simplification

- [x] 1.1 Remove the graph view hero title, subtitle, experiment badges, and external node-kind chips from `graph-view-workbench.tsx`.
- [x] 1.2 Remove the `Team clustering layout` explanatory block and external total count chips above the canvas.
- [x] 1.3 Remove the bottom `GraphMetric` cards and delete any now-unused metric component code.
- [x] 1.4 Remove edge-kind chips from outside the canvas while preserving the edge count data in `GraphModel`.
- [x] 1.5 Keep the empty graph state clear and visually aligned with the simplified canvas-first hierarchy.

## 2. Canvas HUD

- [x] 2.1 Extend `GraphViewCanvas` props to receive node counts and edge counts from `GraphModel`.
- [x] 2.2 Replace the top-left `D3 force layout` overlay and description with a compact `Biểu đồ tri thức` label.
- [x] 2.3 Render node-kind counts as a compact HUD inside the canvas at the top-right or right edge.
- [x] 2.4 Render the total `nút · cạnh` summary inside the canvas at the bottom-left.
- [x] 2.5 Render edge-kind counts as compact relation HUD chips inside the canvas at the bottom-right.
- [x] 2.6 Replace the textual recenter button with an icon-only control that has an accessible Vietnamese label.

## 3. Loading And Responsive States

- [x] 3.1 Update `GraphViewCanvasFallback` to mirror the new compact HUD structure.
- [x] 3.2 Update `GraphViewSkeleton` in `page.tsx` so it no longer reserves space for removed hero/cards.
- [x] 3.3 Check responsive behavior so HUD groups wrap or stack without hiding the graph on narrower screens.

## 4. Verification

- [x] 4.1 Run targeted lint for graph view files.
- [x] 4.2 Run project typecheck.
- [x] 4.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke test `/graph-view` visually: canvas is the dominant surface, HUD counts are in-canvas, recenter is icon-only, and removed cards no longer appear.
