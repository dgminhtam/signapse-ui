## ADDED Requirements

### Requirement: Analytical workspaces own quick-detail overlays explicitly
Analytical workspaces SHALL open entity quick detail through local workspace state instead of relying on global intercepted routes.

#### Scenario: Market chart opens event detail locally
- **WHEN** a user opens event detail from a market chart annotation
- **THEN** the market chart workspace renders a local event quick-detail drawer
- **AND** the current market chart URL remains unchanged

#### Scenario: Graph view opens entity detail locally
- **WHEN** a user opens event or news article detail from Graph View
- **THEN** Graph View renders a local quick-detail drawer
- **AND** the current Graph View URL remains unchanged

#### Scenario: Closing quick detail does not navigate
- **WHEN** a user closes a workspace-owned quick-detail drawer
- **THEN** the drawer closes by clearing local workspace state
- **AND** the close action does not call `router.back()`, `router.push()`, or `router.replace()`

### Requirement: Canonical detail routes remain full-page destinations
The system SHALL treat canonical event and news article detail URLs as full-page destinations outside local quick-detail state.

#### Scenario: Full detail action leaves workspace intentionally
- **WHEN** a local quick-detail drawer provides a full detail action
- **THEN** the action links to the canonical detail route for that entity
- **AND** activating it intentionally leaves the current analytical workspace

#### Scenario: Normal detail links are not intercepted globally
- **WHEN** a user activates a normal internal link to `/events/{id}` or `/news-articles/{id}`
- **THEN** the app renders the corresponding full detail page
- **AND** no global quick-detail overlay route handles the navigation

### Requirement: Local quick detail preserves focused reading behavior
Workspace-owned quick-detail drawers SHALL render focused reading content without embedding full page shells.

#### Scenario: Local event quick detail is focused
- **WHEN** a local event quick-detail drawer is open
- **THEN** it shows focused event reading content and evidence context
- **AND** it does not duplicate breadcrumb, list back button, or page-level technical panels from the full event detail page

#### Scenario: Local news article quick detail is focused
- **WHEN** a local news article quick-detail drawer is open
- **THEN** it shows focused article reading content and linked event context when available
- **AND** it does not duplicate breadcrumb, list back button, or page-level technical panels from the full news article detail page

#### Scenario: Access and missing-entity states stay local
- **WHEN** local quick detail cannot load content because of missing permissions, missing entity, or fetch failure
- **THEN** the drawer renders a concise local access-denied, empty, or error state
- **AND** the underlying analytical workspace remains mounted
