## Context

`/graph-view` is already implemented as a protected browse surface backed by `GET /graph-view`, using `Sigma.js + graphology + @react-sigma/core`. The route currently satisfies the MVP requirements for rendering, hover highlighting, selection, and permission-aware drill-down, but the presentational layer still reads as a conventional admin page wrapped around a graph canvas.

The current workbench has three linked UX shortcomings:

- the canvas does not dominate the reading order strongly enough, because surrounding cards, chips, and helper modules compete for attention
- motion is functional but sparse, so the graph appears abruptly and behaves more like a static diagram than a living browse surface
- exploration controls are too implicit, leaving users to rely on raw pan/zoom and hover rather than offering local focus or readability tuning

This refinement pass is frontend-only. It must preserve the existing route, permissions, backend contract, and browse-first interaction model, while making the graph feel more fluid, intentional, and operator-friendly on desktop and narrow layouts.

## Goals / Non-Goals

**Goals:**
- Make the graph canvas the dominant visual region and reduce the sense that the page is a stack of equal-weight cards.
- Add purposeful motion that improves orientation and polish without leaving the graph in a continuously unstable physics state.
- Reduce visual clutter through progressive disclosure of labels, legend content, and secondary guidance.
- Add explicit browse aids such as local focus controls, neighborhood depth, or compact readability tuning so exploration feels guided rather than rigid.
- Refine the right-hand panel into an inspector-oriented companion to the graph instead of a fixed secondary dashboard.
- Preserve the existing drill-down rules and backend-driven graph contract.

**Non-Goals:**
- Replacing Sigma, graphology, or the overall graph-view route architecture.
- Introducing backend layout coordinates, backend-driven style tokens, or additional graph API endpoints.
- Adding graph editing, mutation controls, or query-specific graph slices.
- Turning the page into a constantly animated physics simulation.
- Adding a brand-new asset or theme detail route in this pass.

## Decisions

### 1. Keep Sigma as the rendering engine and refine the experience within the current stack
The change will stay on top of the existing `Sigma.js + graphology + @react-sigma/core` stack instead of introducing a new graph library or a parallel motion framework.

Why:
- The current stack already supports reducers, hover rendering, camera animation, and layer manipulation, which are sufficient for the required polish.
- The current issues are experiential, not architectural: the graph renders correctly and the integration path already works.
- Staying on the existing stack lowers implementation risk and keeps performance characteristics predictable.

Alternatives considered:
- Replace the graph stack with another library.
- Rejected because the current stack is already a strong fit for browse graphs, and the problems identified are primarily UI hierarchy and interaction polish.

### 2. Adopt a canvas-first layout with progressive disclosure around it
The graph surface should become the page's primary focal area. Supporting material such as the legend, helper copy, and graph metrics should move into compact, collapsible, or secondary regions rather than compete equally with the canvas.

Why:
- A graph browse tool should feel like an exploration workspace, not a report surrounded by widgets.
- The current page spends too much immediate visual weight on static support content.
- A lighter shell better matches the original Obsidian-like intention without removing useful metadata.

Alternatives considered:
- Preserve the current two-column card balance and only restyle individual cards.
- Rejected because the structural hierarchy would remain too flat and card-heavy.

### 3. Use motion as orientation, not decoration
Motion should help users understand graph state changes. The page will use a short settle-on-load feel, smoother camera transitions for reset or focus actions, and softer visual state transitions for hover/selection, but it will not leave layout forces running indefinitely.

Why:
- A brief settling phase makes the graph feel alive and intentional.
- Continuous motion would undermine readability and increase CPU cost.
- Motion tied to camera and selection changes improves spatial understanding more than arbitrary animation.

Alternatives considered:
- Keep the graph completely static after import.
- Rejected because it reinforces the current rigid feel.
- Run live physics continuously.
- Rejected because it harms stability and can make the graph feel noisy.

### 4. Add a local-focus exploration model without changing the backend contract
The refined graph-view should support a client-side “focus around this node” mode, including a compact neighborhood depth control, so operators can inspect one cluster without losing the global browse surface entirely.

Why:
- This is the strongest improvement for exploration quality that does not require backend changes.
- Obsidian’s local graph pattern demonstrates how depth-based narrowing makes dense graphs more usable.
- The existing graph payload already contains enough topology to derive local neighborhoods client-side.

Alternatives considered:
- Keep only global browse plus hover highlight.
- Rejected because it leaves users with too much manual camera work in denser regions.
- Introduce a backend local-graph endpoint.
- Rejected because the required information already exists in the frontend payload and the change should remain FE-only.

### 5. Make graph readability controls contextual and compact
Instead of always showing all labels and legend information, the surface will treat readability as a tunable layer. Edge labels, dense metadata, and some guide copy should appear on interaction, selection, zoom threshold, or explicit toggles rather than remain always visible.

Why:
- The current always-on edge labels and repeated supporting copy contribute to visual stiffness and clutter.
- Progressive disclosure helps a dense graph feel calmer without losing depth.
- Compact controls make the page feel more tool-like and less explanatory.

Alternatives considered:
- Preserve current labels and only recolor or resize them.
- Rejected because the clutter problem is about volume and hierarchy, not only visual style.

### 6. Reframe the side panel as an inspector with stateful sections
The right-hand panel should present one dominant mode at a time: browse overview, selected node inspector, selected edge inspector, or focus controls. It should rely on section transitions and compact toggles rather than a long fixed stack of independent cards.

Why:
- The current panel is informative but visually repetitive.
- An inspector model better matches how users mentally pair a graph with supporting detail.
- It preserves metadata access while reducing the sense of “many little cards”.

Alternatives considered:
- Remove the side panel and move all details into overlays or tooltips.
- Rejected because the existing drill-down model and graph metadata are better served by a persistent inspector region.

### 7. Use worker-backed layout only when the settle interaction requires it
If the refined settle-on-load or local-focus transitions become noticeably heavy on realistic payloads, the implementation may move the ForceAtlas2 work into the graphology worker path rather than keep it synchronous on the main thread.

Why:
- Performance matters more once motion and focus transitions become more ambitious.
- The existing layout package already supports a worker mode, so the escape hatch is available without changing product scope.

Alternatives considered:
- Commit upfront to worker-based layout for every render path.
- Rejected because it adds lifecycle complexity before the refined motion behavior has been validated.

## Risks / Trade-offs

- [More motion could reduce clarity if overused] -> Keep animation bounded to settle, focus, and camera transitions; avoid perpetual motion.
- [Canvas-first hierarchy may hide useful context too aggressively] -> Use progressive disclosure rather than outright removal, and keep metadata one interaction away.
- [Local focus controls may add complexity if surfaced too prominently] -> Make focus tools compact and contextual, with a clear reset path back to the full graph.
- [Worker-backed layout may complicate lifecycle management] -> Treat the worker path as a performance optimization only if synchronous settling proves too heavy.
- [Reducing always-on labels can make the graph feel sparse at first] -> Pair label reduction with better hover, selection, and zoom-threshold behavior so detail appears naturally when needed.

## Migration Plan

1. Rework graph-view page hierarchy so the canvas becomes the visual anchor and static support content becomes secondary or collapsible.
2. Refine graph interaction polish with bounded motion, smoother camera transitions, and less abrupt hover/select state changes.
3. Add local-focus and readability controls that operate entirely on the existing frontend graph model.
4. Refactor the side panel into inspector-oriented states with better section transitions and lower card repetition.
5. Verify the refined graph on desktop and narrow layouts, paying special attention to clutter, animation feel, and performance.

Rollback strategy:
- Revert the graph-view workbench presentation and interaction refinements while keeping the core route and backend integration intact.
- The route, permissions, and API contract remain unchanged, so rollback is isolated to the frontend graph-view UX layer.

## Open Questions

- None for proposal readiness. The direction is specific enough to implement in phases while preserving the existing graph-view contract.
