## 1. Label Readability

- [x] 1.1 Add graph-view label helpers that produce short bounded labels and preserve full labels for hover or selection states.
- [x] 1.2 Store short and full label attributes on graph nodes when building the graph model.
- [x] 1.3 Update Sigma node reducer/settings so visible nodes show bounded labels by default and reveal full titles on hover, selection, and local-focus center.

## 2. Hover And Focus Treatment

- [x] 2.1 Add a custom Sigma node hover drawing treatment for halo or shadow emphasis using canvas drawing APIs.
- [x] 2.2 Soften node dimming while keeping secondary edge dimming strong enough to reduce clutter.
- [x] 2.3 Verify hover, selected node, selected edge endpoint, and local-focus states remain visually distinct without hiding too much context.

## 3. Drag Interaction

- [x] 3.1 Add drag state for nodes using Sigma node and pointer events.
- [x] 3.2 Update node `x` and `y` graph attributes during drag without rerunning full layout.
- [x] 3.3 Temporarily disable camera panning while a node is being dragged, then restore it after release or pointer cancellation.
- [x] 3.4 Add cursor or lightweight visual feedback for draggable and dragging states.

## 4. Layout And Motion

- [x] 4.1 Tune ForceAtlas2 settings for stronger anti-overlap spacing while keeping bounded iteration counts.
- [x] 4.2 Keep settle-on-load and camera motion short, purposeful, and disabled for reduced-motion users.
- [x] 4.3 Confirm drag does not trigger layout churn or move other nodes unexpectedly.

## 5. Verification

- [x] 5.1 Run `pnpm lint` for graph-view files touched by this change.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm build`.
- [ ] 5.4 Smoke-check graph view with a dense payload for default labels, hover full titles, drag behavior, anti-overlap, and reduced-motion fallback where possible.
