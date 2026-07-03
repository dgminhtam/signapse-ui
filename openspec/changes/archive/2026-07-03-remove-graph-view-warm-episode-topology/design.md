## Context

The live backend OpenAPI contract at `GET /graph-view` now exposes Graph View topology as:

- `GraphNode.kind`: `event`, `asset`, `news-article`, `narrative`
- `GraphEdge.kind`: `event-asset`, `news-article-event`, `narrative-event`, `narrative-asset`

`GraphNodeMetadata.knowledgeLayer` still exists with `HOT` / `WARM`, but warm episode is no longer a graph node or edge family. Frontend code and OpenSpec still contain warm episode topology from the prior contract.

## Goals / Non-Goals

**Goals:**

- Make frontend Graph View validation strict to the current backend topology.
- Remove warm episode topology from Graph View rendering, counts, layout, visuals, and inspector behavior.
- Keep non-topology metadata such as `knowledgeLayer` and `themes[]` where the backend still returns it.
- Update API mapping and specs so they describe the same contract the runtime accepts.

**Non-Goals:**

- Do not add a historical/warm layer view, toggle, BubbleSets, hulls, or combo clustering.
- Do not change backend endpoints, permissions, or response generation.
- Do not remove `knowledgeLayer` metadata unless the backend contract removes it separately.

## Decisions

### Remove warm at the schema boundary

`GraphViewNodeKind`, `GraphViewEdgeKind`, their Zod enums, and graph node id parsing should stop accepting warm episode topology. This keeps the FE/BE contract boundary honest and fails fast if stale payloads return.

Alternative considered: keep accepting warm and filter in `buildGraphModel()`. That is smaller visually but worse contract hygiene because invalid backend topology would silently disappear.

### Delete warm rendering surfaces instead of hiding them

Warm episode count chips, visuals, layout hierarchy entries, edge styles, and inspector sections should be removed. The backend no longer emits those node/edge kinds, so hidden support is dead UI surface.

Alternative considered: leave dictionary labels and visuals for possible future history mode. YAGNI; a future historical layer can reintroduce its own contract.

### Preserve current metadata fields

`metadata.knowledgeLayer` remains part of `GraphNodeMetadata` because the live contract still lists it. It should not imply a rendered warm episode node.

Alternative considered: remove `knowledgeLayer` together with warm topology. That would reject a currently valid backend field.

## Risks / Trade-offs

- [Risk] A non-updated backend environment still emits warm episode topology. -> Mitigation: strict validation exposes the drift immediately.
- [Risk] Existing OpenSpec artifacts from prior warm/theme changes conflict. -> Mitigation: this change states the final topology explicitly and updates affected specs during apply.
- [Risk] Warm historical context is still useful somewhere. -> Mitigation: keep this change scoped to Graph View; design a separate history view only when the product needs it.
