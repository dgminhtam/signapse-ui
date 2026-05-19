## 1. Canvas Pan Bounds

- [x] 1.1 Replace the `drag-canvas` string behavior in `app/(main)/graph-view/graph-view-canvas.tsx` with an object behavior that sets a finite pan `range`.
- [x] 1.2 Add named constants for the canvas pan range and keep the value light enough that users can still inspect nearby clusters.
- [x] 1.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Verify panning still works within the allowed range and stops before drifting indefinitely into empty space.

## 2. Node Analysis Bounds

- [x] 2.1 Add a helper that computes frontend-only graph analysis bounds from the current canvas width and height.
- [x] 2.2 Add a small clamp helper that constrains node coordinates to the computed analysis bounds.
- [x] 2.3 Wire G6 node drag events so manually dragged nodes cannot move outside the analysis bounds while preserving `drag-element-force` fixed drop behavior.
- [x] 2.4 Guard drag-boundary logic against disposed or destroyed graph instances.
- [x] 2.5 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Verify dragging a node inside the bounds remains natural and dragging beyond the bounds stops at the nearest valid point.

## 3. Recenter Control

- [x] 3.1 Add a compact graph overlay button labeled `Đưa về trung tâm`.
- [x] 3.2 Wire the button to safely call the current G6 graph instance and animate back to the main graph workspace.
- [x] 3.3 Disable or no-op the recenter action when the graph instance is unavailable, disposed, or destroyed.
- [x] 3.4 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Verify the control does not interfere with canvas pan, zoom, or node drag gestures.

## 4. Verification

- [x] 4.1 Run targeted lint for the graph view canvas file.
- [x] 4.2 Run project typecheck.
- [x] 4.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke test `/graph-view` with a dense graph payload: pan, zoom, drag inside bounds, drag beyond bounds, and recenter.
