## 1. Graph-view contract and dependencies

- [x] 1.1 Add the graph visualization dependencies needed for the chosen stack, including `sigma`, `graphology`, `@react-sigma/core`, and the graphology layout package used for client-side positioning.
- [x] 1.2 Add `app/lib/graph-view/definitions.ts` with Zod-backed graph-view request/response parsing for nodes, edges, metadata, and entity identifier extraction from graph node IDs.
- [x] 1.3 Add `app/lib/graph-view/permissions.ts` with `graph-view:read` navigation and route helpers aligned with the repo's existing permission pattern.
- [x] 1.4 Add `app/api/graph-view/action.ts` with an authenticated `getGraphView()` helper that loads `GET /graph-view` and validates the runtime payload.

## 2. Protected route shell and navigation

- [x] 2.1 Add the protected `/graph-view` route under `app/(main)/graph-view/page.tsx` with the repo-standard `Card` shell, `CardHeader`, `CardDescription`, `Separator`, and `Suspense` boundary.
- [x] 2.2 Add `app/(main)/graph-view/error.tsx` and a skeleton/empty-state treatment that matches the final graph page layout closely enough to avoid layout shift.
- [x] 2.3 Update `config/site.ts` so the protected navigation exposes `Biểu đồ tri thức` at `/graph-view` only for users who satisfy `graph-view:read`.

## 3. Graph canvas and browse interactions

- [x] 3.1 Add a client graph workbench component that maps backend `nodes[]` and `edges[]` into a graphology graph and mounts the Sigma-based canvas inside the protected route.
- [x] 3.2 Implement the client-owned layout lifecycle by seeding initial node positions, running the force-directed layout, and freezing or settling the graph once it becomes browse-ready.
- [x] 3.3 Implement graph viewport interactions for pan, zoom, and initial fit-to-view behavior.
- [x] 3.4 Implement hover highlighting so a hovered node emphasizes its immediate neighborhood and de-emphasizes unrelated graph elements.
- [x] 3.5 Implement node and edge selection with a detail panel that renders labels, kinds, metadata, relation semantics, and lightweight summaries directly from the graph-view payload.
- [x] 3.6 Apply frontend-owned visual treatment so node kinds and edge kinds remain distinguishable during graph browsing.

## 4. Permission-aware drill-down and graph semantics

- [x] 4.1 Reuse existing event and source-document permission helpers so the graph detail panel can decide when drill-down links should be interactive.
- [x] 4.2 Provide detail-panel navigation from `event` nodes to `/events/{id}` only when the current user has `event:read`.
- [x] 4.3 Provide detail-panel navigation from `source-document` nodes to `/source-documents/{id}` only when the current user has `source-document:read`.
- [x] 4.4 Keep `asset` and `theme` nodes browse-only in v1 by rendering local metadata summaries without requiring a dedicated frontend detail route.
- [x] 4.5 Preserve graph contract semantics by rendering edge direction from `sourceNodeId` and `targetNodeId` without inferring or reversing direction from `relationType`.

## 5. Documentation and verification

- [x] 5.1 Update `docs/APIMAPPING.md` so `/graph-view` is marked as implemented in the frontend and the new graph-view files are listed in the mapping document.
- [ ] 5.2 Verify the route against a local backend payload, including permission gating, empty state, populated graph rendering, hover highlight, selection panel behavior, and permission-aware drill-down affordances.
- [x] 5.3 Run lint and typecheck for the changed scope, and note any unrelated pre-existing issues if they block a fully green verification pass.

Verification note: the nullable-metadata parsing bug was fixed on April 21, 2026, and `node --experimental-strip-types scripts/check-graph-view-response-validation.ts` now passes against a runtime sample distilled from the real backend payload across `event`, `asset`, `theme`, and `source-document` nodes. Task `5.2` remains open until authenticated route-level verification covers permission gating and interactive graph behavior end to end.
