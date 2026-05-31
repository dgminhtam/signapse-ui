## MODIFIED Requirements

### Requirement: Graph view uses priority-based default labels
The graph view SHALL render default node labels through a priority policy so dense global graphs remain readable without forcing labels for every visible node.

#### Scenario: Dense global graph label policy
- **WHEN** the graph canvas renders a global view with many visible nodes
- **THEN** the graph SHALL NOT force labels for every visible node
- **AND** the graph SHALL prioritize labels for orientation anchors such as asset, theme, selected, hovered, local-focus center, selected-edge endpoint, and high-connectivity nodes
- **AND** non-priority event or article nodes SHALL remain inspectable through hover, selection, or local focus

#### Scenario: Full label reveal
- **WHEN** the user hovers, selects, drags, or locally focuses a node
- **THEN** that node SHALL reveal its full title through its in-canvas label with visual priority over neighboring default labels
- **AND** the graph SHALL NOT use a separate node tooltip or hover card to reveal that title
- **AND** unrelated nodes SHALL remain visible enough to preserve graph context
