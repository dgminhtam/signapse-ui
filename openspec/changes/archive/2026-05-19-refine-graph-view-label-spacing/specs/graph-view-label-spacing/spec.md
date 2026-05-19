## ADDED Requirements

### Requirement: Graph view uses priority-based default labels
The graph view SHALL render default node labels through a priority policy so dense global graphs remain readable without forcing labels for every visible node.

#### Scenario: Dense global graph label policy
- **WHEN** the graph canvas renders a global view with many visible nodes
- **THEN** the graph SHALL NOT force labels for every visible node
- **AND** the graph SHALL prioritize labels for orientation anchors such as asset, theme, selected, hovered, local-focus center, selected-edge endpoint, and high-connectivity nodes
- **AND** non-priority event or article nodes SHALL remain inspectable through hover, selection, or local focus

#### Scenario: Full label reveal
- **WHEN** the user hovers, selects, drags, or locally focuses a node
- **THEN** that node SHALL reveal its full title with visual priority over neighboring default labels
- **AND** unrelated nodes SHALL remain visible enough to preserve graph context

### Requirement: Graph view applies minimum node spacing after layout
The graph view SHALL apply a deterministic post-layout spacing pass so node circles keep a readable minimum gap after the initial layout settles.

#### Scenario: Dense initial layout spacing
- **WHEN** the graph model is built from a dense payload
- **THEN** the frontend SHALL run a bounded spacing pass after the ForceAtlas2 layout
- **AND** node circles that are closer than the configured minimum distance SHALL be nudged apart before the graph is rendered
- **AND** the graph SHALL remain stable after the bounded layout work finishes

#### Scenario: Identical or near-identical node positions
- **WHEN** two or more nodes receive identical or near-identical layout positions
- **THEN** the spacing pass SHALL separate them into distinct visible positions
- **AND** the graph SHALL avoid leaving nodes directly stacked on top of each other in the default rendered layout

### Requirement: Dragged nodes avoid direct stacking on release
The graph view SHALL prevent a dragged node from remaining directly stacked on top of another node after the user releases it.

#### Scenario: Drop a node near another node
- **WHEN** the user drags a node and releases it within the configured minimum spacing distance of another visible node
- **THEN** the frontend SHALL nudge the dragged node to a nearby readable position
- **AND** the nudge SHALL remain local to the current graph session
- **AND** no backend mutation SHALL be sent for the adjusted position
