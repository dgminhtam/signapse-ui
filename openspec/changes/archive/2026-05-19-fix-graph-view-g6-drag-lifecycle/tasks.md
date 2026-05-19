## 1. Drag Pinning

- [x] 1.1 Update the G6 `drag-element-force` behavior so dropped nodes remain fixed for the current client-side graph session.
- [x] 1.2 Ensure the drag behavior still lets connected or clustered nodes react through the force layout while dragging.
- [x] 1.3 Confirm the fix does not introduce backend mutations or persisted node-position state.

## 2. G6 Lifecycle Hardening

- [x] 2.1 Schedule the initial G6 render through a cancellable browser task so immediate React cleanup can cancel stale work before `graph.render()` starts.
- [x] 2.2 Guard render, fit, resize, and cleanup paths with disposed/destroyed checks.
- [x] 2.3 Make cleanup idempotent and prevent stale cleanup from clearing a newer `graphRef.current`.
- [x] 2.4 Remove redundant viewport fit work where practical so only one guarded fit path runs after initial render.

## 3. Verification

- [x] 3.1 Run targeted lint for `app/(main)/graph-view/graph-view-canvas.tsx`.
- [x] 3.2 Run `pnpm typecheck`.
- [x] 3.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-check `/graph-view` in development mode: drag a node, release it, and verify it stays fixed.
- [x] 3.4 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-check mount/remount or route navigation and verify the console no longer logs `[G6 v5.1.0] The graph instance has been destroyed`.
