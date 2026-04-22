## 1. Copy Integrity

- [x] 1.1 Audit all user-facing Vietnamese strings in `app/(main)/graph-view/page.tsx`, `graph-view-workbench.tsx`, and `graph-view-canvas.tsx`
- [x] 1.2 Restore corrupted graph-view copy so page shell, workbench, canvas overlays, and inspector text render as correct Vietnamese
- [x] 1.3 Verify that graph-view empty, access-denied, and detail states still use consistent professional Vietnamese copy after the restoration

## 2. Hover Stability

- [x] 2.1 Refactor graph-view hover ownership so transient hover feedback stays local to the canvas or other bounded surfaces
- [x] 2.2 Remove or reduce hover-driven shell and inspector text churn while preserving selection as the primary detail state
- [x] 2.3 Verify that node hover still highlights the local neighborhood and that selection-driven drill-down and inspector behavior remain intact

## 3. Verification

- [x] 3.1 Verify the graph-view workbench no longer appears to jump or reflow heavily while hovering across nodes
- [x] 3.2 Run `pnpm typecheck` and `pnpm build`
- [x] 3.3 Run targeted lint or equivalent validation for the changed graph-view files
