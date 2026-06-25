## Context

Graph View now receives a warm-free tree-like backend topology: asset, narrative, event, and news article nodes. The current G6 force layout already has sample-inspired branch and leaf constants, but the rendered result still drifts into a radial fan because the frontend seeds every node on a deterministic ring and classifies links by terminal child status rather than by hierarchy depth from the asset/root.

## Goals / Non-Goals

**Goals:**

- Make the existing G6 `d3-force` layout settle closer to the reference tree sample.
- Let the layout start from natural G6 force positions instead of a frontend-defined circular seed.
- Apply longer/weaker force to root-level asset links and shorter/stronger force to lower branch-to-leaf links.
- Keep the change limited to Graph View layout behavior.

**Non-Goals:**

- Do not add G6 combo, cluster, hull, BubbleSets, or a new layout engine.
- Do not change Graph View backend contract, node kinds, edge kinds, filters, HUD chips, labels, quick detail, or inspector behavior.
- Do not persist node positions to the backend.

## Decisions

### Remove circular seed positions

The G6 node data should stop setting initial `style.x` and `style.y` through `createSeedPosition()`. This removes the radial starting bias that remains visible after force settles.

Alternative considered: reduce the seed radius. This still keeps a ring-shaped prior and requires more tuning than simply letting `d3-force` initialize.

### Classify links by hierarchy depth

The layout should decide root/branch force from `GRAPH_NODE_HIERARCHY_LEVEL`, not from whether the child node is terminal. Edges connected to the asset/root level should use the longer, weaker branch force. Lower-level edges, especially event-to-news-article leaves, should use the shorter, stronger leaf force.

Alternative considered: keep `isLeafEdge = child has no children`. That misclassifies direct `asset -> event` terminal events as short leaf links, which is one visible reason the graph collapses near the root instead of forming sample-like branches.

### Keep force tuning minimal

The first implementation should avoid adding cluster/combo logic or broad retuning. If needed, only adjust existing `d3-force` parameters that prevent the layout from settling naturally after seed removal.

Alternative considered: use G6 combo/cluster features. That is heavier than this problem needs and changes the visual model beyond the reference sample.

## Risks / Trade-offs

- [Risk] Dense payloads may still look busier than the 17-node sample. -> Mitigation: preserve existing bounded layout/performance behavior and judge success by branch direction/readability, not identical geometry.
- [Risk] Removing seed positions may make initial layouts less deterministic. -> Mitigation: stable ids and topology still drive force structure; exact pixel positions are not a contract.
- [Risk] Existing label density can visually obscure tree structure. -> Mitigation: leave label behavior unchanged in this change; tune labels separately only if layout is fixed but readability remains poor.
