## MODIFIED Requirements

### Requirement: Inspector displays node details from graph payload

The graph view SHALL display relevant, kind-specific summary details from the existing graph node payload without requiring a new backend request, and SHALL omit technical identifiers from the primary inspector surface.

#### Scenario: Event node details are shown

- **WHEN** the selected node kind is `event`
- **THEN** the inspector shows the event title, node type, occurred time when present, confidence when present, and meaningful event status when present
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

#### Scenario: Theme node details are shown

- **WHEN** the selected node kind is `theme`
- **THEN** the inspector shows the theme label and a compact graph relationship summary
- **AND** the inspector does not show timestamps, confidence, source fields, asset fields, `slug`, or `canonicalKey`

#### Scenario: Narrative node details are shown

- **WHEN** the selected node kind is `narrative`
- **THEN** the inspector shows the narrative title, thesis when present, narrative status when present, confidence when present, and a compact graph relationship summary
- **AND** the inspector does not show article-only fields, asset-only fields, generic event status, `slug`, or `canonicalKey`
