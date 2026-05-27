## MODIFIED Requirements

### Requirement: Graph view shows bounded node labels by default
The graph view SHALL render readable, bounded labels for eligible visible nodes by default so users can identify graph entities without first hovering each node.

#### Scenario: Default graph render
- **WHEN** the graph canvas loads with visible nodes
- **THEN** each eligible visible node SHALL expose a short label that does not exceed the configured display budget
- **AND** the graph SHALL avoid showing full long titles for every node at once
- **AND** default labels SHALL avoid heavy opaque background boxes around the text

#### Scenario: Full title on hover
- **WHEN** the user hovers a node with a truncated or hidden default label
- **THEN** the hovered node SHALL reveal its full title through an in-canvas label treatment
- **AND** the full title SHALL take visual priority over neighboring short labels
- **AND** the graph SHALL NOT render a separate floating tooltip or hover card for the node title

#### Scenario: Non-hovered labels preserve context
- **WHEN** a node is hovered and other nodes are not directly related to that hover target
- **THEN** non-hovered labels MAY recede visually
- **AND** non-hovered labels SHALL remain visible enough to preserve spatial context when they were visible before hover

### Requirement: Hover emphasis preserves graph context
The graph view SHALL make hovered or selected nodes visually prominent while keeping non-focused nodes readable enough for spatial context.

#### Scenario: Hover a node in the global graph
- **WHEN** the user hovers a node
- **THEN** the hovered node SHALL gain a visible halo, shadow, stronger label, or equivalent emphasis treatment
- **AND** unrelated nodes SHALL remain visible rather than fading to a barely readable state
- **AND** unrelated edges MAY recede more strongly than unrelated nodes to reduce clutter

#### Scenario: Select a node or edge
- **WHEN** the user selects a graph item
- **THEN** the selected item and its relevant endpoints SHALL remain visually prominent
- **AND** the graph SHALL preserve enough surrounding context for comparison
