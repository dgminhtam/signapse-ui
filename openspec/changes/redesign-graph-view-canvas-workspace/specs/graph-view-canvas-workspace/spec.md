## ADDED Requirements

### Requirement: Graph view MUST render as a canvas-first workspace
The `/graph-view` surface SHALL treat the graph canvas as the dominant workspace and MUST not wrap the main experience in the repo's standard information-card shell.

#### Scenario: Desktop route opens as a graph-first workspace
- **WHEN** an authorized user opens `/graph-view` on a desktop-width viewport
- **THEN** the graph canvas MUST be presented as the primary surface without an outer `Card` container framing the full page content

#### Scenario: Secondary guidance no longer competes equally with the canvas
- **WHEN** the graph-view page first loads
- **THEN** overview copy, helper guidance, and graph settings MUST appear in compact or contextual regions instead of a persistent equal-weight information column

### Requirement: Graph view MUST present selection details in a modal surface
The graph-view workspace SHALL show node and edge details in a modal inspection surface instead of a persistent right-side inspector.

#### Scenario: Selecting a node opens modal inspection
- **WHEN** a user selects a node in the graph
- **THEN** the page MUST open a modal that shows the node label, node kind, available graph metadata, and any supported follow-up actions already allowed by the route

#### Scenario: Selecting an edge opens modal inspection
- **WHEN** a user selects an edge in the graph
- **THEN** the page MUST open a modal that shows the edge kind, relation type, and any available relation metadata from the original graph-view payload

#### Scenario: Closing the modal preserves browse context
- **WHEN** a user closes the node or edge detail modal
- **THEN** the graph MUST remain on the same route with the same camera position and without a forced layout reset

### Requirement: Graph view MUST keep controls and settings contextual by default
The graph-view workspace SHALL keep secondary controls behind on-demand surfaces so the default state is visually calm and focused on the graph.

#### Scenario: Default load hides expanded secondary settings
- **WHEN** the page finishes loading
- **THEN** advanced display settings, expanded legend content, and long helper text MUST NOT all be visible at the same time by default

#### Scenario: Users can reveal graph settings on demand
- **WHEN** a user opens the graph controls or settings entry point
- **THEN** the page MUST reveal those controls in a contextual overlay, drawer, popover, or similar transient surface without restoring a fixed inspector-style layout

### Requirement: Graph view MUST keep hover exploration lightweight
The graph-view workspace SHALL use hover for lightweight emphasis only and reserve rich inspection for click selection.

#### Scenario: Hover highlights without opening the modal
- **WHEN** a user hovers a node in the graph
- **THEN** the page MUST highlight local relationships without opening the selection modal

#### Scenario: Hover does not disturb graph layout
- **WHEN** a user hovers into and out of graph nodes repeatedly
- **THEN** node positions and the surrounding workspace chrome MUST remain stable without a visible layout recomputation or viewport reset
