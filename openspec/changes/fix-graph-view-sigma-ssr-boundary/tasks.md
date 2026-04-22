## 1. Render Boundary

- [x] 1.1 Extract Sigma and WebGL-dependent rendering into a dedicated client-only graph-view canvas module
- [x] 1.2 Update the graph-view page and workbench composition so the server render path no longer imports Sigma directly
- [x] 1.3 Load the graph canvas through `next/dynamic` with `ssr: false` and a bounded fallback that matches the canvas footprint

## 2. Behavior Preservation

- [x] 2.1 Reconnect existing graph data, hover, selection, focus, and inspector flows across the new shell-to-canvas boundary
- [x] 2.2 Preserve the current empty, loading, and browse interaction behavior after the client-only canvas hydrates
- [x] 2.3 Ensure the protected route shell, permission gating, and page framing remain unchanged outside the canvas boundary

## 3. Verification

- [x] 3.1 Verify `/graph-view` no longer triggers `WebGL2RenderingContext is not defined` during server rendering
- [x] 3.2 Run `pnpm typecheck` and `pnpm build`
- [x] 3.3 Run targeted lint or equivalent validation for the changed `graph-view` files
