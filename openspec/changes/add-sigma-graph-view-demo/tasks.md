## 1. Fixture and engine boundary

- [x] 1.1 Create a deterministic 100-node fixture using the current graph node and relation kinds, stable IDs, metadata, no self-loops, and 100/400/1000-edge presets.
- [x] 1.2 Add a directed multi-edge-capable Graphology adapter that preserves fixture node IDs, edge IDs, labels, metadata, and source/target direction.
- [x] 1.3 Add versioned client layout-cache utilities keyed by fixture and layout versions, with safe parsing and invalidation for malformed or stale entries.

## 2. Sigma demo surface

- [x] 2.1 Add the protected direct-link-only Sigma demo route with no sidebar navigation entry and no graph-view API request.
- [x] 2.2 Render the fixture through Sigma WebGL with current Graph View node/edge visuals, light/dark theme support, responsive sizing, and localized surrounding UI.
- [x] 2.3 Implement deterministic seed-coordinate first visibility, ForceAtlas2 worker refinement on cache miss, warm-cache immediate rendering, explicit `Re-layout`, and stale-worker lifecycle guards.
- [x] 2.4 Implement bounded pan, explicit zoom controls with wheel zoom disabled, recenter, node dragging with session-local force reaction, and session-local dropped positions.
- [x] 2.5 Implement hover spotlight, node/edge selection, background clear, contextual label visibility, metadata inspection, and local hardcoded quick detail for event/news-article nodes.
- [x] 2.6 Add keyboard-accessible controls and overlays, localized accessible names, and a localized WebGL-unsupported state without a G6 fallback.

## 3. Fixture-only G6 baseline

- [x] 3.1 Add a direct-link-only G6 baseline route that receives the exact shared fixture and remains isolated from production `/graph-view` and the backend endpoint.
- [x] 3.2 Keep the baseline surface minimal but expose the same density presets, viewport size, and benchmark interaction targets required for A/B comparison.

## 4. Browser benchmark

- [x] 4.1 Add Playwright coverage that drives Sigma and G6 baseline surfaces independently through the shared interaction sequence.
- [x] 4.2 Add cold-cache and warm-cache cases for 100, 400, and 1000 edges with five repetitions per case in fixture-backed Chromium at 1600×900, and record the server mode.
- [x] 4.3 Collect first-visible time, layout settle time, idle frame p95, drag frame p95, zoom frame p95, long tasks over 100ms, and environment metadata.
- [x] 4.4 Write a machine-readable benchmark report retaining raw samples and aggregates by engine, density, and cache state.
- [x] 4.5 Report the agreed evaluation gates without making the demo benchmark an unconditional CI failure: functional parity, 400-edge drag p95 ≤50ms, 2x improvement at 1000 edges, and no >100ms long task at 400 edges.

## 5. Verification and change hygiene

- [x] 5.1 Add focused tests for fixture determinism, density selection, cache version invalidation, and graph direction preservation.
- [x] 5.2 Run lint, typecheck, production build, OpenSpec validation, and the Graph View browser tests; fix regressions without changing production Graph View behavior.
- [x] 5.3 Review the final diff to confirm no backend/API changes, no production G6 migration, no unlocalized new UI copy, and no unused Sigma/G6 demo code.

Verification note: browser checks pass with `SIGNAPSE_E2E_NEXT_BUNDLER=webpack`; the default Turbopack dev server exhausted its heap during repeated graph-route navigation in this workstation, so it is not used for the benchmark evidence.
