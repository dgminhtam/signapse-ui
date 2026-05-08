## 1. Contract Schema Alignment

- [x] 1.1 Update `GraphViewEdgeKind`, `graphViewEdgeKindSchema`, and edge label mappings in `app/lib/graph-view/definitions.ts` from `source-artifact-event` to `news-article-event`.
- [x] 1.2 Confirm Graph View node kind schema remains aligned with backend node kinds `event`, `asset`, `theme`, and `news-article`.

## 2. Graph View Rendering Alignment

- [x] 2.1 Update Graph View model/count ordering in `graph-view-workbench.tsx` to use `news-article-event`.
- [x] 2.2 Update Graph View canvas HUD edge kind ordering and any edge kind checks in `graph-view-canvas.tsx` to use `news-article-event`.
- [x] 2.3 Update Graph View visual style mapping in `graph-view-visuals.ts` so `news-article-event` edges keep the intended evidence-to-event styling.

## 3. Validation Diagnostics And Documentation

- [x] 3.1 Improve `getGraphView()` validation logging if needed so failed validation reports summarized issue paths, codes, and messages without logging the full payload.
- [x] 3.2 Update `docs/APIMAPPING.md` Graph View notes to list `news-article-event` as the current backend edge kind and remove current-contract references to `source-artifact-event`.

## 4. Verification

- [x] 4.1 Run focused lint/typecheck for the touched Graph View modules.
- [ ] 4.2 Smoke-check `/graph-view` against the current backend payload and confirm the validation error no longer appears.
- [x] 4.3 Confirm the in-canvas relationship count and edge styling still display evidence-to-event relationships correctly.

Note: Task 4.2 still needs a browser/backend session with Clerk auth. This thread has no attached dev-server terminal, so the implementation was verified with focused lint, full typecheck, and static graph surface checks.
