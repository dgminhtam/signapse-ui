## Context

`/graph-view` uses Sigma, graphology, and a synchronous ForceAtlas2 pass to build a stable canvas from backend-provided nodes and edges. The recent readability refinement added bounded labels, hover emphasis, and drag interaction, but dense payloads still become visually crowded when all visible nodes force labels and when layout output leaves node circles too close together.

This change keeps the current canvas-first architecture and backend contract. It narrows the rendering policy so labels are priority-gated, and it adds a deterministic spacing pass after ForceAtlas2 so node circles start with a clearer minimum gap.

## Goals / Non-Goals

**Goals:**

- Keep dense global graphs readable by avoiding forced labels for every visible node.
- Preserve quick orientation by showing bounded labels for the most useful nodes first.
- Reveal full labels on hover, selection, and local-focus center.
- Reduce direct node circle overlap through a bounded post-layout collision relaxation pass.
- Prevent dragged nodes from being dropped directly on top of another node.

**Non-Goals:**

- Replacing Sigma, graphology, or ForceAtlas2.
- Adding backend-provided coordinates or persisting user-adjusted positions.
- Running continuous physics after initial render.
- Guaranteeing that every long text label can be visible at once in a dense graph.
- Changing graph API response shape, modal inspection, or multigraph support.

## Decisions

### Use priority label tiers instead of forcing every visible node label

The node reducer should force labels only for interaction-critical states: hovered node, selected node, dragged node, local-focus center, and selected edge endpoints. Default labels should be eligible through Sigma's label grid rather than forced for every visible node.

Priority should account for graph semantics:

- `asset` and `theme` nodes are stronger orientation anchors and should receive higher default label priority.
- High-connectivity nodes should be eligible before low-connectivity event or article nodes.
- `event` and `news-article` labels should remain bounded in global mode and rely on hover, selection, or local focus for full titles.

Why:
- Sigma's `labelDensity` and `labelGridCellSize` only help when labels are not all forced.
- The user's goal is to see enough names to understand the graph, not every title simultaneously.

Alternatives considered:
- Keep `forceLabel: isVisible`. Rejected because it bypasses label collision control and creates a dense text cloud.
- Hide all labels except hover. Rejected because the graph becomes opaque and requires too much probing.

### Add a bounded post-ForceAtlas2 spacing pass

After ForceAtlas2 completes, the frontend should run a small deterministic collision relaxation pass over node positions. For pairs closer than the configured minimum distance, the pass nudges them apart with damped displacement and a bounded iteration count.

The minimum distance should be derived from node visual sizes plus a small padding budget. For typical graph sizes in this screen, an O(n²) pair pass is acceptable. If future payloads become much larger, this can be replaced with a spatial grid without changing the behavior contract.

Why:
- ForceAtlas2 with `adjustSizes` reduces overlap but does not guarantee a clean minimum gap in all dense clusters.
- A bounded pass gives predictable spacing without introducing a new dependency or continuous physics.

Alternatives considered:
- Only increase ForceAtlas2 repulsion. Rejected because it can spread the whole graph too far and still does not provide an explicit minimum gap.
- Add `graphology-layout-noverlap`. Rejected for now because the required behavior is small enough to implement locally and avoid another dependency.

### Keep spacing stable and local after drag

Dragging should continue to move only the user's chosen node while the pointer is active. On release, the graph may run a local collision resolution for the dragged node so it does not remain stacked on another node. This keeps the drag gesture predictable while still cleaning up accidental drops.

Why:
- Users drag nodes to clarify a local region; moving the whole graph after every drag would feel like the canvas is fighting them.
- A release-only adjustment is easier to understand than continuous physics.

Alternatives considered:
- Rerun full layout after drag. Rejected because it can undo the user's manual separation.
- Leave drag positions exactly as released. Rejected because accidental overlap is one of the problems being solved.

### Let dense graphs spread rather than compress into one viewport

The graph can be wider after spacing. Camera reset and auto-rescale should still make the graph visible, but readability should prefer pan/zoom over compressing all nodes into an unreadable pile.

Why:
- A dense graph cannot be both fully expanded and fully label-visible inside a small viewport.
- Pan/zoom is already part of the graph interaction model.

## Risks / Trade-offs

- [Too few labels visible] → Mitigate with semantic priority tiers, hover full title, and local focus showing more context.
- [Graph spreads too far] → Mitigate with bounded spacing iterations, damped displacement, and camera reset preserving whole-graph orientation.
- [Spacing pass performance] → Mitigate with low iteration counts and keep it initial-layout only for current payload sizes.
- [Dragged node feels adjusted after release] → Mitigate by applying only a small nearest-free-position nudge and not rerunning full layout.

## Migration Plan

1. Add label priority metadata or helper functions near graph model construction.
2. Update Sigma node reducer so only priority or interaction nodes force labels.
3. Add a post-layout node spacing helper after ForceAtlas2.
4. Add release-time collision cleanup for dragged nodes.
5. Verify dense graph default view, hover full titles, selected node modal, drag behavior, local focus, and reset controls.

Rollback strategy:
- Revert the label policy and spacing helper changes. Backend payloads and saved data are unaffected because all behavior is frontend-only.

## Open Questions

- No blocking open questions. The exact default label budget and spacing constants can be tuned during implementation against the dense 100-node payload shown by the user.
