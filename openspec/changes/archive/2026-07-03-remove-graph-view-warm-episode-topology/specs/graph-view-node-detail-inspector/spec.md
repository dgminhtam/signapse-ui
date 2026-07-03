## MODIFIED Requirements

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
