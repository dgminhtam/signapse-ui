## MODIFIED Requirements

### Requirement: Hover emphasizes related graph context
The graph view SHALL emphasize the hovered node and its first-degree related nodes and edges using G6 hover activation semantics while dimming unrelated graph context in the same interaction pass.

#### Scenario: Related elements are highlighted
- **WHEN** the user hovers over a node that has related edges
- **THEN** the hovered node and its first-degree related nodes and edges receive the hover highlight state
- **AND** unrelated nodes and edges receive the dim state
- **AND** the graph uses G6 hover activation behavior instead of a separate custom pointer-enter active-state writer

#### Scenario: Unrelated elements remain visible
- **WHEN** the graph applies hover emphasis
- **THEN** unrelated nodes and edges remain visible enough to preserve overall graph context
- **AND** unrelated labels are not dimmed so strongly that their visible text becomes unreadable
