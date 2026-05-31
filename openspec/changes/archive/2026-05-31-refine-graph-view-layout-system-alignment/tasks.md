## 1. Workspace Containment

- [x] 1.1 Audit Graph View route, workbench, canvas, and skeleton wrappers for page-level overflow, min-width, height, and absolute positioning sources.
- [x] 1.2 Constrain the populated Graph View route to the available app viewport and remove unintended horizontal document overflow.
- [x] 1.3 Update loading and empty states so their skeleton/surface dimensions mirror the bounded canvas-first workspace.

## 2. Canvas HUD Hierarchy

- [x] 2.1 Separate zoom, recenter, and comparable graph actions into a compact icon-only canvas tool dock with accessible Vietnamese labels.
- [x] 2.2 Keep top-left canvas identity minimal and ensure node-kind counts remain compact and secondary to the graph.
- [x] 2.3 Reduce relationship-count visual weight or move it behind a compact in-canvas legend affordance without restoring external cards.
- [x] 2.4 Adjust total node/edge summary placement and emphasis so it reads as low-priority status.

## 3. Label And Readability Policy

- [x] 3.1 Tighten default label eligibility so dense graphs prioritize assets, themes, narratives, high-connectivity nodes, and interaction-focused nodes.
- [x] 3.2 Preserve full-title reveal and related-context emphasis for hover, selection, drag, and quick-detail flows.
- [x] 3.3 Tune label background/halo treatment so labels remain readable in dark mode without visually dominating nodes and edges.

## 4. System Alignment

- [x] 4.1 Align Graph View local controls, chips, and surfaces with shadcn wrapper usage and semantic-token guardrails without editing `components/ui/*`.
- [x] 4.2 Normalize Graph View breadcrumb/page identity so it matches the sidebar navigation hierarchy.
- [x] 4.3 Confirm no global theme, sidebar, chart, or shadcn primitive tokens are changed for this local graph refinement.

## 5. Verification

- [x] 5.1 Run targeted lint for touched Graph View, dictionary, and layout files.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run OpenSpec validation/status for `refine-graph-view-layout-system-alignment`.
- [x] 5.4 Run static search or deterministic review to confirm removed external Graph View cards/copy do not return and icon controls have accessible labels.

User-owned manual QA: reload `/vi/graph-view` in light and dark mode against real backend graph data and confirm the page has no browser horizontal scroll, labels feel less crowded, and the HUD stays visually secondary to the canvas.
