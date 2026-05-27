## 1. Hover Label Behavior

- [x] 1.1 Remove the React-rendered node hover tooltip surface and its dedicated hover tooltip state.
- [x] 1.2 Track hovered node identity only for graph label/state updates and clear it on pointer leave, drag start, canvas click, and graph teardown.
- [x] 1.3 Expand the hovered node's in-canvas label to the fuller node title while keeping normal labels bounded.
- [x] 1.4 Ensure hover label expansion does not restart force layout, persist node positions, or interfere with node dragging.

## 2. Label Visual Treatment

- [x] 2.1 Remove heavy default label background boxes from graph node labels.
- [x] 2.2 Add graph-local light and dark mode text contrast treatment using label fill, stroke/halo, font weight, opacity, or restrained shadow without modifying global theme tokens.
- [x] 2.3 Define normal, hovered, and non-hovered label styles so hovered labels are clearest and non-hovered visible labels preserve context.
- [x] 2.4 Keep icon-only control tooltips unchanged.

## 3. Click Inspector Compatibility

- [x] 3.1 Preserve click-to-select and click-to-open node inspector behavior.
- [x] 3.2 Ensure hover does not open an inspector, tooltip, hover card, or page-level detail surface.
- [x] 3.3 Ensure selecting a node and clearing selection still update related-node and related-edge emphasis correctly.

## 4. Verification

- [x] 4.1 Run `openspec validate replace-graph-node-tooltips-with-hover-labels`.
- [x] 4.2 Run a static search confirming the removed node tooltip surface/state is gone while graph control tooltips remain.
- [x] 4.3 Run `pnpm lint` or the narrowest available lint command for the changed Graph View file.
- [x] 4.4 Run `pnpm typecheck`.

User-owned manual QA note: verify visually in light and dark mode that hover labels remain readable and do not feel like popup cards.
