# graph-view-controlled-zoom Specification

## Purpose
TBD - created by archiving change graph-view-icon-zoom-controls. Update Purpose after archive.
## Requirements
### Requirement: Wheel zoom is disabled

The graph view SHALL NOT zoom the graph canvas in response to ordinary mouse-wheel or trackpad scroll gestures.

#### Scenario: Wheel gesture does not zoom graph

- **WHEN** the user scrolls the mouse wheel or trackpad over the graph canvas
- **THEN** the graph viewport zoom level remains unchanged

### Requirement: Icon controls provide explicit zoom
The graph view SHALL provide compact icon-only controls for zooming in, zooming out, and recentering the graph, and those controls SHALL be presented as graph actions rather than graph metadata.

#### Scenario: User zooms in intentionally
- **WHEN** the user activates the zoom-in icon control
- **THEN** the graph viewport zooms in by a small bounded step

#### Scenario: User zooms out intentionally
- **WHEN** the user activates the zoom-out icon control
- **THEN** the graph viewport zooms out by a small bounded step

#### Scenario: User recenters graph
- **WHEN** the user activates the recenter icon control
- **THEN** the graph returns to a centered view of the rendered graph

#### Scenario: Zoom controls are separated from count chips
- **WHEN** graph data exists
- **THEN** the zoom and recenter controls SHALL appear in a dedicated compact control group
- **AND** the controls SHALL NOT be visually merged with node-kind count chips, relationship count chips, or status summaries

### Requirement: Zoom remains bounded

The graph view SHALL keep explicit zoom within a conservative analysis range so users cannot easily lose graph context.

#### Scenario: Zoom in respects upper bound

- **WHEN** the user repeatedly activates zoom in
- **THEN** the graph viewport does not exceed the configured maximum zoom level

#### Scenario: Zoom out respects lower bound

- **WHEN** the user repeatedly activates zoom out
- **THEN** the graph viewport does not go below the configured minimum zoom level

### Requirement: Existing graph interactions remain intact

The graph view SHALL preserve drag canvas, drag node, hover spotlight, dark-mode label readability, and recenter behavior after wheel zoom is removed.

#### Scenario: Drag and hover still work

- **WHEN** the user drags nodes, pans the canvas, or hovers a node
- **THEN** those interactions behave as they did before icon-based zoom controls were added

#### Scenario: Controls are accessible

- **WHEN** assistive technology reads the zoom controls
- **THEN** each control has a clear Vietnamese accessible name

