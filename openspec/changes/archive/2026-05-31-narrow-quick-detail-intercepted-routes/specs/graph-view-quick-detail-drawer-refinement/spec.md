## MODIFIED Requirements

### Requirement: Navigation behavior remains canonical
The Drawer refinement SHALL preserve canonical full detail pages while making Graph View quick-detail open and close behavior local to the Graph View workspace.

#### Scenario: Closing drawer returns to Graph View
- **WHEN** a user closes the Drawer after opening quick detail from Graph View
- **THEN** the Drawer closes by clearing local Graph View quick-detail state
- **AND** the close action does not use `router.back()`

#### Scenario: Direct URLs remain full pages
- **WHEN** a user opens `/events/{id}` or `/news-articles/{id}` directly or reloads the URL
- **THEN** the canonical full detail page renders instead of the quick-detail Drawer

#### Scenario: Full page escalation remains available
- **WHEN** a user needs the complete detail workspace
- **THEN** the Drawer provides an action to open the canonical full detail page
