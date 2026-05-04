## ADDED Requirements

### Requirement: Graph view presents a canvas-first workspace
The graph view SHALL render the graph canvas as the only primary content surface when graph data exists.

#### Scenario: Render graph data
- **WHEN** the backend graph response contains nodes
- **THEN** the page SHALL show a single dominant graph canvas workspace
- **AND** the page SHALL NOT render a separate hero title, experiment badges, explanatory layout card, metric cards, or edge chips outside the canvas

#### Scenario: Preserve graph interactions
- **WHEN** the user interacts with the canvas
- **THEN** existing graph pan, zoom, drag, bounded-space, and recenter behavior SHALL remain available

### Requirement: Graph view shows graph metadata as in-canvas HUD overlays
The graph view SHALL show useful graph counts as compact overlays inside the canvas instead of external cards.

#### Scenario: Show canvas identity
- **WHEN** graph data exists
- **THEN** the top-left canvas HUD SHALL show `Biểu đồ tri thức`
- **AND** it SHALL NOT show the `D3 force layout` label or a descriptive paragraph

#### Scenario: Show node-kind counts
- **WHEN** graph data exists
- **THEN** node-kind counts SHALL appear inside the canvas at the top-right or right edge
- **AND** the counts SHALL include the available node kinds from the current graph model

#### Scenario: Show lower-priority total counts
- **WHEN** graph data exists
- **THEN** the total node and edge summary SHALL appear inside the canvas at the bottom-left
- **AND** this summary SHALL be visually lower priority than the graph itself

#### Scenario: Show edge-kind counts
- **WHEN** graph data exists
- **THEN** edge-kind counts SHALL appear inside the canvas at the bottom-right
- **AND** relation labels SHALL remain concise Vietnamese labels

### Requirement: Graph view uses compact accessible canvas controls
The graph view SHALL keep canvas controls compact while preserving accessibility.

#### Scenario: Recenter control
- **WHEN** graph data exists
- **THEN** the recenter control SHALL render as an icon-only control
- **AND** the control SHALL expose an accessible Vietnamese label such as `Đưa biểu đồ về trung tâm`
- **AND** activating the control SHALL keep the existing recenter behavior

### Requirement: Graph view loading and empty states match the simplified hierarchy
The graph view SHALL keep loading and empty states aligned with the canvas-first hierarchy.

#### Scenario: Loading graph view
- **WHEN** graph view data is loading
- **THEN** the skeleton SHALL mirror a single canvas-first workspace
- **AND** it SHALL NOT reserve space for removed hero, explanatory cards, or metric cards

#### Scenario: Empty graph response
- **WHEN** the backend graph response contains no nodes
- **THEN** the page SHALL preserve a clear Vietnamese empty state
- **AND** the empty state SHALL remain the primary content surface for that state
