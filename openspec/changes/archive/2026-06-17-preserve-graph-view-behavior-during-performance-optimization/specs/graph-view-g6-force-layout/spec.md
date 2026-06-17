## MODIFIED Requirements

### Requirement: Graph view supports force-directed drag exploration
The graph view SHALL allow users to drag graph elements with force behavior so connected nodes react while preserving overall graph readability, and performance optimizations SHALL NOT disable or materially weaken this behavior based on graph size.

#### Scenario: Drag a node
- **WHEN** the user drags a graph node
- **THEN** the dragged node SHALL follow the pointer
- **AND** connected or clustered nodes SHALL react through the force layout rather than remaining completely static
- **AND** the graph SHALL avoid sending backend mutations for drag positions

#### Scenario: Dense graph drag preserves force reaction
- **WHEN** the user drags a node in a dense graph
- **THEN** the dragged node SHALL still follow the pointer
- **AND** connected or clustered nodes SHALL still react through the force layout
- **AND** performance optimization SHALL NOT disable animation or force-layout reaction solely because the graph is dense

#### Scenario: Drop a dragged node
- **WHEN** the user releases a dragged graph node
- **THEN** the node SHALL remain fixed at the dropped position for the current client-side graph session
- **AND** the fixed position SHALL NOT be persisted to the backend
- **AND** the rest of the force layout SHALL remain able to react around the fixed node

#### Scenario: Navigate canvas
- **WHEN** the user pans or zooms the graph canvas
- **THEN** the graph view SHALL update the viewport without rebuilding the backend graph data
- **AND** the force layout SHALL remain usable after viewport changes

### Requirement: Graph view uses team clustering force layout
The graph view SHALL group related graph entities into readable force-directed teams based on graph relationships, and performance optimizations SHALL preserve the previous team-clustering motion and settle behavior.

#### Scenario: Assign cluster anchors
- **WHEN** the frontend maps graph nodes for the G6 canvas
- **THEN** asset and theme nodes SHALL be eligible as cluster anchors
- **AND** event nodes SHALL prefer connected asset or theme anchors when one is available
- **AND** source-document or news-article nodes SHALL inherit a connected event cluster when one is available

#### Scenario: Render clustered layout
- **WHEN** the G6 force layout runs
- **THEN** nodes in the same inferred cluster SHALL be visually closer than unrelated nodes where practical
- **AND** cross-cluster edges SHALL remain visible without collapsing all clusters into a single pile
- **AND** performance optimization SHALL NOT remove the visible force-layout settle behavior solely because the graph is dense
