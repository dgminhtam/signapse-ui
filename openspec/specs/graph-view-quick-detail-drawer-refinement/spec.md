# graph-view-quick-detail-drawer-refinement Specification

## Purpose
Defines Graph View's canvas-oriented application of the shared Signapse entity quick-detail policy.
## Requirements
### Requirement: Graph quick detail uses bottom Drawer
Graph View quick detail SHALL use a bottom shadcn Drawer as its canvas-oriented placement. From `768px`, Event inspection SHALL be content-fit with `max-height: min(60dvh, 36rem)` and Article reader SHALL use `height: min(72dvh, 48rem)`; below `768px`, the shared mobile geometry applies.

#### Scenario: Event detail opens in bottom drawer
- **WHEN** a user opens an event quick detail from Graph View
- **THEN** Event inspection appears in a bottom Drawer that preserves Graph View canvas context behind the modal
- **AND** it uses the documented event bottom-sheet geometry

#### Scenario: News article detail opens in bottom drawer
- **WHEN** a user opens a news article quick detail from Graph View
- **THEN** Article reader appears in a bottom Drawer that preserves Graph View canvas context behind the modal
- **AND** it uses the documented article bottom-sheet geometry

#### Scenario: Drawer uses shadcn composition
- **WHEN** the quick detail shell is implemented
- **THEN** it uses the shadcn Drawer primitive with the shared accessible title, description, visible Close control, canonical action, and single-scroll body contract

### Requirement: Quick detail avoids double-open loading animation
Graph View quick detail SHALL avoid mounting one overlay for loading and a second overlay for loaded data during the same local open action.

#### Scenario: Loading state does not remount overlay
- **WHEN** quick detail content is loading after a Graph View node action
- **THEN** the UI does not animate a loading Drawer open and then animate a second loaded Drawer open

#### Scenario: Skeleton appears without duplicate primitive
- **WHEN** loading feedback is shown for quick detail
- **THEN** the skeleton appears inside a stable Drawer body or the overlay waits until data is ready, rather than using a separate route-level overlay instance

### Requirement: Bottom drawer preserves readability and context
The bottom Drawer SHALL provide stable profile-specific reading layout while preserving enough Graph View context to orient the user.

#### Scenario: Drawer has stable height and scroll
- **WHEN** the bottom Drawer is open
- **THEN** it uses the documented stable height constraints and one internal scroll body
- **AND** resize or zoom preserves the selected entity, focus, and body scroll without replaying an opening animation

#### Scenario: Drawer content remains focused
- **WHEN** event or news article quick detail is displayed
- **THEN** Event inspection keeps its structured content within a centered `64rem` maximum cluster
- **AND** Article reader keeps Markdown prose within a `72ch` maximum measure
- **AND** neither profile adds mutation-heavy full-page actions

### Requirement: Navigation behavior remains canonical
The Drawer refinement SHALL remove route-history ownership from quick detail while preserving canonical full detail page navigation as an explicit escalation action.

#### Scenario: Closing drawer returns to Graph View without navigation
- **WHEN** a user closes the Drawer after opening quick detail from Graph View
- **THEN** the Drawer closes by clearing local state
- **AND** the close action does not call `router.back()`, `router.push()`, or `router.replace()`

#### Scenario: Direct URLs remain full pages
- **WHEN** a user opens `/events/{id}` or `/news-articles/{id}` directly, clicks a normal detail link, or reloads the URL
- **THEN** the canonical full detail page renders instead of the quick detail Drawer

#### Scenario: Full page escalation remains available
- **WHEN** a user needs the complete detail workspace
- **THEN** the Drawer provides an action to open the canonical full detail page
