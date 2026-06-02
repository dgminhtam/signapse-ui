## MODIFIED Requirements

### Requirement: Hover emphasizes related graph context
The graph view SHALL emphasize the hovered node and its first-degree related nodes and edges while keeping unrelated graph context visible, and performance optimizations SHALL preserve this hover dim/focus behavior for all graph sizes.

#### Scenario: Related elements are highlighted
- **WHEN** the user hovers over a node that has related edges
- **THEN** the hovered node receives the strongest visual emphasis and directly related nodes and edges are visually clearer than unrelated elements

#### Scenario: Unrelated elements remain visible
- **WHEN** the graph applies hover emphasis
- **THEN** unrelated nodes and edges remain visible enough to preserve overall graph context

#### Scenario: Dense graph hover still dims unrelated context
- **WHEN** the user hovers over a node in a dense graph
- **THEN** related nodes and edges SHALL still become visually clearer than unrelated context
- **AND** unrelated context SHALL still recede according to the normal hover spotlight behavior
- **AND** performance optimization SHALL NOT remove hover dim/focus solely because the graph is dense

### Requirement: Hover does not disturb force layout
The graph view SHALL apply hover effects without restarting the force layout, changing persisted node data, or changing layout-affecting node geometry.

#### Scenario: Hover is visually stable
- **WHEN** the user moves the pointer across graph nodes
- **THEN** node positions do not jump, re-cluster, or animate due only to hover state changes

#### Scenario: Drag remains primary during node drag
- **WHEN** the user drags a node
- **THEN** the drag interaction remains smooth and hover title display does not block dragging
- **AND** hover optimization SHALL NOT compete with or disable the node drag gesture
