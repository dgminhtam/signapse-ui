## ADDED Requirements

### Requirement: Active selection uses selected and gray dim styling
The graph view SHALL use the G6 `selected` state for active first-degree graph context and SHALL use a neutral gray `dim` style for unrelated nodes and edges without opacity-based fading.

#### Scenario: Active selection applies selected state
- **WHEN** the user clicks a graph node to make it active
- **THEN** the active node and its first-degree related graph context receive the `selected` state through G6 click selection behavior
- **AND** unrelated graph elements receive the `dim` state

#### Scenario: Active dim uses neutral gray
- **WHEN** unrelated graph elements are dimmed during active selection
- **THEN** dimmed nodes use neutral gray node and label colors
- **AND** dimmed edges use a neutral gray stroke
- **AND** the dim style does not rely on lowering node, label, or edge opacity
