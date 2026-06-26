## MODIFIED Requirements

### Requirement: Selection state updates are batched
The graph view SHALL apply selected-node and selected-relation visual states using G6 selection behavior or a single batched state update, and selection optimization SHALL NOT disable existing hover, drag, animation, force-layout, or quick-detail behavior.

#### Scenario: User selects a node in a dense graph
- **WHEN** the user selects a node in a graph with many nodes and edges
- **THEN** the graph view applies the required selected, related, and dim states through G6 behavior or one batched state update

#### Scenario: Selection optimization preserves graph behavior
- **WHEN** selection state update logic is optimized
- **THEN** node drag, linked force reaction, hover dim/focus, graph animation, and quick detail behavior SHALL continue to work as before
- **AND** optimization SHALL NOT remove existing Graph View interaction behaviors to reduce selection update cost

### Requirement: Active selection uses selected target and gray dim styling
The graph view SHALL use the G6 `selected` state for the active target node, SHALL use the G6 `highlight` state for first-degree related graph context, and SHALL use a neutral gray `dim` style for unrelated nodes and edges without opacity-based fading or callback-based selected styling.

#### Scenario: Active selection applies selected state
- **WHEN** the user clicks a graph node to make it active
- **THEN** the active node receives the `selected` state through G6 click selection behavior
- **AND** its first-degree related graph context receives the `highlight` state
- **AND** unrelated graph elements receive the `dim` state

#### Scenario: Active selection transfers to related node
- **WHEN** the user clicks a node that is first-degree related to the currently active node
- **THEN** the clicked related node becomes the active selected target
- **AND** active selection is not cleared merely because the clicked node was part of the previous related context

#### Scenario: Active dim uses neutral gray
- **WHEN** unrelated graph elements are dimmed during active selection
- **THEN** dimmed nodes use neutral gray node and label colors
- **AND** dimmed edges use a neutral gray stroke
- **AND** the dim style does not rely on lowering node, label, or edge opacity

#### Scenario: Selected state styles stay static
- **WHEN** Graph View configures selected state styles
- **THEN** selected state styles do not compute replacement label text, label dimensions, or edge widths from individual graph elements
