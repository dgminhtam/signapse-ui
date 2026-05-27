## MODIFIED Requirements

### Requirement: Existing graph interactions remain intact
The graph view SHALL preserve existing hover, drag, zoom, recenter, and dark-mode readability behavior after click inspection is added.

#### Scenario: Hover preview still works

- **WHEN** the user hovers a node without clicking it
- **THEN** the graph shows hover emphasis and any title reveal through the in-canvas node label
- **AND** the graph does not open the inspector, a tooltip, a hover card, or a page-level detail surface as a side effect of hover

#### Scenario: Dragging a node does not open inspector

- **WHEN** the user drags a graph node
- **THEN** the graph moves the node according to current drag behavior
- **AND** the graph does not open the inspector as a side effect of that drag gesture

#### Scenario: Canvas controls still work

- **WHEN** the user uses drag canvas, zoom controls, or recenter control
- **THEN** those interactions continue to work while no node is selected and while a node is selected

#### Scenario: Inspector remains readable in dark mode

- **WHEN** the graph view is displayed in dark mode
- **THEN** the inspector text, controls, and metadata remain readable
