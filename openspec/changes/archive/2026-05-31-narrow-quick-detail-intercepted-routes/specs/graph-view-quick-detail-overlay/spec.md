## MODIFIED Requirements

### Requirement: Graph View supports quick detail for readable entity nodes
Graph View SHALL allow users to open local quick detail for selected `event` and `news-article` nodes without losing the current graph workspace context.

#### Scenario: Event node opens local quick detail
- **WHEN** a user selects an `event` node in Graph View and activates its detail action
- **THEN** the event detail renders in a local quick-detail drawer above the existing Graph View workspace
- **AND** the current Graph View URL remains unchanged

#### Scenario: News article node opens local quick detail
- **WHEN** a user selects a `news-article` node in Graph View and activates its detail action
- **THEN** the news article detail renders in a local quick-detail drawer above the existing Graph View workspace
- **AND** the current Graph View URL remains unchanged

#### Scenario: Unsupported node remains inspector-only
- **WHEN** a user selects an `asset` or `theme` node in Graph View
- **THEN** Graph View keeps the lightweight node inspector behavior and does not present quick detail as an available entity reading surface

### Requirement: Canonical detail URLs keep full-page fallback
The system SHALL keep `/events/{id}` and `/news-articles/{id}` as canonical full detail pages, while Graph View quick detail remains local workspace state.

#### Scenario: Direct event URL renders full page
- **WHEN** a user opens `/events/{id}` directly, reloads it, receives it as a copied link, or clicks a normal event detail link
- **THEN** the full event detail page renders instead of the Graph View quick-detail drawer

#### Scenario: Direct news article URL renders full page
- **WHEN** a user opens `/news-articles/{id}` directly, reloads it, receives it as a copied link, or clicks a normal news article detail link
- **THEN** the full news article detail page renders instead of the Graph View quick-detail drawer

#### Scenario: Closing local quick detail returns to graph context
- **WHEN** a user closes quick detail after opening it from Graph View
- **THEN** the drawer closes without route navigation
- **AND** the user remains in the existing Graph View workspace context

### Requirement: Graph View inspector remains a summary surface
The existing Graph View node inspector SHALL remain a lightweight summary and decision surface, not a full detail reading surface.

#### Scenario: Inspector summarizes selected node
- **WHEN** a user selects any graph node
- **THEN** the inspector continues to show compact metadata such as label, type, timestamps, status, confidence, source, and relation counts where available

#### Scenario: Detail action opens local quick detail
- **WHEN** a selected event or news article node has a valid entity id
- **THEN** the inspector provides a detail action that opens local quick detail for that entity
- **AND** the action does not rely on global intercepted routing
