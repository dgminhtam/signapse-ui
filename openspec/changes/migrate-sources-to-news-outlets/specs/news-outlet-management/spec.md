## ADDED Requirements

### Requirement: Frontend MUST provide a protected news-outlet management feature
The system SHALL expose a protected news-outlet management feature under the canon route `/news-outlets`, and it MUST use backend-aligned `news-outlet:*` permissions for navigation visibility, route access, and management actions.

#### Scenario: News-outlet navigation is shown only to authorized users
- **WHEN** a signed-in user can satisfy `news-outlet:read`
- **THEN** the protected navigation MUST include the news-outlet entry under the content group

#### Scenario: News-outlet list route is denied without read permission
- **WHEN** a signed-in user opens `/news-outlets` without `news-outlet:read`
- **THEN** the frontend MUST deny access using the repo's protected-route permission pattern

#### Scenario: News-outlet create route is denied without create permission
- **WHEN** a signed-in user opens `/news-outlets/create` without `news-outlet:create`
- **THEN** the frontend MUST deny access using the repo's protected-route permission pattern

#### Scenario: News-outlet detail-edit route is denied without update permission
- **WHEN** a signed-in user opens `/news-outlets/{id}` without `news-outlet:update`
- **THEN** the frontend MUST deny access using the repo's protected-route permission pattern

### Requirement: Frontend MUST integrate the backend news-outlet contract
The system SHALL use the backend `news-outlets` surface as the source of truth for this feature, and it MUST shape list, create, update, toggle-active, and delete flows around the backend request and response fields `name`, `slug`, `description`, `homepageUrl`, `rssUrl`, and `active`.

#### Scenario: News-outlet list uses the new backend endpoint
- **WHEN** the list page loads authorized data
- **THEN** the frontend MUST fetch paginated data from `GET /news-outlets`
- **AND** it MUST parse records using the news-outlet response shape instead of the legacy source response shape

#### Scenario: Create request omits legacy source-only fields
- **WHEN** an authorized user submits the create form
- **THEN** the frontend MUST send `POST /news-outlets`
- **AND** the request body MUST only include supported news-outlet fields from the backend contract
- **AND** it MUST NOT submit legacy source-only fields such as `type`, ingest metadata, `systemManaged`, or `url`

#### Scenario: Update request uses backend-aligned field names
- **WHEN** an authorized user submits edits for an existing news outlet
- **THEN** the frontend MUST send `PUT /news-outlets/{id}`
- **AND** it MUST use `homepageUrl` instead of the legacy `url` field name

#### Scenario: Toggle and delete flows use news-outlet endpoints
- **WHEN** an authorized user toggles active state or deletes a record
- **THEN** the frontend MUST call `/news-outlets/{id}/toggle-active` for active-state changes
- **AND** it MUST call `DELETE /news-outlets/{id}` for destructive deletion

### Requirement: News-outlet UI MUST reflect backend naming and schema
The system SHALL present this feature as news-outlet management in route naming, component semantics, and user-facing copy, and it MUST remove legacy source-specific fields or UI sections that are no longer represented in the backend contract.

#### Scenario: List page no longer shows legacy source-only metadata
- **WHEN** the news-outlet list renders
- **THEN** it MUST show columns and summaries derived from the backend news-outlet schema
- **AND** it MUST NOT render legacy source-only affordances such as `type`, ingest status, ingest timestamps, or `systemManaged`

#### Scenario: Form uses backend field vocabulary
- **WHEN** a user opens create or edit for a news outlet
- **THEN** the form MUST render fields for `name`, `slug`, `description`, `homepageUrl`, `rssUrl`, and `active`
- **AND** it MUST NOT render a source `type` selector or any ingest-configuration section

#### Scenario: Detail-edit page uses news-outlet copy
- **WHEN** a user opens the canon detail-edit route
- **THEN** page title, description, buttons, empty state, and toast copy MUST describe the entity as a news outlet rather than a generic source

### Requirement: Legacy source routes MUST remain temporarily compatible
The system SHALL preserve compatibility for existing legacy source URLs while the canon feature moves to `/news-outlets`.

#### Scenario: Legacy list routes redirect to the canon list page
- **WHEN** a user opens `/sources` or `/news-sources`
- **THEN** the frontend MUST redirect to `/news-outlets`

#### Scenario: Legacy create routes redirect to the canon create page
- **WHEN** a user opens `/sources/create` or `/news-sources/create`
- **THEN** the frontend MUST redirect to `/news-outlets/create`

#### Scenario: Legacy detail routes redirect to the canon detail page
- **WHEN** a user opens `/sources/{id}` or `/news-sources/{id}`
- **THEN** the frontend MUST redirect to `/news-outlets/{id}`

### Requirement: News-outlet management MUST respect backend permission boundaries
The system SHALL gate management affordances using the backend-aligned `news-outlet:*` permissions so users only see actions they can execute.

#### Scenario: Create action is hidden without create permission
- **WHEN** a user can read news outlets but cannot satisfy `news-outlet:create`
- **THEN** the list page MUST NOT render the create action

#### Scenario: Edit and toggle actions require update permission
- **WHEN** a user cannot satisfy `news-outlet:update`
- **THEN** the frontend MUST NOT provide interactive edit or active-toggle affordances for news-outlet records

#### Scenario: Delete action requires delete permission
- **WHEN** a user cannot satisfy `news-outlet:delete`
- **THEN** the frontend MUST NOT provide an interactive delete affordance for news-outlet records
