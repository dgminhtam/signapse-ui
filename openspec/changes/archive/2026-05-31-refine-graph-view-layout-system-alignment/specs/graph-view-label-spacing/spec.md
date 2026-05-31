## MODIFIED Requirements

### Requirement: Graph view uses priority-based default labels
The graph view SHALL render default node labels through a priority policy so dense global graphs remain readable without forcing labels for every visible node or allowing label blocks to obscure the topology.

#### Scenario: Dense global graph label policy
- **WHEN** the graph canvas renders a global view with many visible nodes
- **THEN** the graph SHALL NOT force labels for every visible node
- **AND** the graph SHALL prioritize labels for orientation anchors such as asset, theme, selected, hovered, local-focus center, selected-edge endpoint, narrative, and high-connectivity nodes
- **AND** non-priority event or article nodes SHALL remain inspectable through hover, selection, or local focus

#### Scenario: Full label reveal
- **WHEN** the user hovers, selects, drags, or locally focuses a node
- **THEN** that node SHALL reveal its full title with visual priority over neighboring default labels
- **AND** unrelated nodes SHALL remain visible enough to preserve graph context

#### Scenario: Resting labels avoid text-first clutter
- **WHEN** no node or edge is hovered, selected, dragged, or locally focused
- **THEN** visible node labels SHALL be limited by the priority policy and display budget
- **AND** long event, article, or narrative titles SHALL NOT all render as permanent overlapping label blocks in dense clusters

#### Scenario: Label surfaces preserve graph readability
- **WHEN** default labels are rendered over the canvas
- **THEN** label backgrounds, halos, or text treatments SHALL improve contrast without covering more graph area than needed
- **AND** graph nodes and first-order topology SHALL remain easier to perceive than the label chrome
