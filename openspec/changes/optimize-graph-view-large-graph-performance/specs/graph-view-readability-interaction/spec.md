## MODIFIED Requirements

### Requirement: Graph view shows bounded node labels by default
The graph view SHALL render readable, bounded labels for eligible visible nodes by default so users can identify graph entities without first hovering each node, and SHALL apply a stricter performance-aware label priority policy on dense payloads.

#### Scenario: Default graph render
- **WHEN** the graph canvas loads with visible nodes
- **THEN** each eligible visible node SHALL expose a short label that does not exceed the configured display budget
- **AND** the graph SHALL avoid showing full long titles for every node at once
- **AND** default labels SHALL avoid heavy opaque background boxes around the text

#### Scenario: Dense graph default label budget
- **WHEN** the graph contains enough nodes or edges to qualify as dense
- **THEN** the graph SHALL reduce default labels for lower-priority event and article nodes
- **AND** the graph SHALL preserve labels for orientation anchors such as asset, theme, selected, hovered, local-focus center, selected-edge endpoint, and high-connectivity nodes

#### Scenario: Full title on hover
- **WHEN** the user hovers a node with a truncated or hidden default label
- **THEN** the hovered node SHALL reveal its full title through an in-canvas label treatment
- **AND** the full title SHALL take visual priority over neighboring short labels
- **AND** the graph SHALL NOT render a separate floating tooltip or hover card for the node title

#### Scenario: Non-hovered labels preserve context
- **WHEN** a node is hovered and other nodes are not directly related to that hover target
- **THEN** non-hovered labels MAY recede visually
- **AND** non-hovered labels SHALL remain visible enough to preserve spatial context when they were visible before hover
