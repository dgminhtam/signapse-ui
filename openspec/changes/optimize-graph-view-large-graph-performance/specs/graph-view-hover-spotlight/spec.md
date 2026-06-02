## MODIFIED Requirements

### Requirement: Hover emphasizes related graph context
The graph view SHALL emphasize the hovered node and its first-degree related nodes and edges while keeping unrelated graph context visible and avoiding broad full-graph state churn on dense payloads.

#### Scenario: Related elements are highlighted
- **WHEN** the user hovers over a node that has related edges
- **THEN** the hovered node receives the strongest visual emphasis and directly related nodes and edges are visually clearer than unrelated elements
- **AND** the hover update targets the affected hover context instead of rebuilding the graph or restyling every graph element where practical

#### Scenario: Unrelated elements remain visible
- **WHEN** the graph applies hover emphasis
- **THEN** unrelated nodes and edges remain visible enough to preserve overall graph context
- **AND** unrelated nodes are not dimmed so strongly that their labels become unreadable when they were visible before hover

### Requirement: Hover does not disturb force layout
The graph view SHALL apply hover effects without restarting the force layout, changing persisted node data, changing layout-affecting node geometry, or triggering unnecessary graph-wide animation.

#### Scenario: Hover is visually stable
- **WHEN** the user moves the pointer across graph nodes
- **THEN** node positions do not jump, re-cluster, or animate due only to hover state changes

#### Scenario: Drag remains primary during node drag
- **WHEN** the user drags a node
- **THEN** the drag interaction remains smooth and hover title display does not block dragging
- **AND** hover state updates do not compete with the active drag gesture
