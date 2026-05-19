## Context

`/graph-view` renders the graph with AntV G6 and a D3 force layout. The current canvas supports panning, zooming, and force-aware node dragging, but the interaction space is effectively unbounded: users can pan far away from the graph or drag a node outside the useful analysis area and then need to manually recover.

G6 already exposes `drag-canvas.range` for viewport panning limits. G6 `drag-element-force` supports fixed drop positions but does not expose a built-in drag boundary, so node-level bounds need to be handled in the graph view canvas implementation.

## Goals / Non-Goals

**Goals:**

- Keep canvas pan flexible but bounded so the viewport cannot drift indefinitely.
- Keep dragged nodes inside a predictable analysis bounds during the current client session.
- Provide a clear `Đưa về trung tâm` recovery action.
- Preserve the force-layout feel where neighboring nodes can still react while dragging.
- Keep the solution local to the graph view canvas and frontend-only.

**Non-Goals:**

- Persisting manual node positions to the backend.
- Changing backend graph response shape or relation semantics.
- Replacing the current G6 layout or adding another visualization dependency.
- Reintroducing the previous side inspector, modal detail behavior, or hover title work.
- Locking the canvas completely so users cannot pan or zoom.

## Decisions

### Bound canvas pan with `drag-canvas.range`

Configure `drag-canvas` as an object behavior with a finite range instead of using the default string shorthand.

Why:
- This uses G6's native viewport constraint rather than custom transform math.
- It solves the common "I dragged the whole canvas away" recovery problem with minimal code.
- A light range keeps exploration natural instead of making the canvas feel frozen.

Alternative considered:
- Disable `drag-canvas` entirely. Rejected because users still need to inspect dense clusters by panning.

### Clamp node dragging inside a computed analysis bounds

Compute a rectangular analysis bounds from the canvas size, centered around the graph workspace, and clamp dragged node positions to that bounds during node drag. The bounds should be larger than the visible viewport so users can create separation, but not so large that a node can disappear into empty space.

Why:
- `drag-element-force` has no native `range` option.
- A local clamp keeps the behavior frontend-only and avoids backend persistence.
- A slightly oversized bounds preserves the analysis workflow of pulling nodes apart.

Alternative considered:
- Run `fitView()` after every drag. Rejected as the primary behavior because it recovers after the problem but does not prevent users from dragging a node out of context.

### Keep recenter as an explicit recovery action

Add a compact overlay button labeled `Đưa về trung tâm` that calls the current graph instance to fit or center the graph with a short animation.

Why:
- Even with boundaries, users need a predictable escape hatch after zooming, panning, or dragging multiple nodes.
- It is discoverable and avoids relying on hidden gestures.
- It keeps the UI text in Vietnamese and fits the graph workspace control model.

Alternative considered:
- Auto-center whenever a drag ends. Rejected because it would fight intentional manual arrangements.

### Preserve current force layout and drag lifecycle fixes

Keep `drag-element-force` with fixed dropped nodes and preserve the existing guarded render/destroy lifecycle. The bounded-space work should not reopen the previous destroyed-instance lifecycle issue.

Why:
- The current G6 drag direction already matches the intended clustering interaction.
- This change is interaction containment, not a layout rewrite.

## Risks / Trade-offs

- [Bounds feel too tight] -> Use conservative constants and tune them by smoke testing dense graph payloads before finalizing.
- [Clamp fights force simulation] -> Clamp only user-dragged positions and keep force reactions enabled for connected nodes.
- [Recenter interrupts user-created layout] -> Trigger recenter only from the explicit button, not automatically after drag.
- [Dense labels still overlap inside bounds] -> This change prevents losing the graph; label density remains a separate readability concern.
