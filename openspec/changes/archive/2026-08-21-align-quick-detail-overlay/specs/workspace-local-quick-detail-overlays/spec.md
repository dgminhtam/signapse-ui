## MODIFIED Requirements

### Requirement: Approved owner surfaces own local quick detail explicitly

Dashboard, Graph View, and Market Charts SHALL own entity quick detail through local state. Dashboard and Graph View SHALL support Event inspection and Article reader; Market Charts SHALL support Event inspection only. An owner SHALL mount at most one modal quick-detail overlay at a time and SHALL NOT use a generic global Drawer mode, nested quick details, or an internal quick-detail history stack. A new owner surface requires an explicit design proposal showing why preserving its background context is valuable.

#### Scenario: Dashboard opens local quick detail

- **WHEN** a user activates an available Event Timeline or Latest News title on Dashboard
- **THEN** Dashboard opens one local entity quick-detail overlay without changing the dashboard URL
- **AND** Dashboard state remains mounted behind the modal

#### Scenario: Graph View opens local quick detail

- **WHEN** a user activates a supported event or news-article action in Graph View
- **THEN** Graph View opens one local entity quick-detail overlay without resetting its route or analytical state

#### Scenario: Market Charts opens Event inspection only

- **WHEN** a user activates a supported event action in Market Charts
- **THEN** Market Charts opens one local Event inspection overlay without resetting its route or analytical state
- **AND** Market Charts does not expose an Article reader quick-detail action

#### Scenario: Closing quick detail does not navigate

- **WHEN** a user dismisses a local entity quick-detail overlay
- **THEN** its owner clears local quick-detail state
- **AND** the close action does not call `router.back()`, `router.push()`, or `router.replace()`

### Requirement: Canonical detail routes remain full-page destinations

The system SHALL treat canonical event and news article detail URLs as full-page destinations outside local quick-detail state. Canonical escalation SHALL NOT create or restore a local quick-detail history entry.

#### Scenario: Full detail action leaves the owner intentionally

- **WHEN** a user activates the sticky-header canonical action
- **THEN** the application navigates in the same tab to the canonical route for that entity
- **AND** the navigation intentionally leaves the local owner surface

#### Scenario: Normal detail links are not intercepted globally

- **WHEN** a user activates a normal internal link to `/events/{id}` or `/news-articles/{id}`
- **THEN** the app renders the corresponding full detail page
- **AND** no global quick-detail overlay route handles the navigation

#### Scenario: Browser Back does not reopen quick detail

- **WHEN** a user navigates back from a canonical full-detail page to its owner surface
- **THEN** the owner surface renders without automatically reopening the prior quick-detail overlay
- **AND** no quick-detail history stack is reconstructed

### Requirement: Quick detail is an accessible, single-scroll modal

Quick detail SHALL use a modal overlay with a sticky header containing a visible Close control, a localized profile-plus-entity accessible title, a concise entity or state description, and a canonical full-detail action when the selected target is actionable. The canonical action SHALL be available for loading, ready, and transient-error states with a known permitted target, and SHALL be absent for missing and access-denied states. The body SHALL be the only scrolling region. A sticky footer SHALL NOT duplicate the canonical action.

#### Scenario: Modal opens and closes with keyboard support

- **WHEN** a user opens quick detail from a keyboard-reachable trigger
- **THEN** focus moves to the visible Close control while the overlay announces its localized title and description
- **AND** Escape closes the overlay and restores focus to the exact activating trigger

#### Scenario: Pointer and touch dismissal remain safe

- **WHEN** a user dismisses quick detail by clicking the desktop backdrop or swiping down a mobile bottom sheet
- **THEN** the overlay closes without navigation
- **AND** focus is restored safely to the activating trigger

#### Scenario: Header action follows recovery state

- **WHEN** quick detail is loading or shows a transient error for a permitted entity
- **THEN** its sticky header retains the canonical full-detail action
- **AND** the header does not expose that action for a missing or access-denied entity

### Requirement: Local states keep the resolved presentation stable

Loading, missing, error, and access-denied states SHALL render inside the same resolved overlay profile and placement as the target entity. They SHALL provide accessible state feedback and SHALL NOT remount a second overlay when data resolves. Each opening SHALL use one stable data snapshot, reset the body scroll position to the top, and only obtain new data through a later open or explicit retry.

#### Scenario: Content is loading

- **WHEN** quick detail is loading
- **THEN** the overlay reports a busy state with an accessible title and description
- **AND** its skeleton mirrors the resolved profile geometry and preserves a single body scroll region

#### Scenario: Transient request failure can retry

- **WHEN** a permitted entity request fails for a reason other than missing content
- **THEN** quick detail renders a concise announced error state with Retry and Close controls
- **AND** Retry starts a new snapshot request without changing the selected entity or resolved placement

#### Scenario: Content is missing or access is denied

- **WHEN** the entity is missing or access is denied
- **THEN** the overlay renders a concise local state with clearly announced feedback and a Close control
- **AND** it does not render Retry or a canonical full-detail action
- **AND** the owner surface remains mounted behind the modal

#### Scenario: Original article URL is absent

- **WHEN** the selected news article has no original URL
- **THEN** the drawer does not render an empty, disabled, or unusable original-article control

#### Scenario: Optional article regions are missing

- **WHEN** the selected news article has no description or feature image
- **THEN** the drawer omits the missing region without reserving an empty labeled surface

#### Scenario: A later open starts at the beginning

- **WHEN** a user dismisses quick detail after scrolling and later opens an entity quick detail again
- **THEN** the new opening starts at the top of the body scroll region
- **AND** it creates a new snapshot request even when the entity kind and ID are unchanged

#### Scenario: Open-session content remains stable

- **WHEN** a user is reading an open Event inspection or Article reader
- **THEN** the overlay does not automatically refetch or replace its content during that open session
- **AND** a later open or explicit retry may obtain fresh data from the existing permission-aware fetch path
