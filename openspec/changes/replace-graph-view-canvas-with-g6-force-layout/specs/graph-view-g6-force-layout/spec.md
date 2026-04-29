## ADDED Requirements

### Requirement: Graph view renders through a G6 force canvas
The graph view SHALL render the current backend graph payload through a client-only G6 canvas using a force-directed layout.

#### Scenario: Render graph payload
- **WHEN** the backend returns graph nodes and edges for `/graph-view`
- **THEN** the graph view SHALL map that payload into G6 nodes and edges
- **AND** the graph view SHALL render the mapped graph without requiring backend contract changes
- **AND** the graph view SHALL preserve stable node and edge ids from the payload

#### Scenario: Browser-only canvas
- **WHEN** the graph view route is server-rendered or built by Next.js
- **THEN** the G6 canvas SHALL remain isolated behind a client-only boundary
- **AND** browser-only rendering APIs SHALL NOT be evaluated during server module execution

### Requirement: Graph view uses team clustering force layout
The graph view SHALL group related graph entities into readable force-directed teams based on graph relationships.

#### Scenario: Assign cluster anchors
- **WHEN** the frontend maps graph nodes for the G6 canvas
- **THEN** asset and theme nodes SHALL be eligible as cluster anchors
- **AND** event nodes SHALL prefer connected asset or theme anchors when one is available
- **AND** source-document or news-article nodes SHALL inherit a connected event cluster when one is available

#### Scenario: Render clustered layout
- **WHEN** the G6 force layout runs
- **THEN** nodes in the same inferred cluster SHALL be visually closer than unrelated nodes where practical
- **AND** cross-cluster edges SHALL remain visible without collapsing all clusters into a single pile

### Requirement: Graph view supports force-directed drag exploration
The graph view SHALL allow users to drag graph elements with force behavior so connected nodes react while preserving overall graph readability.

#### Scenario: Drag a node
- **WHEN** the user drags a graph node
- **THEN** the dragged node SHALL follow the pointer
- **AND** connected or clustered nodes SHALL react through the force layout rather than remaining completely static
- **AND** the graph SHALL avoid sending backend mutations for drag positions

#### Scenario: Navigate canvas
- **WHEN** the user pans or zooms the graph canvas
- **THEN** the graph view SHALL update the viewport without rebuilding the backend graph data
- **AND** the force layout SHALL remain usable after viewport changes

### Requirement: Graph view MVP keeps behavior intentionally minimal
The first G6 canvas implementation SHALL focus on rendering and force exploration before restoring advanced Sigma-era inspection behavior.

#### Scenario: Defer advanced inspection behavior
- **WHEN** the G6 canvas MVP is implemented
- **THEN** hover full-title cards, modal detail inspection, local focus controls, contextual edge-label toggles, and position persistence SHALL NOT be required for completion
- **AND** the graph route SHALL still provide an empty state when no graph data is available
- **AND** the graph route SHALL remain buildable and navigable
