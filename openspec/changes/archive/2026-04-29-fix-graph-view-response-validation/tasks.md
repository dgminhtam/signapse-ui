## 1. Graph-view parsing boundary

- [x] 1.1 Update `app/lib/graph-view/definitions.ts` so optional node metadata fields observed as `null` in the real backend payload are accepted at the Zod and TypeScript boundary.
- [x] 1.2 Keep `graphViewResponseSchema` strict for required graph structure and add a narrow regression check that confirms valid payloads with nullable metadata still parse successfully.
- [x] 1.3 Update `app/api/graph-view/action.ts` so true validation failures log bounded, readable diagnostic details instead of dumping the full issue array.

## 2. Graph-view UI compatibility

- [x] 2.1 Review `app/(main)/graph-view/*` for direct assumptions about metadata string or boolean presence and add only the null-safe guards needed to keep the browse surface stable.
- [x] 2.2 Verify the node detail panel continues to omit empty metadata rows and hides the outbound source-link action when `metadata.url` is absent or `null`.

## 3. Verification and rollout tracking

- [x] 3.1 Verify `/graph-view` against a real backend payload that includes nullable metadata across `event`, `asset`, `theme`, and `source-document` nodes.
- [x] 3.2 Re-run the graph-view implementation checks for the changed scope and note any unrelated blockers if they prevent a fully green pass.
- [x] 3.3 Update the existing graph-view rollout tracking under `openspec/changes/add-graph-view-browse/tasks.md` once the real-payload verification path is complete.

Verification note: `node --experimental-strip-types scripts/check-graph-view-response-validation.ts`, `pnpm typecheck`, scoped `pnpm lint`, and `pnpm build` all passed on April 21, 2026. The runtime payload check uses a fixture distilled from the real backend response shape that reproduced nullable metadata across `event`, `asset`, `theme`, and `source-document` nodes.
