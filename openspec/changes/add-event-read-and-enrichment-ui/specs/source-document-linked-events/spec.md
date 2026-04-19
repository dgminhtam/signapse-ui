## ADDED Requirements

### Requirement: Source-document detail MUST display linked-event summaries
The source-document detail view SHALL map `linkedEvents` from `GET /source-documents/{id}` and MUST render those linked-event summaries in a dedicated section when present.

#### Scenario: Linked events are shown with traceability metadata
- **WHEN** a source-document detail response contains one or more `linkedEvents`
- **THEN** the page MUST render each linked event with enough summary data to identify the event, its status, its enrichment status, and its evidence relationship to the source document

#### Scenario: Linked events section handles no relationships
- **WHEN** a source-document detail response contains no `linkedEvents`
- **THEN** the page MUST show an empty state or equivalent no-data treatment for the linked-events section

### Requirement: Linked-event navigation MUST respect event read permission
The source-document detail SHALL allow navigation from a linked-event summary into event detail only when the current user has `event:read`.

#### Scenario: Linked events deep-link into event detail for authorized users
- **WHEN** a user with `event:read` views a source document that has linked events
- **THEN** each linked-event summary MUST provide navigation to `/events/{id}`

#### Scenario: Linked-event summaries remain non-interactive without event read permission
- **WHEN** a user without `event:read` views a source document that has linked events
- **THEN** the frontend MUST still show linked-event summary metadata but MUST not expose interactive navigation to event detail

### Requirement: Source-document event affordances MUST align with dedicated source-document permissions
The frontend SHALL gate source-document event-processing controls with dedicated `source-document:*` permissions and MUST not rely on legacy `article:*` or `event:*` compatibility fallbacks for source-document access decisions.

#### Scenario: Source-document read surfaces use source-document read permission
- **WHEN** the frontend evaluates access to source-document routes and navigation
- **THEN** it MUST use `source-document:read` as the canonical read permission for that domain

#### Scenario: Source-document operator actions use source-document analyze permission
- **WHEN** the frontend evaluates the analyze, crawl-full-content, derive-primary-event, or event-enrich operator affordances attached to source-document workflows
- **THEN** it MUST gate those controls with `source-document:analyze`
