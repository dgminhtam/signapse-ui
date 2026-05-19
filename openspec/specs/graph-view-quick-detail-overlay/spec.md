# graph-view-quick-detail-overlay Specification

## Purpose
TBD - created by archiving change add-graph-view-quick-detail-overlay. Update Purpose after archive.
## Requirements
### Requirement: Graph View supports quick detail for readable entity nodes
Graph View SHALL allow users to open quick detail for selected `event` and `news-article` nodes without losing the current graph workspace context.

#### Scenario: Event node opens quick detail through soft navigation
- **WHEN** a user selects an `event` node in Graph View and activates its detail action
- **THEN** the URL uses the canonical `/events/{id}` route and the event detail renders in a quick detail Sheet above the existing Graph View workspace

#### Scenario: News article node opens quick detail through soft navigation
- **WHEN** a user selects a `news-article` node in Graph View and activates its detail action
- **THEN** the URL uses the canonical `/news-articles/{id}` route and the news article detail renders in a quick detail Sheet above the existing Graph View workspace

#### Scenario: Unsupported node remains inspector-only
- **WHEN** a user selects an `asset` or `theme` node in Graph View
- **THEN** Graph View keeps the lightweight node inspector behavior and does not present quick detail as an available entity reading surface

### Requirement: Canonical detail URLs keep full-page fallback
The system SHALL keep `/events/{id}` and `/news-articles/{id}` as canonical detail pages for hard navigation while allowing Graph View soft navigation to render quick detail.

#### Scenario: Direct event URL renders full page
- **WHEN** a user opens `/events/{id}` directly, reloads it, or receives it as a copied link
- **THEN** the full event detail page renders instead of the Graph View quick detail Sheet

#### Scenario: Direct news article URL renders full page
- **WHEN** a user opens `/news-articles/{id}` directly, reloads it, or receives it as a copied link
- **THEN** the full news article detail page renders instead of the Graph View quick detail Sheet

#### Scenario: Browser history returns to graph context
- **WHEN** a user closes the quick detail Sheet or uses browser Back after opening detail from Graph View
- **THEN** the user returns to the previous Graph View workspace context

### Requirement: Quick detail uses a focused Sheet reading surface
The quick detail overlay SHALL use a right-side shadcn `Sheet` reading surface with focused entity detail content rather than rendering the full page shell inside the overlay.

#### Scenario: Event quick detail is focused
- **WHEN** an event quick detail Sheet is open
- **THEN** it shows focused event reading content such as title, status, description or summary, key timestamps, confidence, evidence, linked source context, and an action to open the full detail page

#### Scenario: News article quick detail is focused
- **WHEN** a news article quick detail Sheet is open
- **THEN** it shows focused article reading content such as title, status, publisher/source context, publish time, summary or excerpt, linked event context where available, source link, and an action to open the full detail page

#### Scenario: Page shell chrome is not duplicated
- **WHEN** quick detail renders event or news article content
- **THEN** it does not duplicate the full page's breadcrumb, list back button, broad technical panels, or page-level shell chrome inside the Sheet

### Requirement: Quick detail preserves access and state handling
Quick detail routes SHALL reuse existing server-side fetchers and permission checks for event and news article detail access.

#### Scenario: User lacks event permission
- **WHEN** a user without event read permission opens an event quick detail route from Graph View
- **THEN** the Sheet renders an access-denied state instead of event content

#### Scenario: User lacks news article permission
- **WHEN** a user without news article read permission opens a news article quick detail route from Graph View
- **THEN** the Sheet renders an access-denied state instead of article content

#### Scenario: Entity loading is scoped to Sheet
- **WHEN** a quick detail route is loading
- **THEN** the loading state appears inside the Sheet area and does not replace or resize the Graph View canvas

#### Scenario: Entity is missing
- **WHEN** the requested event or news article cannot be found
- **THEN** the quick detail route handles the missing entity consistently with full detail behavior through not-found or a concise Sheet-local empty/error state

### Requirement: Graph View inspector remains a summary surface
The existing Graph View node inspector SHALL remain a lightweight summary and decision surface, not a full detail reading surface.

#### Scenario: Inspector summarizes selected node
- **WHEN** a user selects any graph node
- **THEN** the inspector continues to show compact metadata such as label, type, timestamps, status, confidence, source, and relation counts where available

#### Scenario: Detail action escalates to quick detail
- **WHEN** a selected event or news article node has a valid entity id
- **THEN** the inspector provides a detail action that escalates to the canonical detail URL and may render the quick detail Sheet during soft navigation

