## 1. Contract Definitions

- [x] 1.1 Remove `theme` from `GraphViewNodeKind`, node kind Zod enum, and graph node id parser.
- [x] 1.2 Remove `event-theme` from `GraphViewEdgeKind` and edge kind Zod enum.
- [x] 1.3 Add `GraphViewNodeThemeMetadata` type/schema with `title` and `relationType`.
- [x] 1.4 Add optional `themes[]` metadata support to `GraphViewNodeMetadata` and `graphViewNodeMetadataSchema`.

## 2. Graph Runtime Mapping

- [x] 2.1 Update Graph View node and edge count orders to the current backend kind lists.
- [x] 2.2 Remove transition filters for `theme` nodes and `event-theme` edges from `buildGraphModel()`.
- [x] 2.3 Remove theme node visual configuration and event-theme edge visual configuration.
- [x] 2.4 Remove theme/event-theme layout constants and priority label handling from the canvas runtime.

## 3. Inspector And Copy

- [x] 3.1 Render compact `metadata.themes[]` theme metadata on event node details.
- [x] 3.2 Render compact `metadata.themes[]` theme metadata on narrative node details.
- [x] 3.3 Keep theme metadata out of graph relation counts, quick-detail actions, and selectable graph topology.
- [x] 3.4 Update English and Vietnamese Graph View dictionary entries to remove obsolete topology labels and add any needed theme metadata inspector labels.

## 4. Documentation And Verification

- [x] 4.1 Confirm `docs/APIMAPPING.md` matches the implemented graph-view node/edge kinds and `metadata.themes[]` behavior.
- [x] 4.2 Run `openspec validate sync-graph-view-theme-metadata-contract`.
- [x] 4.3 Run `pnpm typecheck`.
- [x] 4.4 Run `pnpm lint`.
- [x] 4.5 Run a static search for stale Graph View `theme` / `event-theme` topology references in `app/lib/graph-view`, `app/[lang]/(main)/graph-view`, and graph-view dictionary entries.
