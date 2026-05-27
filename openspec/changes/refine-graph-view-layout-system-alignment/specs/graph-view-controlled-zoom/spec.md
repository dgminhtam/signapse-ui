## MODIFIED Requirements

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
