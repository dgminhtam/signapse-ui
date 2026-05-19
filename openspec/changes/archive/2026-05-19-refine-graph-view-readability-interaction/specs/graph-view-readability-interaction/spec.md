## ADDED Requirements

### Requirement: Graph view shows bounded node labels by default
The graph view SHALL render readable, bounded labels for visible nodes by default so users can identify graph entities without first hovering each node.

#### Scenario: Default graph render
- **WHEN** the graph canvas loads with visible nodes
- **THEN** each eligible visible node SHALL expose a short label that does not exceed the configured display budget
- **AND** the graph SHALL avoid showing full long titles for every node at once

#### Scenario: Full title on hover
- **WHEN** the user hovers a node with a truncated default label
- **THEN** the hovered node SHALL reveal its full title
- **AND** the full title SHALL take visual priority over neighboring short labels

### Requirement: Hover emphasis preserves graph context
The graph view SHALL make hovered or selected nodes visually prominent while keeping non-focused nodes readable enough for spatial context.

#### Scenario: Hover a node in the global graph
- **WHEN** the user hovers a node
- **THEN** the hovered node SHALL gain a visible halo, shadow, or equivalent emphasis treatment
- **AND** unrelated nodes SHALL remain visible rather than fading to a barely readable state
- **AND** unrelated edges MAY recede more strongly than unrelated nodes to reduce clutter

#### Scenario: Select a node or edge
- **WHEN** the user selects a graph item
- **THEN** the selected item and its relevant endpoints SHALL remain visually prominent
- **AND** the graph SHALL preserve enough surrounding context for comparison

### Requirement: Users can drag nodes to improve local readability
The graph view SHALL allow users to drag individual nodes to separate overlaps and support analysis of crowded regions.

#### Scenario: Drag a node
- **WHEN** the user presses a node, moves the pointer, and releases it
- **THEN** the node SHALL move to the new graph position
- **AND** the graph canvas SHALL refresh without rerunning the full layout during the drag
- **AND** camera panning SHALL not interfere with the node drag gesture

#### Scenario: Drag does not change backend data
- **WHEN** the user drags a node
- **THEN** the position change SHALL remain local to the current graph session
- **AND** no backend mutation SHALL be sent for the new position

### Requirement: Layout reduces node overlap without continuous motion
The graph view SHALL tune its initial layout and settle motion to reduce node overlap while keeping the graph stable for reading.

#### Scenario: Dense payload layout
- **WHEN** the graph contains dense clusters or many connected nodes
- **THEN** the initial layout SHALL use anti-overlap spacing to reduce node stacking
- **AND** the graph SHALL settle into a stable readable state after bounded animation

#### Scenario: Reduced motion preference
- **WHEN** the user prefers reduced motion
- **THEN** the graph SHALL skip nonessential settle animation
- **AND** label, hover, drag, and anti-overlap readability improvements SHALL remain available
