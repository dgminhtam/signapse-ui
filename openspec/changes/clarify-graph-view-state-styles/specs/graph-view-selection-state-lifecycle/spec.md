## ADDED Requirements

### Requirement: Active selection uses selected target and gray dim styling
The graph view SHALL use the G6 `selected` state for the active target node, SHALL use the G6 `highlight` state for first-degree related graph context, and SHALL use a neutral gray `dim` style for unrelated nodes and edges without opacity-based fading.

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
