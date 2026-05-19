# graph-view-interaction-space Specification

## Purpose
TBD - created by archiving change bound-graph-view-interaction-space. Update Purpose after archive.
## Requirements
### Requirement: Graph view constrains canvas panning to a recoverable workspace
The graph view SHALL allow users to pan the G6 canvas within a finite workspace range and SHALL prevent indefinite viewport drift away from the graph.

#### Scenario: Pan canvas within the allowed range
- **WHEN** the user drags the graph canvas within the configured workspace range
- **THEN** the viewport SHALL move normally
- **AND** the graph SHALL remain explorable without forcing an immediate recenter

#### Scenario: Pan canvas beyond the allowed range
- **WHEN** the user attempts to drag the graph canvas beyond the configured workspace range
- **THEN** the viewport SHALL stop at the range boundary
- **AND** the user SHALL NOT be able to pan indefinitely into empty space

### Requirement: Graph view keeps dragged nodes inside an analysis bounds
The graph view SHALL constrain manually dragged nodes to a frontend-only analysis bounds around the graph workspace.

#### Scenario: Drag node inside the analysis bounds
- **WHEN** the user drags a graph node to a position inside the analysis bounds
- **THEN** the node SHALL move to that position
- **AND** the dropped node SHALL remain fixed for the current client-side graph session
- **AND** connected or clustered nodes SHALL remain able to react through the force layout

#### Scenario: Drag node beyond the analysis bounds
- **WHEN** the user attempts to drag a graph node beyond the analysis bounds
- **THEN** the node position SHALL be clamped to the nearest valid point inside the bounds
- **AND** the frontend SHALL NOT send a backend mutation for the clamped position

#### Scenario: Remount graph canvas after manual dragging
- **WHEN** the graph canvas remounts or graph data is refetched
- **THEN** any manual drag bounds and fixed positions SHALL be allowed to reset from the current graph payload and force layout

### Requirement: Graph view provides an explicit recenter control
The graph view SHALL provide a visible control that returns the G6 viewport to the main graph workspace.

#### Scenario: Recenter from an offset viewport
- **WHEN** the user activates `Đưa về trung tâm`
- **THEN** the graph viewport SHALL animate back to the main graph workspace
- **AND** the graph SHALL remain within the bounded interaction space

#### Scenario: Recenter after graph cleanup starts
- **WHEN** the graph canvas has begun cleanup or the graph instance has been destroyed
- **THEN** activating or resolving the recenter action SHALL NOT run viewport operations against the destroyed graph instance

