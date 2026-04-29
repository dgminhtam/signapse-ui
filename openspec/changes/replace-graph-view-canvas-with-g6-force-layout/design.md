## Context

`/graph-view` currently renders graph data with Sigma and graphology. Recent fixes improved SSR isolation, multigraph support, labels, dragging, and spacing, but the user's desired interaction model is closer to AntV G6's force-directed examples: clustered teams, collision-aware force layout, and drag behavior where connected nodes move elastically with the dragged node.

This change intentionally treats the graph canvas as a rebuild. The first phase should prove the G6 visual and motion model with minimal behavior, rather than trying to port every Sigma-specific feature in one step.

## Goals / Non-Goals

**Goals:**

- Replace the Sigma canvas with a G6-rendered force graph MVP.
- Render current backend `nodes` and `edges` without changing `/graph-view` API contracts.
- Use G6 D3 force layout with collision spacing and force-directed drag behavior.
- Create simple team clustering so related events, assets, themes, and source documents form readable groups.
- Keep the graph view route, cardless page shell, data fetch, loading, and empty state intact.
- Keep UI copy in Vietnamese and preserve the current color semantics by node kind where practical.

**Non-Goals:**

- Restoring every current Sigma behavior in the first G6 iteration.
- Rebuilding modal detail inspection, local focus controls, hover full-title cards, contextual edge-label toggles, or advanced inspector panels.
- Persisting graph positions or sending drag mutations to the backend.
- Changing backend graph response shape or introducing server-side layout.
- Supporting every possible G6 behavior before the MVP validates the visual direction.

## Decisions

### Replace the canvas layer with G6, not the whole page

The implementation should keep `app/(main)/graph-view/page.tsx` and the high-level workbench fetch/empty/loading flow, but replace the canvas-specific rendering path. The G6 component should remain client-only, just like the current Sigma canvas, to avoid SSR issues with browser APIs.

Why:
- The surrounding graph view route already handles data fetch, workspace layout, and empty state well.
- G6 is only needed for the canvas and layout model.
- A client-only boundary avoids repeating the `WebGL2RenderingContext is not defined` class of bugs.

Alternatives considered:
- Rewrite the whole graph view page. Rejected because the user wants the layout behavior first, not a full product redesign.
- Keep Sigma and emulate G6 with custom helpers. Rejected because the target interaction model is native to G6 and would create more custom maintenance.

### Use a minimal G6 MVP behavior set

The initial G6 canvas should enable only the behaviors required to validate the vision:

- Canvas drag and zoom.
- Force-directed element drag.
- Basic click selection only if needed for visual feedback.

The first pass should not reimplement all current modal/inspector behavior. If a selection panel remains in the workbench, it may be hidden, simplified, or disconnected until a later change reintroduces detail UX on top of G6.

Why:
- Replacing renderer and layout engine is already a large enough risk.
- A smaller behavior surface makes it easier to debug G6 lifecycle, layout, resize, and data mapping.

Alternatives considered:
- Port all existing Sigma features immediately. Rejected because it increases risk and makes it harder to validate the core layout direction.

### Build team clustering from graph anchors

The G6 data mapper should assign a lightweight cluster key to each node. The first strategy should be deterministic and local to the payload:

- Asset and theme nodes are their own cluster anchors.
- Event nodes prefer connected asset or theme anchors, weighted by relation type and edge weight when available.
- Source-document or news-article nodes inherit the cluster of their connected event when possible.
- Fallback nodes use their node kind or own id as cluster key.

The layout should use cluster keys to make same-team relationships shorter or stronger than cross-team relationships. Visual styling can keep node kind colors so users still understand entity type while spatial grouping communicates relationship context.

Why:
- Clustering by node kind alone would create color bands but not analytical groups.
- Asset/theme anchors match the domain: users think in market instruments and themes.

Alternatives considered:
- Cluster only by node kind. Rejected because it does not match financial analysis workflows.
- Require backend cluster metadata. Rejected for this MVP because the current payload already contains enough relationships to infer useful anchors.

### Let G6 own force and drag motion

The G6 layout should use a D3 force style setup with collision, link distance/strength, charge, and center forces. Dragging a node should use G6 force behavior so related nodes react elastically while the layout remains bounded and readable.

Why:
- This is the exact visual behavior the user is asking for.
- Native G6 force behavior should be less fragile than custom drag math on Sigma.

Alternatives considered:
- Keep the deterministic post-layout no-overlap helper. Rejected for this MVP because G6 collision force should own spacing.

### Keep multigraph semantics in data, even if visual edges are simplified

The existing backend can return multiple edges between the same source and target with different relation types. The mapper should keep stable edge ids and relation metadata, but the first G6 MVP may visually simplify parallel edges if G6 defaults do not support them cleanly.

Why:
- Data correctness matters even in an MVP.
- Visual edge sophistication can be handled after the core layout is proven.

## Risks / Trade-offs

- [Dependency and API uncertainty] -> Mitigate by keeping the first pass small and checking G6 imports/types during implementation before deeper behavior work.
- [Regression of existing inspector features] -> Mitigate by documenting this as an intentional MVP non-goal and restoring detail UX in later changes.
- [Force layout jitter] -> Mitigate with bounded force parameters, collision radius, and no continuous layout restart except during drag.
- [SSR/browser API errors] -> Mitigate by preserving dynamic client-only loading for the G6 canvas component.
- [Multigraph visual simplification] -> Mitigate by preserving ids/metadata in mapped edges and deferring advanced parallel-edge drawing.

## Migration Plan

1. Add `@antv/g6`.
2. Replace or isolate the Sigma canvas component with a client-only G6 canvas component.
3. Add G6 data mapping from current graph view payload/model.
4. Configure D3 force layout, collision, team clustering, zoom/pan, and drag-force behavior.
5. Simplify or hide controls that depend on Sigma-only state until they are rebuilt.
6. Verify dense payload rendering, drag-force behavior, resize cleanup, route build, and empty state.

Rollback strategy:
- Revert the G6 canvas changes and dependency addition. Backend payloads and route data contracts remain unchanged.

## Open Questions

- Whether Phase 2 should restore modal detail inspection first, or focus on label/tooltip polish after the G6 MVP is visually accepted.
