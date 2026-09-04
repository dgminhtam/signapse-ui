## Context

The production Graph View currently renders the shared graph through a client-only G6 force canvas. Existing performance measurements show that dense edge sets make the render/update path and force-driven dragging expensive, with the largest cost occurring during continuous interaction rather than in the surrounding React chrome.

This change evaluates Sigma.js + Graphology without changing the backend contract or the production Graph View. The demo needs a deterministic fixture, an isolated engine boundary, client-owned layout/cache state, and a second G6 fixture surface so both engines can be measured against exactly the same graph.

The repository already contains Sigma, Graphology, and ForceAtlas2 dependencies. The implementation must respect the existing Graph View visual vocabulary, controlled zoom behavior, local quick-detail overlay conventions, permission boundary, localization, and design-system rules.

## Goals / Non-Goals

**Goals:**

- Provide a direct-link-only, protected Sigma demo with 100 deterministic nodes.
- Preserve the current Graph View browsing behavior and visual semantics.
- Make first paint independent from waiting for force simulation.
- Run client-side layout refinement in a worker and reuse generated positions from a versioned cache.
- Provide 100-, 400-, and 1000-edge density presets.
- Provide a fixture-only G6 baseline with the same fixture for fair A/B comparison.
- Produce reproducible browser performance measurements and a concise report.
- Keep the demo responsive, localized, theme-aware, and keyboard-accessible at the control/overlay level.

**Non-Goals:**

- Replacing G6 in the production `/graph-view` route.
- Changing the graph-view backend endpoint, schema, or persistence model.
- Persisting user-dragged node positions.
- Implementing real entity deep-links or fetching real quick-detail data from the demo.
- Adding graph search, filtering, editing, or a new graph domain model.
- Providing a G6 fallback when Sigma WebGL is unavailable.

## Decisions

### 1. Isolate the evaluation surfaces

The Sigma demo and G6 baseline are separate direct-link-only surfaces. Both receive the same frontend fixture, while the production route remains untouched. This keeps the A/B comparison focused on the rendering/layout engine and avoids comparing unrelated backend payloads or route state.

Alternatives considered:

- Adding an engine toggle to the production route: rejected because it increases production complexity and can make measurements dependent on toggle state.
- Comparing Sigma against the live production route: rejected because the production route can receive different data and API timing.

### 2. Use a current-contract deterministic fixture

The fixture uses the four current node kinds (`event`, `asset`, `news-article`, and `narrative`) and current relation kinds. It contains 100 nodes, no self-loops, stable IDs, deterministic labels/metadata, and three edge-density presets. The Graphology representation is directed and multi-edge capable so source/target direction and stable edge identity are preserved.

Alternatives considered:

- Reusing an old fixture with `theme` or `source-document` nodes: rejected because it would not represent the current runtime contract.
- Generating random data on every load: rejected because it prevents meaningful A/B comparison.

### 3. Separate first visibility from layout refinement

On a cache miss, the graph first renders using deterministic seed coordinates. A ForceAtlas2 worker then refines those coordinates without blocking the first visible state. On a cache hit, the cached positions render immediately and automatic refinement is skipped; an explicit `Re-layout` action starts a new worker run and replaces the versioned cache when complete.

Generated layouts are cached by fixture version and layout version. Manual drag positions remain in memory for the current session only and never overwrite the generated cache.

Alternatives considered:

- Waiting for ForceAtlas2 before first render: rejected because it reproduces the current perceived wait.
- Re-running refinement on every cache hit: rejected because it makes reopening non-deterministic and adds unnecessary work.
- Persisting manual drag positions: rejected because current Graph View positions are client-session state and must not become user data.

### 4. Use Sigma WebGL with Graphology state

Graphology owns the in-memory node/edge model and adjacency relationships. Sigma owns WebGL rendering, camera updates, picking, and render scheduling. Rendering settings hide edges and labels during movement, use contextual label thresholds, and disable edge events unless the interaction requires them. React owns only the surrounding controls, inspector, overlay state, and fixture preset selection.

Alternatives considered:

- G6 Canvas optimization only: useful for production follow-up, but it would not test the requested alternative renderer.
- Cytoscape: capable, but the current evaluation target is a WebGL-first renderer with Graphology-compatible layout tooling.
- React force-graph: useful for force simulations, but less aligned with the existing 2D node/edge inspection surface.

### 5. Preserve interaction semantics at the route boundary

The demo keeps pan, explicit zoom controls, recenter, node dragging with local force reaction, hover spotlight, node/edge selection, background clear, contextual labels, and local quick detail. The visual mapping and light/dark palette are reused from the current Graph View. Existing quick-detail presentation is reused with fixture content for event and news-article nodes.

The graph itself remains pointer-driven. All surrounding buttons, overlays, drawers, and modal-like surfaces expose keyboard focus and accessible Vietnamese/English names. WebGL failure is represented by a localized unsupported state rather than silently switching engines.

### 6. Benchmark through observable browser behavior

Playwright navigates the Sigma and G6 fixture surfaces independently, selects the same edge-density preset, performs the same interaction sequence, and records first-visible time, settle time, idle frame p95, drag/zoom frame p95, and long tasks. The primary browser environment is the repository's fixture-backed local Chromium lane at 1600×900, with five cold-cache and five warm-cache runs per case. The production build is verified separately; the fixture lane remains development-mode because the repository intentionally disables its auth fixture in `NODE_ENV=production` and no real Clerk credentials are available in this task.

The report uses both absolute and relative signals: functional parity is required; 400-edge drag p95 targets 50 ms or less; 1000-edge interaction should improve by at least 2x against G6; and the 400-edge case should not produce long tasks over 100 ms. These are evaluation gates for deciding whether to propose a later production migration, not a change to the existing production CI budget. The benchmark runner records its dev bundler; on the current workstation it is invoked with `SIGNAPSE_E2E_NEXT_BUNDLER=webpack` because repeated Sigma route compilation under Turbopack exhausts the development server heap before the matrix completes.

## Risks / Trade-offs

- [Risk] WebGL support or GPU driver behavior varies by machine → Keep the demo desktop-Chromium focused, detect unsupported WebGL explicitly, and record environment details in the report.
- [Risk] Worker layout messages arrive after a remount → Attach work to a lifecycle token and ignore stale results before updating graph state or cache.
- [Risk] Cached positions become incompatible with changed fixture data → Include fixture and layout versions in the cache key and replace the cache after explicit re-layout.
- [Risk] Sigma rendering improves while force layout remains expensive → Report renderer-only and worker-layout phases separately instead of attributing all gains to Sigma.
- [Risk] Hidden labels/edges change perceived behavior → Apply hiding only during movement and reveal selected/hovered context immediately after interaction settles.
- [Risk] Reusing production inspector components creates coupling → Reuse existing presentation primitives where behavior is already correct; keep fixture data and demo orchestration separate.
- [Risk] The benchmark route itself changes results through React work → Keep engine surfaces minimal and report route-level overhead consistently for both engines.

## Migration Plan

1. Add the fixture, Sigma demo surface, G6 fixture baseline, and browser benchmark without changing production Graph View.
2. Run the benchmark and review functional parity plus performance report.
3. If Sigma meets the agreed gates, create a separate follow-up proposal for production migration and re-run the benchmark with real payload considerations.
4. If Sigma does not meet the gates, retain G6 and use the report to target client-side optimizations; the demo may remain as an evaluation artifact.

Rollback is limited to removing or disabling the direct-link-only evaluation surfaces and benchmark; no production route or backend rollback is required.

## Open Questions

None. Requirements and the fixture-only G6 comparison seam were confirmed before this design was created.
