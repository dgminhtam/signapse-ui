## Why

The current Knowledge Graph canvas becomes noticeably laggy with approximately 100 nodes and dense edge sets, especially during node dragging and other continuous interactions. We need a frontend-only, behavior-compatible Sigma.js + Graphology trial that produces measurable evidence before considering any production renderer change, without involving the backend.

## What Changes

- Add a protected, direct-link-only Sigma.js + Graphology Knowledge Graph demo route.
- Render a deterministic hardcoded fixture of 100 nodes with 100, 400, and 1000 edge-density presets.
- Preserve the current Graph View browsing behavior, visual semantics, theme support, localization, and local quick-detail behavior.
- Render immediately from deterministic or cached client-side positions and refine first-time layouts in a client worker.
- Keep dragged positions session-local and cache only generated layout positions by fixture/layout version.
- Add a fixture-only G6 baseline route using the same data for fair A/B benchmarking; do not change the production `/graph-view` route.
- Add Playwright performance coverage for first-visible time, layout settling, frame p95 during interactions, and long tasks.
- Show a localized unsupported state when WebGL is unavailable instead of falling back to another engine.

## Capabilities

### New Capabilities

- `sigma-graph-view-demo`: Frontend-only Sigma.js + Graphology demo with deterministic fixture data, current Graph View interaction parity, client-side layout/cache behavior, and WebGL capability handling.
- `graph-view-engine-benchmark`: Fixture-based G6/Sigma browser benchmark with reproducible interaction scenarios and performance reporting.

### Modified Capabilities

None. The production Graph View route, backend contract, and G6 implementation remain unchanged in this change.

## Impact

- Adds a new client-side graph demo surface and an internal G6 comparison surface.
- Reuses the existing Sigma.js, Graphology, and ForceAtlas2 dependencies already present in the project.
- Adds no backend endpoint, schema, persistence, or API contract changes.
- Adds browser performance test/reporting coverage and local fixture data.
- Does not migrate or remove G6 from the production Graph View.
