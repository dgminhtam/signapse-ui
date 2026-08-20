## MODIFIED Requirements

### Requirement: Navigation behavior remains canonical
The Drawer refinement SHALL remove route-history ownership from quick detail while preserving canonical full detail page navigation as an explicit escalation action for entity types that provide it.

#### Scenario: Closing drawer returns to Graph View without navigation
- **WHEN** a user closes the Drawer after opening quick detail from Graph View
- **THEN** the Drawer closes by clearing local state
- **AND** the close action does not call `router.back()`, `router.push()`, or `router.replace()`

#### Scenario: Direct URLs remain full pages
- **WHEN** a user opens `/events/{id}` or `/news-articles/{id}` directly, clicks a normal detail link, or reloads the URL
- **THEN** the canonical full detail page renders instead of the quick detail Drawer

#### Scenario: Event full-page escalation remains available
- **WHEN** a user needs the complete Event detail workspace
- **THEN** the Event Drawer provides an action to open the canonical full detail page

#### Scenario: News article Quick detail remains focused
- **WHEN** a user opens a News article in Quick detail from Graph View
- **THEN** the Drawer does not provide a canonical full-page action
- **AND** the canonical News article route remains available outside the drawer
