## 1. Contract And Parsing

- [x] 1.1 Update Graph View node and edge kind types/schemas to accept `warm-episode`, `asset-warm-episode`, and `warm-episode-event`.
- [x] 1.2 Add optional Graph View metadata fields for `periodStart`, `periodEnd`, and `knowledgeLayer`.
- [x] 1.3 Update Graph View node id parsing so `warm-episode:{id}` is recognized as a warm episode entity reference.

## 2. Graph Rendering

- [x] 2.1 Add warm episode node and edge kinds to Graph View model count ordering.
- [x] 2.2 Add localized visual mappings for warm episode nodes and relationships without changing existing node/edge treatments.
- [x] 2.3 Include warm episode nodes and relationships in HUD summaries.
- [x] 2.4 Keep warm episode nodes clustered near linked events or assets using existing graph relationship context.

## 3. Inspector And Localization

- [x] 3.1 Show warm episode period start, period end, knowledge layer, confidence, and relation summary in the node inspector when present.
- [x] 3.2 Keep warm episode nodes browse-only by omitting unavailable detail route actions.
- [x] 3.3 Add English and Vietnamese dictionary labels for warm episode node/edge kinds and inspector metadata.
- [x] 3.4 Update dictionary typing if required by the added labels.

## 4. Verification

- [x] 4.1 Run `openspec.cmd validate sync-graph-view-warm-episodes --strict`.
- [x] 4.2 Run `pnpm.cmd typecheck`; when blocked by the current `pnpm-workspace.yaml`, run `.\node_modules\.bin\tsc.cmd --noEmit`.
- [x] 4.3 Run `pnpm.cmd lint`; when blocked by the current `pnpm-workspace.yaml`, run `.\node_modules\.bin\eslint.cmd`.
- [x] 4.4 Run a static search for `warm-episode`, `asset-warm-episode`, `warm-episode-event`, `periodStart`, `periodEnd`, and `knowledgeLayer` to confirm all expected Graph View surfaces are covered.
