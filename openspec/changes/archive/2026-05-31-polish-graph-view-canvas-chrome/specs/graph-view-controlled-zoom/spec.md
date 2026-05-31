## MODIFIED Requirements

### Requirement: Icon controls provide explicit zoom
The graph view SHALL provide compact icon-only controls for zooming in, zooming out, and recentering the graph, using an installed shadcn grouped-control composition.

#### Scenario: User zooms in intentionally
- **WHEN** the user activates the zoom-in icon control
- **THEN** the graph viewport zooms in by a small bounded step

#### Scenario: User zooms out intentionally
- **WHEN** the user activates the zoom-out icon control
- **THEN** the graph viewport zooms out by a small bounded step

#### Scenario: User recenters graph
- **WHEN** the user activates the recenter icon control
- **THEN** the graph returns to a centered view of the rendered graph
- **AND** the recenter icon SHALL communicate locate or focus behavior rather than undo/reset behavior

#### Scenario: Viewport controls are grouped
- **WHEN** graph data exists
- **THEN** the explicit viewport controls SHALL appear as a single shadcn `ButtonGroup`
- **AND** the order SHALL place recenter between zoom out and zoom in
- **AND** each control SHALL retain a clear accessible name
