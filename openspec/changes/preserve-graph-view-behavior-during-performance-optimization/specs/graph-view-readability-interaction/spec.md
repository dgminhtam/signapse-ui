## MODIFIED Requirements

### Requirement: Graph view shows bounded node labels by default
The graph view SHALL render readable, bounded labels for eligible visible nodes by default so users can identify graph entities without first hovering each node, and performance optimizations SHALL preserve hover/selected full-title reveal and graph interaction behavior.

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

#### Scenario: Label optimization does not change interaction behavior
- **WHEN** the graph applies label or visual-cost optimization for a dense payload
- **THEN** node drag, linked force reaction, hover dim/focus, click selection, and quick detail behavior SHALL remain available
- **AND** full-title reveal on hover or selection SHALL remain available for nodes whose default labels are hidden
