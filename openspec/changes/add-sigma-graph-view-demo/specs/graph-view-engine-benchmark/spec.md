## ADDED Requirements

### Requirement: Benchmark uses identical fixtures for G6 and Sigma

The benchmark SHALL exercise the Sigma demo and a fixture-only G6 baseline using the same deterministic 100-node fixture, edge-density preset, viewport, browser, and interaction sequence. The production `/graph-view` route SHALL NOT be used as the data source for the comparison.

#### Scenario: Benchmark compares one density preset

- **WHEN** a benchmark case selects an edge-density preset
- **THEN** both engine surfaces SHALL receive the same node and edge IDs, labels, metadata, and relationships

#### Scenario: Benchmark surfaces remain isolated

- **WHEN** the benchmark runs either engine
- **THEN** it SHALL not modify production Graph View state or call the graph-view backend endpoint

### Requirement: Benchmark matrix is reproducible

The benchmark SHALL run in Chromium against the repository's fixture-backed local browser server at a 1600×900 viewport and SHALL record that server mode in its report. The production build SHALL be verified separately because the repository's test-only auth fixture intentionally does not run in production mode. The benchmark SHALL cover the 100-, 400-, and 1000-edge presets with both cold-cache and warm-cache runs, using five repetitions for each case.

#### Scenario: Cold-cache case runs

- **WHEN** a cold-cache benchmark starts
- **THEN** the layout cache SHALL be cleared or bypassed for that case
- **AND** the benchmark SHALL record the seed-render and worker-refinement phases

#### Scenario: Warm-cache case runs

- **WHEN** a warm-cache benchmark starts
- **THEN** the matching cached layout SHALL be available before navigation
- **AND** the benchmark SHALL record the immediate cached render phase

### Requirement: Benchmark measures observable performance

The benchmark SHALL record first-visible time, layout settle time, idle frame p95, drag frame p95, zoom frame p95, and long tasks over 100 milliseconds. It SHALL preserve raw samples and aggregate results for each engine, density, and cache state.

#### Scenario: Interaction metrics are collected

- **WHEN** the benchmark performs hover, node drag, canvas pan, explicit zoom, recenter, and selection actions
- **THEN** it SHALL record frame and long-task measurements for the interaction window

#### Scenario: Report is generated

- **WHEN** all repetitions complete
- **THEN** the benchmark SHALL produce a machine-readable report containing the environment, fixture preset, cache state, engine, raw samples, and aggregate metrics

### Requirement: Benchmark applies the agreed evaluation gates

The benchmark report SHALL identify whether each engine preserves the required interaction behavior, whether the 400-edge Sigma drag p95 is at or below 50 milliseconds, whether the 1000-edge Sigma interaction p95 improves by at least 2x over G6, and whether the 400-edge case contains a long task over 100 milliseconds.

#### Scenario: Sigma meets the evaluation gates

- **WHEN** Sigma passes functional parity and the agreed performance thresholds
- **THEN** the report SHALL mark Sigma as a candidate for a separate production-migration proposal

#### Scenario: Sigma misses an evaluation gate

- **WHEN** Sigma misses functional parity or any performance threshold
- **THEN** the report SHALL identify the failed gate and SHALL NOT imply that production G6 should be replaced

#### Scenario: Hardware varies

- **WHEN** the benchmark runs on a machine with different GPU or CPU characteristics
- **THEN** the report SHALL retain raw measurements and environment details
- **AND** the demo benchmark SHALL remain a report/evaluation gate rather than an unconditional CI failure
