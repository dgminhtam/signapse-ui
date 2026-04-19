## ADDED Requirements

### Requirement: Frontend MUST provide a protected event browsing surface
The system SHALL provide protected frontend routes for event list and event detail, and it MUST gate those surfaces with `event:read`.

#### Scenario: Event navigation is shown only to authorized users
- **WHEN** a signed-in user can satisfy `event:read`
- **THEN** the protected navigation MUST include an entry for the event surface

#### Scenario: Event route access is denied without event read permission
- **WHEN** a signed-in user opens `/events` or `/events/{id}` without `event:read`
- **THEN** the frontend MUST deny access using the repo's protected-route permission pattern

### Requirement: Event list MUST render core event metadata for browsing
The event list SHALL load `GET /events` and MUST render each event with, at minimum, `title`, `status`, `enrichmentStatus`, `occurredAt`, and `confidence`, together with standard pagination and sort controls.

#### Scenario: Event list shows browse-ready fields
- **WHEN** the backend returns a page of events
- **THEN** the frontend MUST render each row or card with the event title, status, enrichment status, occurred-at time, and confidence

#### Scenario: Event list handles empty results
- **WHEN** `GET /events` returns an empty page
- **THEN** the frontend MUST show the repo-standard empty state for the event surface

### Requirement: Event detail MUST render related assets, themes, and evidence
The event detail view SHALL load `GET /events/{id}` and MUST show event core data, enrichment metadata, related assets, related themes, and evidence source documents in distinct sections.

#### Scenario: Event detail shows full relation blocks
- **WHEN** the frontend loads an event detail successfully
- **THEN** the page MUST render separate sections for core event information, enrichment status, assets, themes, and evidence

#### Scenario: Event evidence supports traceability back to source documents
- **WHEN** an event detail contains evidence items with `sourceDocumentId`
- **THEN** the frontend MUST provide a way to open the corresponding source-document detail from each evidence item

### Requirement: Event enrich operators MUST follow the backend permission matrix
The frontend SHALL expose single-event and batch event enrich actions, and it MUST gate those actions with `source-document:analyze` rather than `event:crawl`.

#### Scenario: Authorized users can run single-event enrichment
- **WHEN** a user with `event:read` and `source-document:analyze` views an event detail page
- **THEN** the page MUST show a control that triggers `POST /events/{id}/enrich-assets-and-themes`

#### Scenario: Authorized users can run batch event enrichment
- **WHEN** a user with `event:read` and `source-document:analyze` views the event list
- **THEN** the toolbar MUST show a control that triggers `POST /events/enrich-pending-assets-and-themes`

#### Scenario: Event enrich actions provide operator feedback
- **WHEN** an event enrich action completes
- **THEN** the frontend MUST refresh the affected event surfaces and show toast feedback derived from the backend response summary
