## 1. Contract Schema Alignment

- [x] 1.1 Add `narrative` to `GraphViewNodeKind`, `graphViewNodeKindSchema`, and graph node id parsing in `app/lib/graph-view/definitions.ts`.
- [x] 1.2 Add `narrative-event` and `narrative-asset` to `GraphViewEdgeKind` and `graphViewEdgeKindSchema`.
- [x] 1.3 Add `narrativeStatus` and `thesis` to `GraphViewNodeMetadata` and its Zod schema.

## 2. Graph View Presentation

- [x] 2.1 Add localized dictionary labels for narrative node kind, narrative edge kinds, and narrative inspector fields in Vietnamese and English dictionaries.
- [x] 2.2 Add narrative node and edge visual mappings in `graph-view-visuals.ts`.
- [x] 2.3 Update Graph View workbench node and edge count ordering to include narrative kinds.
- [x] 2.4 Update Graph View canvas HUD ordering, label priority, inspector fields, and quick-detail action handling for narrative nodes.
- [x] 2.5 Update graph clustering logic so narrative nodes inherit useful clusters from connected assets or events.

## 3. Documentation

- [x] 3.1 Update `docs/APIMAPPING.md` Graph View notes to document `narrative`, `narrative-event`, `narrative-asset`, `narrativeStatus`, and `thesis`.
- [x] 3.2 Note that `docs/api_mapping.json` is stale for narrative graph kinds unless a refreshed backend OpenAPI snapshot is available.

## 4. Verification

- [x] 4.1 Run focused lint for touched Graph View, dictionary, and contract files.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run static search to confirm runtime Graph View code has no stale narrative-kind omissions or legacy `source-artifact-event` references.
- [x] 4.4 Run OpenSpec validation/status for `support-graph-view-narratives`.

User-owned manual QA: reload `/graph-view` against the current backend payload and confirm the validation error disappears and narrative nodes/edges appear in the canvas HUD/graph.
