## 1. Canvas-first hierarchy

- [x] 1.1 Rework the `graph-view` workbench layout so the graph canvas becomes the dominant above-the-fold exploration surface
- [x] 1.2 Move legend, helper copy, and graph metrics into secondary or progressively revealed regions that no longer compete equally with the canvas
- [x] 1.3 Refine the default right-side panel state into a compact overview and exploration-control inspector instead of a fixed stack of equal-weight cards

## 2. Motion and interaction polish

- [x] 2.1 Add a brief settle-on-load orientation motion that stabilizes into a readable browsing state after the graph becomes interactive
- [x] 2.2 Refine camera-driven actions such as reset and focus so viewport changes preserve spatial context with smoother transitions
- [x] 2.3 Soften hover and selection feedback so emphasis changes feel more deliberate and less abrupt while preserving graph readability

## 3. Focus and readability controls

- [x] 3.1 Implement a client-side local focus mode around the selected node using the existing graph payload and topology
- [x] 3.2 Add a compact neighborhood-depth control for local focus mode together with a clear path back to the full graph
- [x] 3.3 Make edge labels and secondary graph detail contextual so dense metadata is revealed only when interaction or readability state calls for it

## 4. Inspector refinement and responsive verification

- [x] 4.1 Refactor the side panel into stateful inspector modes for browse overview, node selection, edge selection, and focus management
- [ ] 4.2 Verify the refined graph-view experience on desktop and narrow layouts for canvas hierarchy, inspector behavior, clutter reduction, and bounded motion quality
- [x] 4.3 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` after the refinement changes
