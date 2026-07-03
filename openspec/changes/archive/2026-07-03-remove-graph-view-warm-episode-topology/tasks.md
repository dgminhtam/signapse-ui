## 1. Contract Alignment

- [x] 1.1 Remove `warm-episode` from Graph View node types, Zod enums, and node id parsing.
- [x] 1.2 Remove `asset-warm-episode` and `warm-episode-event` from Graph View edge types and Zod enums.
- [x] 1.3 Keep current metadata fields, including `knowledgeLayer` and `themes[]`, accepted by `GraphNodeMetadata`.

## 2. Graph View Runtime

- [x] 2.1 Remove warm episode from Graph View node and edge count orders.
- [x] 2.2 Remove warm episode visuals, edge visuals, labels, and layout hierarchy branches.
- [x] 2.3 Remove warm episode-specific inspector rows and browse-only handling.
- [x] 2.4 Confirm graph layout still uses the current asset, narrative, event, and news article hierarchy.

## 3. Documentation And Specs

- [x] 3.1 Update `docs/APIMAPPING.md` to match the live `/graph-view` contract.
- [x] 3.2 Update any active or main OpenSpec wording touched by this change so warm episode is not documented as current Graph View topology.
- [x] 3.3 Run a static search for `warm-episode`, `asset-warm-episode`, and `warm-episode-event` to confirm remaining references are historical/archive-only or intentionally out of Graph View runtime.

## 4. Verification

- [x] 4.1 Run `openspec.cmd validate remove-graph-view-warm-episode-topology --strict`.
- [x] 4.2 Run `pnpm.cmd typecheck`.
- [x] 4.3 Run `pnpm.cmd lint`.
