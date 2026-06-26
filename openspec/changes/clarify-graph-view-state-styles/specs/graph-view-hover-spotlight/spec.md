## ADDED Requirements

### Requirement: Hover state uses highlight and gray dim styling
The graph view SHALL use the G6 `highlight` state for hovered first-degree graph context and SHALL use a neutral gray `dim` style for unrelated nodes and edges without opacity-based fading.

#### Scenario: Hover applies highlight state
- **WHEN** the user hovers a graph node
- **THEN** the hovered node and its first-degree related graph context receive the `highlight` state through G6 hover behavior
- **AND** unrelated graph elements receive the `dim` state

#### Scenario: Hover dim uses neutral gray
- **WHEN** unrelated graph elements are dimmed during hover
- **THEN** dimmed nodes use neutral gray node and label colors
- **AND** dimmed edges use a neutral gray stroke
- **AND** the dim style does not rely on lowering node, label, or edge opacity
