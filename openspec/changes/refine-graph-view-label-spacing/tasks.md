## 1. Label Priority Policy

- [x] 1.1 Add graph-view helpers or metadata for node label priority using node kind, link count, selected state, hover state, local-focus center, selected-edge endpoints, and dense-graph thresholds.
- [x] 1.2 Update the Sigma node reducer so global view no longer uses `forceLabel` for every visible node.
- [x] 1.3 Keep full titles forced for hovered, selected, dragged, local-focus center, and selected-edge endpoint nodes.
- [x] 1.4 Tune `labelDensity`, `labelGridCellSize`, and bounded label text so dense global graphs show useful labels without creating a text cloud.

## 2. Minimum Node Spacing

- [x] 2.1 Add a deterministic post-ForceAtlas2 spacing helper that computes a minimum distance from node sizes plus padding.
- [x] 2.2 Run the spacing helper after initial layout and before returning the graph model.
- [x] 2.3 Keep the spacing helper bounded with stable iteration counts and damped movement so the graph does not drift continuously.
- [x] 2.4 Verify identical or near-identical node positions are separated into distinct visible positions.

## 3. Drag Release Cleanup

- [x] 3.1 Add release-time collision cleanup for the dragged node without rerunning the full graph layout.
- [x] 3.2 Ensure drag cleanup remains local to the browser session and sends no backend mutation.
- [x] 3.3 Preserve camera panning disable/restore behavior during drag.

## 4. Verification

- [ ] 4.1 Smoke-check a dense graph around 100 nodes and confirm default view no longer forces every label.
- [ ] 4.2 Smoke-check hover and selection reveal full titles while keeping surrounding nodes readable.
- [ ] 4.3 Smoke-check node spacing and drag release behavior on crowded clusters.
- [x] 4.4 Run `pnpm lint` for graph-view files touched by this change.
- [x] 4.5 Run `pnpm typecheck`.
- [x] 4.6 Run `pnpm build`.
