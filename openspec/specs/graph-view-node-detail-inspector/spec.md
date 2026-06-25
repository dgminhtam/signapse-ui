# graph-view-node-detail-inspector Specification

## Purpose
Define the in-canvas Graph View node inspector behavior.

## Requirements

### Requirement: Node click opens an inspector
The graph view SHALL allow users to click a graph node to select it and open an in-canvas detail inspector for that node.

#### Scenario: User selects a node
- **WHEN** the user clicks a graph node
- **THEN** the graph keeps that node selected
- **AND** the graph shows a detail inspector for the selected node

#### Scenario: User selects another node
- **WHEN** the user clicks a different graph node while an inspector is open
- **THEN** the graph updates the selected node
- **AND** the inspector updates to show the newly selected node

#### Scenario: User clears selection
- **WHEN** the user clicks the canvas background or activates the inspector close control
- **THEN** the graph clears the selected node
- **AND** the inspector is hidden

### Requirement: Inspector displays node details from graph payload
The graph view SHALL display relevant, kind-specific summary details from the existing graph node payload without requiring a new backend request, and SHALL omit technical identifiers from the primary inspector surface.

#### Scenario: Event node details are shown
- **WHEN** the selected node kind is `event`
- **THEN** the inspector shows the event title, node type, occurred time when present, confidence when present, theme metadata when present, and meaningful event status when present
- **AND** the inspector shows a compact relation summary when relation counts are available
- **AND** the inspector does not show article-only fields, asset-only fields, `slug`, or `canonicalKey`

#### Scenario: News article node details are shown
- **WHEN** the selected node kind is `news-article`
- **THEN** the inspector shows the article title, node type, news outlet when present, published time when present, source URL action when present, and confidence when present
- **AND** the inspector shows a compact relation summary when relation counts are available
- **AND** the inspector does not show event-only fields, asset-only fields, `slug`, or `canonicalKey`

#### Scenario: Asset node details are shown
- **WHEN** the selected node kind is `asset`
- **THEN** the inspector shows the asset label, secondary label when present, symbol when present if it is not already the main title, asset type when present, and a compact graph relationship summary
- **AND** the inspector does not show timestamps, confidence, source fields, thesis, `slug`, or `canonicalKey`

#### Scenario: Narrative node details are shown
- **WHEN** the selected node kind is `narrative`
- **THEN** the inspector shows the narrative title, thesis when present, narrative status when present, confidence when present, theme metadata when present, and a compact graph relationship summary
- **AND** the inspector does not show article-only fields, asset-only fields, generic event status, `slug`, or `canonicalKey`

### Requirement: Inspector provides detail navigation actions
The graph view SHALL provide direct navigation actions for selected nodes that map to existing detail routes or external URLs.

#### Scenario: Event node has detail route
- **WHEN** the selected node kind is `event` and the node id contains a valid entity id
- **THEN** the inspector provides an action to open `/events/[id]`

#### Scenario: News article node has detail route
- **WHEN** the selected node kind is `news-article` and the node id contains a valid entity id
- **THEN** the inspector provides an action to open `/news-articles/[id]`

#### Scenario: News article node has source URL
- **WHEN** the selected node kind is `news-article` and `metadata.url` is present
- **THEN** the inspector provides an external action to open the source URL

#### Scenario: Node has no detail route
- **WHEN** the selected node kind does not map to an existing detail route
- **THEN** the inspector omits unavailable route actions

### Requirement: Selected node emphasizes direct relations
The graph view SHALL visually emphasize the selected node, its directly related nodes, and its directly related edges while an inspector is open.

#### Scenario: Selected relation emphasis is applied
- **WHEN** a node is selected
- **THEN** the selected node remains visually prominent
- **AND** directly related nodes and edges remain readable
- **AND** unrelated graph elements are visually de-emphasized without becoming unreadable

#### Scenario: Selection emphasis clears
- **WHEN** selection is cleared
- **THEN** selection-specific emphasis is removed from graph nodes and edges

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
