## Context

`docs/api_mapping.json` now describes `GET /graph-view` as returning a new `warm-episode` node kind, two new relationship edge kinds, and metadata fields that distinguish hot versus warm knowledge layers. The current Graph View frontend schema, count records, visuals, localization, and inspector only cover event, asset, theme, news article, and narrative nodes. Because `getGraphView()` validates the backend response before rendering, any returned warm episode kind can currently block the entire graph.

## Goals / Non-Goals

**Goals:**

- Keep Graph View compatible with the latest backend contract.
- Render warm episode nodes and relationships using existing graph canvas mechanics.
- Show useful local metadata for warm episodes from the graph payload: layer, period start/end, and confidence when present.
- Keep the change small and scoped to Graph View contract/rendering/localization.

**Non-Goals:**

- Add a warm episode detail route, quick detail drawer, or new backend fetch.
- Redesign the Graph View workspace, controls, or layout engine.
- Change existing event, asset, theme, news article, or narrative behavior beyond what is needed for compatibility.

## Decisions

1. **Treat warm episodes as browse-only graph nodes.**
   - Rationale: The backend snapshot only exposes them through `/graph-view`; no canonical frontend detail route exists yet.
   - Alternative considered: Add route-style drill-down. Rejected because it would require API and navigation behavior outside this contract sync.

2. **Extend strict known-kind validation instead of loosening kind parsing to arbitrary strings.**
   - Rationale: The frontend still benefits from catching unexpected backend drift while accepting confirmed new contract values.
   - Alternative considered: Use broad `z.string()` for node/edge kinds. Rejected because it would hide future contract drift and weaken type-driven UI coverage.

3. **Render warm episode visuals alongside existing node/edge mappings.**
   - Rationale: Existing visual maps are the single place that drives localized labels, colors, sizes, HUD chips, and canvas styling.
   - Alternative considered: Reuse `event` visuals. Rejected because operators need to distinguish hot event nodes from warm episode summaries.

4. **Cluster warm episodes through existing relationship context.**
   - Rationale: Warm episodes should stay near their linked events or assets instead of appearing as unrelated graph noise.
   - Alternative considered: Add a separate warm layer layout. Rejected as too large for this sync and likely to disturb current graph behavior.

## Risks / Trade-offs

- **Risk:** The backend may use a node id pattern other than `warm-episode:{id}`. -> **Mitigation:** Accept the confirmed kind in schema, parse the expected id prefix for entity references, and keep route actions absent if parsing fails.
- **Risk:** Adding another HUD chip can crowd the canvas on small viewports. -> **Mitigation:** Reuse the existing wrapping HUD chip behavior without adding a new persistent control surface.
- **Risk:** `knowledgeLayer` may be absent on some nodes. -> **Mitigation:** Treat metadata fields as optional/nullish and render inspector rows only when meaningful values exist.
- **Risk:** Visual color additions can make the graph palette noisy. -> **Mitigation:** Add one restrained warm episode node treatment and two relationship treatments without changing existing palette assignments.
