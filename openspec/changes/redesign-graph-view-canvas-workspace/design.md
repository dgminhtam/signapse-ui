## Context

`/graph-view` already renders the shared graph correctly and now has the main browse interactions in place, but the screen still spends too much of the viewport on surrounding chrome. The current route keeps the standard page-card framing, exposes a long right-side inspector by default, and asks users to read node details away from the point where they interact with the graph.

This redesign is a frontend-only workspace refinement. It must preserve the current Next.js route, permission checks, `GET /graph-view` contract, and browse-first graph behaviors while changing the screen hierarchy so the canvas becomes the obvious primary surface. The implementation will stay on the current `Sigma.js + graphology + @react-sigma/core` stack and should reuse existing graph state where possible.

## Goals / Non-Goals

**Goals:**
- Make the graph canvas the dominant visual region on the route.
- Remove the persistent right-side detail panel and move node or edge inspection into a modal interaction.
- Reduce default information density by hiding advanced settings, legend content, and helper guidance behind contextual controls.
- Preserve current selection metadata, permission-aware drill-down links, and browse behaviors.
- Keep hover and selection transitions stable so the layout does not feel jittery when users explore the graph.

**Non-Goals:**
- Changing the backend API, permissions, or graph data contract.
- Replacing Sigma or graphology with another graph library.
- Adding graph editing, graph filtering from the backend, or route-level data mutations.
- Removing supporting controls entirely; the goal is progressive disclosure, not eliminating graph aids.

## Decisions

### 1. Treat `/graph-view` as a workspace exception to the standard information-card shell
The route will intentionally stop using the default outer `Card` wrapper so the graph can occupy most of the viewport. A lighter page header may remain for title, breadcrumbs, and compact actions, but the main content area will behave like a workspace rather than a detail page.

Why:
- The current card shell adds padding and framing that compete with the graph for space.
- Graph exploration benefits more from canvas area than from boxed page structure.
- The user explicitly wants this screen optimized differently from the repo's information-heavy pages.

Alternatives considered:
- Keep the current card shell and only simplify the right column.
- Rejected because it would still leave the graph visually boxed in and under-prioritized.

### 2. Replace the persistent side inspector with a modal selection surface
Selecting a node or edge will open a modal inspector instead of filling a fixed right-side panel. On desktop this should behave like a centered dialog; on narrow layouts it can adapt into a taller drawer-style modal while keeping the same interaction model.

Why:
- Detail reading should happen close to the moment of selection, not in a permanently expanded side rail.
- A modal makes selection feel intentional and reduces the amount of UI that competes with the graph when nothing is selected.
- The same surface can carry metadata, relation semantics, and permission-aware drill-down actions without forcing a two-column layout.

Alternatives considered:
- Keep the right-side inspector and only restyle or collapse it.
- Rejected because the user specifically wants selection detail moved out of the fixed side panel.
- Use only tooltips or popovers near nodes.
- Rejected because node and edge metadata are too rich for a lightweight hover surface.

### 3. Move graph settings into contextual control surfaces
Advanced controls such as legend expansion, readability tuning, helper text, and exploration settings will move into on-demand surfaces such as a compact toolbar, popover, or slide-over controls panel. The default page load should show only the minimal controls needed to orient and navigate the graph.

Why:
- The current screen exposes too many settings and reading aids at once.
- Most of these controls are useful occasionally, not continuously.
- Progressive disclosure reduces clutter without removing functionality.

Alternatives considered:
- Keep all settings visible and try to reduce clutter with typography alone.
- Rejected because the problem is information volume and hierarchy, not just styling.

### 4. Keep hover lightweight and reserve rich inspection for click selection
Hover will remain a lightweight graph emphasis state that does not open detail UI or trigger layout recomputation. Rich metadata inspection will happen on click, which will open the modal and keep the graph state otherwise stable in the background.

Why:
- Hover is frequent and must feel cheap.
- The earlier hover jank issue shows that selection behavior and hover behavior should be separated cleanly.
- Click-based detail is a better fit for richer metadata and actions.

Alternatives considered:
- Show the modal or another heavy detail surface on hover.
- Rejected because it would be noisy and would make browsing feel unstable.

### 5. Preserve current graph context when opening and closing the modal
Opening the detail modal must not reset camera position, rerun layout, or discard the current browse context. Closing the modal should return the user to the same view they were exploring.

Why:
- Graph exploration depends on spatial continuity.
- Users should be able to inspect several nodes in sequence without losing their place.
- This keeps the modal additive rather than disruptive.

Alternatives considered:
- Recenter or refocus the graph automatically every time a selection opens.
- Rejected because it would make the interface feel jumpy and harder to compare nearby nodes.

## Risks / Trade-offs

- [Less always-visible guidance may reduce first-time discoverability] -> Keep a compact help entry point and preserve clear primary actions in the workspace header or floating toolbar.
- [A modal can obscure part of the graph while open] -> Use a balanced modal size, allow quick close, and preserve the graph state behind it.
- [Route-level shell exception can drift from repo conventions] -> Limit the exception to the graph workspace itself and keep navigation, breadcrumb, and permission handling aligned with the rest of the app.
- [Contextual controls may become too hidden if over-minimized] -> Keep the most important actions visible and group only secondary tuning options behind disclosure.

## Migration Plan

1. Remove the outer card-based page framing from `/graph-view` while preserving protected-route behavior and page identity.
2. Refactor the workbench so the default layout is graph-first and secondary controls become contextual instead of permanently expanded.
3. Replace the right-side selection inspector with a modal-based detail surface for nodes and edges.
4. Ensure hover stays lightweight and modal open or close does not trigger layout churn or viewport resets.
5. Verify the redesigned workspace on desktop and narrow layouts, then run the standard validation commands.

Rollback strategy:
- Revert the route shell and workbench presentation changes to restore the existing inspector layout.
- Because the backend contract and route structure remain unchanged, rollback is isolated to frontend composition and state management.

## Open Questions

- None for proposal readiness. The intended interaction model is specific enough to implement directly.
