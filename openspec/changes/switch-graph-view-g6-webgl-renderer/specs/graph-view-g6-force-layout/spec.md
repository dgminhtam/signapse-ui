## MODIFIED Requirements

### Requirement: Graph view renders through a G6 force canvas
The graph view SHALL render the current backend graph payload through a client-only G6 canvas using a force-directed layout and WebGL renderer.

#### Scenario: Render graph payload
- **WHEN** the backend returns graph nodes and edges for `/graph-view`
- **THEN** the graph view SHALL map that payload into G6 nodes and edges
- **AND** the graph view SHALL render the mapped graph without requiring backend contract changes
- **AND** the graph view SHALL preserve stable node and edge ids from the payload

#### Scenario: Browser-only canvas
- **WHEN** the graph view route is server-rendered or built by Next.js
- **THEN** the G6 canvas SHALL remain isolated behind a client-only boundary
- **AND** browser-only rendering APIs SHALL NOT be evaluated during server module execution

#### Scenario: WebGL renderer initialization
- **WHEN** Graph View creates the G6 graph instance
- **THEN** the graph SHALL use the G6 WebGL renderer from `@antv/g-webgl`
- **AND** existing force layout, drag, hover, selection, zoom, recenter, and quick-detail behavior SHALL remain available
