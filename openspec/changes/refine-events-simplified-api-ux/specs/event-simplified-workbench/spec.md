## ADDED Requirements

### Requirement: Event list follows the simplified event contract

The system SHALL render the event list from the simplified backend event contract and MUST NOT depend on removed event fields such as `summary`, `active`, `enrichmentStatus`, `enrichmentAttemptedAt`, `enrichmentCompletedAt`, or `enrichmentError`.

#### Scenario: Event row renders primary fields

- **WHEN** an authorized user opens `/events` and the backend returns event rows
- **THEN** each row shows the event title, description, status, occurred time, confidence, and detail action
- **AND** the row does not show a separate active badge or enrichment-status badge

#### Scenario: Event list search and controls remain available

- **WHEN** an authorized user opens `/events`
- **THEN** the page keeps the standard list toolbar, search, sort, page-size control, table surface, empty state, and pagination behavior used by Signapse admin lists

### Requirement: Event status uses the new enrichment lifecycle enum

The system SHALL present event status using the backend enum values `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, and `ARCHIVED`.

#### Scenario: Event status label is readable

- **WHEN** an event has a status from the simplified backend enum
- **THEN** the UI shows a professional Vietnamese label for that status
- **AND** the badge variant distinguishes failed, completed, archived, and pending states without relying on color alone

#### Scenario: Enrichment result status is handled

- **WHEN** an event enrichment action returns an `outcome`
- **THEN** the toast summary handles the same simplified enum values used by event status
- **AND** failed outcomes are presented as error feedback

### Requirement: Event detail prioritizes user-relevant information

The system SHALL make the event detail page prioritize event meaning, status, confidence, timing, description, and supporting evidence before technical identifiers.

#### Scenario: Detail header presents the core event

- **WHEN** an authorized user opens `/events/{id}`
- **THEN** the first visible content area shows the event status, confidence, occurred time, confirmed time, title, description, and available event enrichment action
- **AND** obsolete active or separate enrichment metadata is not shown in the primary header

#### Scenario: Evidence appears before classification sections

- **WHEN** the event detail page renders event relationship sections
- **THEN** evidence appears before assets and themes
- **AND** each evidence item keeps source title, outlet, publish time, role, confidence, article link when permitted, and original URL when available

#### Scenario: Assets and themes remain supporting context

- **WHEN** assets or themes exist on the event detail response
- **THEN** the system renders them as supporting context after evidence
- **AND** empty states remain clear when either section has no data

### Requirement: Event technical metadata is available but secondary

The system SHALL keep event identifiers and audit timestamps accessible without making them the primary reading path.

#### Scenario: Technical details are below core content

- **WHEN** an authorized user opens event detail
- **THEN** `id`, `slug`, `canonicalKey`, `createdDate`, and `lastModifiedDate` are grouped in a lower-priority technical details area
- **AND** the primary content above it remains focused on event status, meaning, evidence, and market impact context

### Requirement: Event loading and empty states match the final layout

The system SHALL update event skeleton and empty states so loading feedback matches the simplified list and detail layouts.

#### Scenario: Event list skeleton mirrors simplified table

- **WHEN** `/events` is loading
- **THEN** the skeleton shows the same reduced table columns and toolbar structure as the final event list

#### Scenario: Event detail skeleton mirrors simplified detail

- **WHEN** `/events/{id}` is loading
- **THEN** the skeleton reflects the simplified header, core fact row, evidence-first section order, and lower-priority technical details area

### Requirement: Event documentation reflects frontend alignment

The system SHALL update API mapping documentation after the event UI is aligned with the simplified backend event contract.

#### Scenario: APIMAPPING documents aligned event fields

- **WHEN** the implementation is complete
- **THEN** `docs/APIMAPPING.md` describes the event frontend as aligned with `description`, simplified `status`, `deferredCount`, and evidence-first rendering
- **AND** it removes stale notes saying the event screen still depends on removed event fields
