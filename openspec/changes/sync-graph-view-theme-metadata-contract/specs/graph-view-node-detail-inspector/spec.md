## MODIFIED Requirements

### Requirement: Inspector displays node details from graph payload
The graph view SHALL display relevant, kind-specific summary details from the existing graph node payload without requiring a new backend request, and SHALL omit technical identifiers from the primary inspector surface.

#### Scenario: Event node details are shown

- **WHEN** the selected node kind is `event`
- **THEN** the inspector shows the event title, node type, occurred time when present, confidence when present, meaningful event status when present, theme metadata when present, and a compact relation summary when relation counts are available
- **AND** the inspector does not show article-only fields, asset-only fields, `slug`, or `canonicalKey`

#### Scenario: Event node theme metadata is shown

- **WHEN** the selected node kind is `event` and `metadata.themes[]` contains theme items
- **THEN** the inspector shows the theme titles with localized relation type labels when present
- **AND** the inspector does not present those themes as selectable graph nodes or relation-count edges

#### Scenario: News article node details are shown

- **WHEN** the selected node kind is `news-article`
- **THEN** the inspector shows the article title, node type, news outlet when present, published time when present, source URL action when present, and confidence when present
- **AND** the inspector shows a compact relation summary when relation counts are available
- **AND** the inspector does not show event-only fields, asset-only fields, `slug`, or `canonicalKey`

#### Scenario: Asset node details are shown

- **WHEN** the selected node kind is `asset`
- **THEN** the inspector shows the asset label, secondary label when present, symbol when present if it is not already the main title, asset type when present, and a compact graph relationship summary
- **AND** the inspector does not show timestamps, confidence, source fields, thesis, theme metadata, `slug`, or `canonicalKey`

#### Scenario: Narrative node details are shown

- **WHEN** the selected node kind is `narrative`
- **THEN** the inspector shows the narrative title, thesis when present, narrative status when present, confidence when present, theme metadata when present, and a compact graph relationship summary
- **AND** the inspector does not show article-only fields, asset-only fields, generic event status, `slug`, or `canonicalKey`

#### Scenario: Narrative node theme metadata is shown

- **WHEN** the selected node kind is `narrative` and `metadata.themes[]` contains a primary theme item
- **THEN** the inspector shows the theme title with a localized relation type label when present
- **AND** the inspector does not provide a theme detail route action

#### Scenario: Warm episode node details are shown

- **WHEN** the selected node kind is `warm-episode`
- **THEN** the inspector shows the warm episode title, node type, period start when present, period end when present, knowledge layer when present, confidence when present, and a compact graph relationship summary
- **AND** the inspector does not show article-only fields, asset-only fields, narrative thesis, narrative status, theme metadata, generic event status, `slug`, or `canonicalKey`
