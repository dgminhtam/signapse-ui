## Context

Graph View response validation now fails with many `nodes[].kind` enum errors. The frontend diagnostic shows the first failures at `nodes[205].kind`, and backend source in `D:\Github\signapse` confirms the runtime graph contract has grown beyond the current OpenAPI snapshot:

- `GraphNodeKind.NARRATIVE` serializes as `narrative`.
- `GraphEdgeKind.NARRATIVE_EVENT` serializes as `narrative-event`.
- `GraphEdgeKind.NARRATIVE_ASSET` serializes as `narrative-asset`.
- Narrative node metadata includes `narrativeStatus`, `confidence`, `thesis`, and `slug`.

The frontend already treats Graph View as a strict validated contract, which is good: the screen fails early instead of letting G6 render unknown graph data. This change updates the strict contract to match the backend runtime shape and gives narratives a first-class, lightweight visual treatment.

## Goals / Non-Goals

**Goals:**

- Accept `narrative` nodes in Graph View response validation.
- Accept `narrative-event` and `narrative-asset` edges in Graph View response validation.
- Preserve narrative metadata fields needed for the node inspector: `narrativeStatus` and `thesis`.
- Add localized node and edge labels for narratives in Vietnamese and English.
- Render narratives in the G6 canvas, HUD counts, and relationship styling without breaking existing event, asset, theme, and news article behavior.
- Update API mapping notes so the frontend contract ledger matches backend runtime.

**Non-Goals:**

- Do not add a narrative detail page, route, drawer, or quick-detail action.
- Do not redesign graph layout or interaction behavior.
- Do not change backend code, permissions, endpoint names, or response generation.
- Do not introduce compatibility for removed legacy `source-document` graph kinds.

## Decisions

1. Add narratives as a canonical Graph View node kind.

   Rationale: Backend now emits narrative nodes with stable ids like `narrative:{id}`. Treating them as first-class nodes keeps validation strict and lets the graph show the extra semantic layer instead of dropping data.

   Alternative considered: Filter unknown nodes before validation. This would hide useful graph data and could leave dangling narrative edges unless the frontend also filtered related edges. It also weakens the contract boundary.

2. Render narratives with a distinct neutral/violet visual treatment.

   Rationale: Existing graph colors already communicate event, asset, theme, and news article categories. Narratives are a higher-order interpretation layer, so they should be visually distinct without overpowering asset/theme anchors.

   Alternative considered: Reuse the event color. That would be simpler, but narratives and events have different meaning and should remain scannable.

3. Keep narrative click behavior local to the canvas inspector.

   Rationale: There is no confirmed frontend narrative detail surface in this scope. The existing inspector can show title, slug, status, confidence, thesis, and relation counts without inventing a route.

   Alternative considered: Add a `/narratives/{id}` route or quick detail drawer. That would be a new product surface and needs separate UX/API work.

4. Cluster narratives through their connected asset/theme/event relationships.

   Rationale: Narrative nodes connect to events and assets. Existing clustering already anchors events to asset/theme clusters and lets related article nodes inherit event clusters. Narratives should participate similarly so they do not float as isolated noise.

   Alternative considered: Give each narrative its own cluster. This keeps implementation tiny but can fragment the layout and reduce the "team clustering" effect the user wants.

5. Update docs from backend runtime, not only `docs/api_mapping.json`.

   Rationale: The OpenAPI snapshot is stale for narrative graph kinds. The immediate source of truth for this runtime failure is the backend implementation currently running locally.

## Risks / Trade-offs

- [OpenAPI snapshot remains stale] -> Document the runtime contract in `docs/APIMAPPING.md` and avoid regenerating `docs/api_mapping.json` unless the backend snapshot is refreshed.
- [Narratives increase graph density] -> Keep labels priority-based and rely on existing hover/inspector behavior rather than forcing every narrative label visible.
- [No narrative detail route exists] -> Show narrative metadata locally and intentionally omit quick-detail navigation for narrative nodes.
- [Cluster behavior may need tuning once real data volume is visible] -> Implement the simplest relationship inheritance first and leave visual tuning for a later UX refinement if needed.

## Migration Plan

1. Extend frontend Graph View types, Zod schemas, id parsing, and metadata definitions for narrative nodes and edges.
2. Add dictionary labels and visual maps for narrative node/edge kinds.
3. Update Graph View model count order, HUD order, canvas data mapping, inspector metadata fields, and clustering helpers.
4. Update `docs/APIMAPPING.md` Graph View notes with the runtime narrative contract.
5. Run focused lint/typecheck and static searches for stale graph kind assumptions.

Rollback is a normal frontend revert. If backend stops returning narratives, the expanded schema remains harmless because existing graph kinds still validate and render.
