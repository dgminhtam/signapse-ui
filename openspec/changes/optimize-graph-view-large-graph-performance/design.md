## Context

Graph View currently renders through a client-only G6 v5 canvas using a d3-force layout. The canvas already supports clustered force layout, node drag, bounded pan/zoom, hover title reveal, click selection, and local quick detail.

The performance issue appears when the backend payload contains many nodes, edges, and visible labels. The expensive paths are not ordinary React card rendering. They are G6/canvas work: text drawing, shadow/stroke drawing, force layout simulation, and state updates that repaint large portions of the graph on hover or selection.

## Goals / Non-Goals

**Goals:**

- Keep dense Graph View payloads usable during initial render, hover, selection, and drag.
- Preserve the current visual model: G6 force canvas, clustered layout, in-canvas hover title reveal, selected-node inspector, and quick detail actions.
- Reduce default label and visual drawing cost without making the graph unreadable.
- Update only the affected Graph View code and OpenSpec artifacts.

**Non-Goals:**

- Do not replace G6 or migrate to another graph renderer.
- Do not change the backend graph-view contract.
- Do not add server-side layout persistence.
- Do not add new filtering, search, pagination, minimap, or cluster expansion UX in this change.
- Do not remove hover title reveal, node drag, click selection, or quick detail behavior.

## Decisions

### Use level-of-detail labels before heavier solutions

Dense graph lag is strongly affected by canvas text rendering. The first optimization should reduce default label work:

- Keep labels for orientation anchors such as assets, themes, selected nodes, hovered nodes, and high-degree nodes.
- Hide or further restrict lower-priority event/news/narrative labels on large graphs until hover or selection.
- Keep full-title reveal on hover/selected nodes.

Alternative considered: removing labels entirely on dense graphs. This would be faster but would undermine analysis because users need anchor labels to orient themselves.

### Replace broad interaction state updates with incremental updates

Hover and selection should update only the affected element set instead of all nodes and edges whenever possible.

- Track previous hover and selected related sets.
- Clear only previous affected states.
- Apply new states only to the current focused node, directly related nodes, and directly related edges.
- Avoid overlapping G6 `hover-activate` full-graph behavior with manual active-state updates.

Alternative considered: keep current full-graph state update and only reduce label cost. That improves render cost but leaves click/hover lag on dense payloads.

### Reduce default visual cost, keep emphasis on focus states

Default shadows, heavy label strokes, and animation are visually useful but expensive when applied broadly.

- Prefer lightweight defaults.
- Keep stronger halo/shadow only for hovered, selected, or related-focus elements.
- Avoid continuous or repeated animation after the graph reaches a readable state.

Alternative considered: disabling all visual emphasis. This would be faster but would make hover/click analysis weaker.

### Keep layout tuning bounded

The current force layout remains the right engine for the desired linked-node drag behavior. This change should tune work rather than replace it.

- Keep d3-force/G6 layout.
- Avoid restarting the layout on hover/selection.
- Keep drag force behavior local to the current session.
- Avoid introducing worker/offscreen rendering until measured evidence shows the simpler optimizations are insufficient.

## Risks / Trade-offs

- Reduced default labels may hide some event/article titles until hover or selection. Mitigation: keep priority labels for anchors and high-degree nodes, and preserve full-title hover.
- Incremental state management can leave stale states if previous sets are not cleared correctly. Mitigation: centralize hover/selection state set tracking and include deterministic code review/static checks.
- Tuning visual cost may make the graph feel less rich. Mitigation: preserve strong emphasis on active/selected nodes only.
- G6 internals may still repaint more than expected after partial state updates. Mitigation: measure render/interaction paths and keep the change scoped so further renderer-level work can be proposed separately if needed.
