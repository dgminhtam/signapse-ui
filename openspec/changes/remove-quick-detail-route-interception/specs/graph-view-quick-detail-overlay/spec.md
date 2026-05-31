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

### Requirement: Quick detail uses a focused Sheet reading surface
The quick detail overlay SHALL use a local shadcn Drawer reading surface with focused entity detail content rather than rendering the full page shell inside the overlay.

#### Scenario: Event quick detail is focused
- **WHEN** an event quick detail Drawer is open
- **THEN** it shows focused event reading content such as title, status, description or summary, key timestamps, confidence, evidence, linked source context, and an action to open the full detail page

#### Scenario: News article quick detail is focused
- **WHEN** a news article quick detail Drawer is open
- **THEN** it shows focused article reading content such as title, status, publisher/source context, publish time, summary or excerpt, linked event context where available, source link, and an action to open the full detail page

#### Scenario: Page shell chrome is not duplicated
- **WHEN** quick detail renders event or news article content
- **THEN** it does not duplicate the full page's breadcrumb, list back button, broad technical panels, or page-level shell chrome inside the Drawer

### Requirement: Quick detail preserves access and state handling
Quick detail SHALL reuse existing permission-aware fetch paths for event and news article detail access while keeping loading, missing, and denied states inside the local Drawer.

#### Scenario: User lacks event permission
- **WHEN** a user without event read permission opens event quick detail from Graph View
- **THEN** the Drawer renders an access-denied state instead of event content

#### Scenario: User lacks news article permission
- **WHEN** a user without news article read permission opens news article quick detail from Graph View
- **THEN** the Drawer renders an access-denied state instead of article content

#### Scenario: Entity loading is scoped to Drawer
- **WHEN** local quick detail is loading after a Graph View node action
- **THEN** the loading state appears inside the Drawer area and does not replace or resize the Graph View canvas

#### Scenario: Entity is missing
- **WHEN** the requested event or news article cannot be found
- **THEN** the local quick detail handles the missing entity with a concise Drawer-local empty or error state

### Requirement: Graph View inspector remains a summary surface
The existing Graph View node inspector SHALL remain a lightweight summary and decision surface, not a full detail reading surface.

#### Scenario: Inspector summarizes selected node
- **WHEN** a user selects any graph node
- **THEN** the inspector continues to show compact metadata such as label, type, timestamps, status, confidence, source, and relation counts where available

#### Scenario: Detail action opens local quick detail
- **WHEN** a selected event or news article node has a valid entity id
- **THEN** the inspector provides a detail action that opens local quick detail for that entity
- **AND** the action does not rely on global intercepted routing
