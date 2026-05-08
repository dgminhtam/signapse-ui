## ADDED Requirements

### Requirement: News outlet list sort state is visible
The system SHALL show the effective default sort state on the `/news-outlets` list when no explicit sort query parameter is present.

#### Scenario: Default sort appears in toolbar
- **WHEN** an authorized user opens `/news-outlets` without a `sort` query parameter
- **THEN** the sort select shows the Vietnamese label for the effective `id_desc` default sort

#### Scenario: Explicit sort still wins
- **WHEN** an authorized user opens `/news-outlets` with a supported `sort` query parameter
- **THEN** the sort select shows the label matching that explicit sort value

### Requirement: News outlet active state is readable and accessible
The system SHALL show each outlet active state with both a readable Vietnamese status label and an accessible switch control.

#### Scenario: Active row shows readable state
- **WHEN** the list renders an active news outlet
- **THEN** the row shows a compact Vietnamese active-state label and a checked switch

#### Scenario: Inactive row shows readable state
- **WHEN** the list renders an inactive news outlet
- **THEN** the row shows a compact Vietnamese inactive-state label and an unchecked switch

#### Scenario: Switch is named for assistive technology
- **WHEN** the active-state switch is rendered for a news outlet
- **THEN** the switch exposes an accessible label that identifies the target news outlet and the state-changing control

### Requirement: News outlet primary cell uses concise source signals
The system SHALL reduce raw URL weight in the primary news outlet cell while preserving access to homepage and RSS URL values.

#### Scenario: Homepage URL renders as concise identity
- **WHEN** the list renders a news outlet with a homepage URL
- **THEN** the primary cell shows a concise homepage identity such as host or short host/path instead of making the full raw URL the dominant text

#### Scenario: RSS URL renders as configured signal
- **WHEN** the list renders a news outlet with an RSS URL
- **THEN** the primary cell shows a compact Vietnamese RSS configured signal instead of making the full raw RSS URL the dominant text

#### Scenario: Full URL remains accessible
- **WHEN** homepage or RSS values are compacted in the list
- **THEN** the full URL remains accessible through a secondary affordance such as tooltip, link target, detail/edit, or copy/open action

### Requirement: News outlet list actions expose tooltip affordances
The system SHALL keep compact icon-only row actions while exposing clear edit and delete tooltips.

#### Scenario: Edit action has tooltip and accessible label
- **WHEN** a user can update news outlets and the edit action renders
- **THEN** the edit action exposes a Vietnamese tooltip and an accessible label

#### Scenario: Delete action has tooltip and accessible label
- **WHEN** a user can delete news outlets and the delete action renders
- **THEN** the delete action exposes a Vietnamese tooltip and an accessible label while keeping destructive confirmation

#### Scenario: Button icons follow local shadcn convention
- **WHEN** edit or delete icons render inside buttons
- **THEN** those icons use the local `data-icon` convention for button icons

### Requirement: News outlet list hides detail-only slug metadata
The system SHALL not render slug as a table column on the `/news-outlets` list.

#### Scenario: List omits slug column
- **WHEN** an authorized user views the `/news-outlets` list
- **THEN** the table does not show a `Slug` column or slug value cells

#### Scenario: Detail and edit keep slug
- **WHEN** a user opens the create or detail/edit flow for a news outlet
- **THEN** slug remains available according to the existing form behavior

### Requirement: News outlet empty state uses product-facing copy
The system SHALL use concise Vietnamese product copy for the `/news-outlets` empty state and MUST NOT expose backend contract or migration language in that state.

#### Scenario: Empty list explains the user task
- **WHEN** the `/news-outlets` list has no results
- **THEN** the empty state explains that adding a source lets the system collect and process news content

#### Scenario: Empty list hides implementation details
- **WHEN** the `/news-outlets` empty state renders
- **THEN** the copy does not mention backend contracts, API migrations, or implementation details

### Requirement: News outlet list skeleton mirrors final table layout
The system SHALL keep the loading skeleton aligned with the final `/news-outlets` table structure.

#### Scenario: Skeleton omits removed slug column
- **WHEN** the `/news-outlets` list is loading
- **THEN** the skeleton table does not render a slug column placeholder

#### Scenario: Skeleton includes active-state shape
- **WHEN** the `/news-outlets` list is loading
- **THEN** the skeleton mirrors the final active-state column structure closely enough to avoid layout shift
