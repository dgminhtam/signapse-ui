## Context

`/graph-view` already uses Sigma, graphology, and a frontend-built `MultiDirectedGraph`. The current canvas can render, zoom, select, and open modal details, but dense graphs remain difficult to analyze because labels are hidden by default, hover emphasis dims surrounding context heavily, and users cannot manually separate overlapping nodes.

This change stays within the existing graph-view route and rendering stack. It builds on the current canvas-first layout and modal inspection model, and it does not change the backend graph contract.

## Goals / Non-Goals

**Goals:**
- Make node identity visible before interaction through short, bounded labels.
- Reveal full node titles on hover or selection without permanently cluttering the canvas.
- Add node dragging so users can separate crowded regions during analysis.
- Soften focus dimming so hover highlights the target while preserving enough global context.
- Improve initial layout spacing and use light motion only for orientation.

**Non-Goals:**
- Replacing Sigma, graphology, or the current graph-view route structure.
- Adding backend-provided coordinates or graph mutations.
- Persisting user-adjusted node positions across sessions.
- Adding continuous live physics after page load.
- Redesigning modal details, settings drawers, or route shell beyond what is needed for canvas readability.

## Decisions

### Use bounded default labels instead of always-hidden labels

Every visible node should expose a short label by default. The label text should be truncated to a predictable character budget and may vary by node importance, zoom, or local focus state. Hovered and selected nodes should force the full label.

Why:
- The current graph requires too much hover exploration before users know what they are looking at.
- Fully expanded labels for every node would create text collisions in dense graphs.
- Bounded labels provide orientation while full labels remain one interaction away.

Alternatives considered:
- Keep labels hidden except on hover. Rejected because the graph stays visually opaque.
- Show all full labels by default. Rejected because dense datasets would become unreadable.

### Use a custom hover drawing treatment for node prominence

Hover and selected states should use Sigma's canvas drawing path, such as `defaultDrawNodeHover`, to draw a halo or shadow around the emphasized node. The reducer can continue to increase size and z-index, but the visual lift should not depend on CSS around the canvas.

Why:
- Sigma renders nodes inside canvas/WebGL layers, so CSS shadows do not attach to individual graph nodes.
- A canvas hover treatment is predictable and aligns with Sigma's rendering model.
- A halo is easier to read than only enlarging the node.

Alternatives considered:
- Use CSS shadows on the canvas container. Rejected because it cannot target individual nodes.
- Only increase node size. Rejected because it does not create enough visual separation in dense clusters.

### Soften dimming and prioritize edge receding

Hover should keep unrelated nodes visible enough for spatial context, while unrelated edges can fade more noticeably. This means node dim colors should move closer to their base color than today, while edge dimming remains the main clutter-reduction tool.

Why:
- The user's goal is analysis, and over-dimming removes the surrounding structure needed for comparison.
- Edges create more visual clutter than nodes in this graph, so edge fading carries more of the focus workload.

Alternatives considered:
- Keep current dimming strength. Rejected because it hides too much context on hover.
- Remove dimming entirely. Rejected because dense edge bundles would overwhelm the hovered node.

### Implement drag-to-position as local interaction state

Node dragging should be implemented with Sigma events already exposed by `@react-sigma/core`: `downNode`, `mousemovebody`, and `mouseup` or equivalent captor events. While dragging, camera panning should be disabled temporarily, the node's `x` and `y` attributes should update in the graph, and Sigma should refresh without rerunning the full layout.

Why:
- Dragging is a direct way to separate overlaps without needing new backend layout controls.
- Keeping drag state client-local avoids introducing persistence semantics too early.
- Avoiding layout recomputation during drag keeps interaction predictable.

Alternatives considered:
- Add a full editing or save-position mode. Rejected because graph view is currently a browse surface.
- Rerun ForceAtlas2 after every drag. Rejected because it can pull the node away from the user's chosen position and feel unstable.

### Tune ForceAtlas2 for anti-overlap during initial layout

The existing synchronous ForceAtlas2 pass should be tuned for readability by using anti-overlap settings such as `adjustSizes: true`, a more generous spacing ratio, and bounded iteration counts. The result should reduce center pileups without leaving the graph in continuous movement.

Why:
- The current layout can create dense node clusters that are visually hard to separate.
- ForceAtlas2 already exists in the stack, so this is a small tuning change.
- Bounded settling protects performance and preserves a stable reading surface.

Alternatives considered:
- Introduce a new layout library. Rejected because the existing package is already sufficient for this refinement.
- Run physics continuously. Rejected because users need stable positions while reading and dragging.

### Keep motion short and meaningful

Motion should remain bounded to canvas load, camera focus/reset, hover emphasis, and optional post-drag refresh. Respect `prefers-reduced-motion`; users who prefer reduced motion should still get the readability improvements without animated settling.

Why:
- Light motion helps orientation, but graph analysis suffers if the graph keeps drifting.
- The current code already contains a small settle animation, so the refinement can extend that pattern rather than introduce a new motion system.

## Risks / Trade-offs

- [Label clutter] Default labels can crowd dense graphs. Mitigation: truncate labels, use Sigma label density controls, and force full labels only on hover or selection.
- [Dragging conflicts with camera pan] Drag gestures can fight panning. Mitigation: disable panning while dragging a node and restore it immediately after release.
- [Manual positions can be lost] Local node moves are not persisted. Mitigation: treat dragging as analysis-only for this change and leave persistence for a future proposal.
- [Anti-overlap tuning can spread the graph too far] More spacing can increase pan distance. Mitigation: tune spacing alongside camera auto-rescale and reset controls.
- [Custom hover drawing can drift from design tokens] Canvas drawing is manual. Mitigation: derive colors from existing node attributes and keep the treatment restrained.

## Migration Plan

1. Add label formatting helpers and graph node attributes for short and full labels.
2. Update Sigma reducers and settings so short labels render by default and full labels render on hover, selection, and local focus center.
3. Add custom node hover drawing for halo or shadow emphasis and soften dimming values.
4. Add drag-to-position event handling with temporary camera-panning suppression.
5. Tune the initial ForceAtlas2 layout for stronger anti-overlap without continuous physics.
6. Verify desktop and narrow layouts with dense graph payloads, including hover, drag, reset, selected node modal, and reduced-motion behavior.

Rollback strategy:
- Revert the graph-view canvas and layout tuning changes. The backend payload, permissions, and modal inspection flow remain unchanged.

## Open Questions

- No blocking open questions for implementation. A future change can decide whether dragged positions should be persisted per user or workspace.
