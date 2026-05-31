## Context

The previous Graph View refinement moved the page into a bounded canvas-first workspace and separated graph controls from metric chips. After reviewing the result, the remaining polish issues are mostly visual-system fit:

- The custom control wrapper duplicates what shadcn `ButtonGroup` already provides.
- The recenter icon currently reads like reset/undo rather than spatial locate.
- The canvas shell uses a large custom radius and atmospheric background that feels heavier than nearby Overview sections.
- The title is semantically page identity, but visually reads as a small badge.

This change keeps the same interaction model and graph data behavior while making the surface calmer and closer to the rest of the app.

## Goals / Non-Goals

**Goals:**

- Use installed shadcn `ButtonGroup` for the three graph viewport actions.
- Put the locate/recenter control in the middle of the group.
- Replace the reset-style icon with a locate/focus icon.
- Align the canvas section radius with common Signapse sections such as Overview.
- Remove heavy wrapper gradient/glow so the graph itself carries the visual interest.
- Render the `Biểu đồ tri thức` label as larger plain text without a pill wrapper.
- Keep skeleton/fallback chrome aligned with the final surface.

**Non-Goals:**

- Do not change G6 layout, node spacing, drag behavior, hover behavior, selection behavior, or controlled zoom math.
- Do not add new graph filters, search, layout modes, or settings.
- Do not modify shadcn wrapper internals or global theme tokens.
- Do not change backend data, route permissions, or quick-detail behavior.

## Decisions

1. Use `ButtonGroup` for viewport controls.

   Rationale: The control set is exactly a compact related action group. Using the installed shadcn wrapper removes custom grouping chrome and automatically follows the system's radius and separator behavior.

   Alternative considered: Keep the custom vertical glass pill. It is visually distinct, but it adds another bespoke control pattern to a screen that is already visually specialized.

2. Order controls as zoom out, locate, zoom in.

   Rationale: The center action becomes the spatial anchor. This makes locate feel like "return me to the graph" rather than a reset afterthought. The zoom controls flank the anchor symmetrically.

   Alternative considered: Keep plus/minus/reset order. It is common in simple control clusters but keeps recenter visually secondary.

3. Use a locate/focus icon for recenter.

   Rationale: Recenter moves the viewport back to the graph. A locate/focus icon communicates spatial targeting better than a rotate/undo icon.

   Alternative considered: Keep `RotateCcw`. It is recognizable, but it suggests undo/resetting graph state rather than locating the graph.

4. Simplify the canvas shell to system section chrome.

   Rationale: Overview and shared surfaces use `rounded-xl` and restrained border/background treatment. Matching that rhythm makes Graph View feel native to the admin workspace while the graph nodes/edges provide the visual identity.

   Alternative considered: Keep the current gradient/glow canvas shell. It gives atmosphere, but the page starts reading more like a feature hero than an admin analysis surface.

5. Make the title plain text.

   Rationale: `Biểu đồ tri thức` is the screen identity, not a category badge. Larger text without a pill gives clearer hierarchy and reduces decorative chrome.

   Alternative considered: Keep the title pill. It is compact, but it competes with count chips and makes page identity feel like another legend item.

## Risks / Trade-offs

- [Canvas may feel too plain after removing gradient] -> Keep the graph rendering, colored nodes, edges, and HUD as the main visual identity; preserve a subtle border/background surface.
- [ButtonGroup may be less "map-like" than a floating glass dock] -> Keep it positioned as an in-canvas control cluster and use icon-only shadcn buttons with tooltips/accessibility labels.
- [Plain title could collide with node count chips on narrow widths] -> Preserve existing responsive flex wrapping and keep the title width constrained by layout rather than adding a wrapper pill.
- [Skeleton may drift from final layout] -> Update skeleton and dynamic fallback together with the real canvas chrome.

## Migration Plan

1. Replace the custom Graph View control dock wrapper with `ButtonGroup` and shadcn `Button` children.
2. Change recenter icon import and render order to zoom out, locate, zoom in.
3. Simplify canvas section, Suspense skeleton, and dynamic fallback shell classes to `rounded-xl` and restrained system surface treatment.
4. Render the title as plain larger text and ensure node-count chips remain separate metadata.
5. Run targeted lint, typecheck, OpenSpec validation, and static review for no global token or wrapper changes.

Rollback is a normal frontend revert. No persisted state or backend migration is involved.
