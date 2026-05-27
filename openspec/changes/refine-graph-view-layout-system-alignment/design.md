## Context

Graph View has already moved through several focused improvements: G6 force layout, draggable nodes, bounded panning, controlled icon zoom, hover spotlight, quick detail, narrative support, and a canvas-first presentation. The current visible issue is no longer the graph engine itself; it is the composition around the canvas.

The production screenshot shows the right direction visually, but also exposes three product risks:

- The route can create page-level horizontal and vertical overflow, which makes a spatial analysis tool feel recoverable only through browser scrolling.
- In-canvas labels and metric chips compete with the graph, especially in dense clusters.
- The canvas chrome is strong enough to feel slightly detached from the Signapse shadcn/radix-nova admin shell.

This design keeps the graph as a specialized analytical surface while making its shell more disciplined and system-aligned.

## Goals / Non-Goals

**Goals:**

- Make Graph View a bounded, viewport-first workspace with no page-level horizontal overflow in normal desktop use.
- Keep the graph canvas as the only primary content surface when graph data exists.
- Separate graph navigation controls from graph metric/legend chips.
- Reduce resting label clutter while preserving hover, selection, and click inspection usefulness.
- Preserve the dark graph-specific visual identity using local styling and semantic tokens rather than changing global shadcn primitives or theme tokens.
- Keep loading/skeleton structure aligned with the final bounded canvas.

**Non-Goals:**

- Do not replace G6 or alter the current force layout engine.
- Do not change backend graph contracts, node kinds, edge kinds, or data fetching.
- Do not add new graph filters, search, local-neighborhood mode, or a new side inspector.
- Do not change global theme tokens, sidebar tokens, or `components/ui/*` wrapper chrome.
- Do not remove existing drag, pan, controlled zoom, recenter, hover spotlight, selection, or quick-detail behavior.

## Decisions

1. Treat the graph page as a bounded workspace instead of a scroll document.

   Rationale: Graph exploration is spatial. If the document itself scrolls horizontally, users lose trust that the graph is recoverable. The route should size itself to the available app viewport and put any overflow responsibility inside the graph/canvas layer.

   Alternative considered: Keep document scroll and rely on recenter. This preserves current behavior but leaves the browser scrollbar as a confusing second navigation model.

2. Move controls into a dedicated floating tool dock.

   Rationale: Zoom in, zoom out, and recenter are actions, while node/edge chips are metadata. Grouping them together makes the HUD harder to scan and makes the controls look like counts. A compact right-side dock mirrors map/graph tooling patterns and keeps actions predictable.

   Alternative considered: Keep controls inline with top-right metrics. This is compact, but it overloads the top HUD as graph categories grow.

3. Keep node-kind metrics visible, but make relationship metrics visually quieter or progressively revealed.

   Rationale: Node kinds help users understand the graph at a glance. Relationship counts are useful but lower priority during first-read graph analysis. They should remain in the canvas but not compete with labels and nodes.

   Alternative considered: Hide all metrics behind a popover. That maximizes graph space but removes useful orientation for users validating graph composition.

4. Use a stricter resting label policy.

   Rationale: Always-visible labels make small graphs understandable, but dense graphs quickly become text-first rather than graph-first. The default state should show orientation anchors and high-value labels while hover/selection reveals exact titles.

   Alternative considered: Keep every eligible label visible with truncation. This gives maximum immediate text, but dense clusters still overlap and obscure the topology.

5. Keep graph-specific chrome local and token-aware.

   Rationale: Graph View can have a distinctive dark analytical surface, but it should not fork the design system. Local CSS/classes can express the canvas atmosphere, while shadcn primitives keep their default variants and global tokens remain unchanged.

   Alternative considered: Tune global dark tokens or shadcn wrappers to make Graph View fit better. That would risk regressions across unrelated admin screens.

6. Normalize page identity against sidebar hierarchy.

   Rationale: The screenshot shows `Overview > Graph View` while the sidebar presents Overview and Graph View as siblings. Breadcrumbs should match navigation hierarchy so users do not infer a false parent-child relationship.

   Alternative considered: Keep the breadcrumb as-is because it is minor. This leaves a small but persistent wayfinding mismatch.

## Risks / Trade-offs

- [Fewer default labels could make first load feel less informative] -> Prioritize labels for assets, themes, selected/hovered nodes, high-connectivity nodes, and local focus endpoints.
- [Relationship chips may be harder to discover if visually reduced] -> Keep a compact bottom-right summary or popover trigger with accessible label and clear count feedback.
- [Viewport bounding can conflict with app shell height changes] -> Use the existing app header/sidebar layout constraints and mirror the final dimensions in skeleton/loading states.
- [Dark canvas may still feel custom] -> Keep customization local to Graph View and avoid editing shadcn wrappers or global theme variables.
- [Label collision depends on data density] -> Implement policy and spacing as deterministic client behavior, then leave deeper graph layout tuning for a later change if real payloads still overwhelm the view.

## Migration Plan

1. Audit `app/[lang]/(main)/graph-view/` for page-level wrappers, min-widths, absolute HUD placement, and overflow sources.
2. Constrain the route and graph workspace to the available viewport and remove unintended document-level horizontal scroll.
3. Split HUD into: title, compact node summary, floating tool dock, muted total summary, and quieter relationship summary.
4. Tighten default label eligibility and preserve full-title reveal through hover/selection.
5. Align graph-local controls/chips with shadcn usage rules: use existing wrappers, semantic tokens, icon-only accessible buttons, and no wrapper/global token changes.
6. Update skeleton/loading and breadcrumb copy/mapping as needed.
7. Verify with lint/typecheck, OpenSpec validation, static search for removed external cards/copy, and deterministic layout review.

Rollback is a normal frontend revert. No persisted graph state or backend migration is involved.

## Open Questions

- Should relationship counts stay always visible in the bottom-right at reduced emphasis, or become a collapsed legend trigger by default? The implementation can choose the smaller safe step first: keep them visible but visually quieter.
