# event-adjacent-news-article-contracts Specification

## Purpose
TBD - created by archiving change remove-event-confirmed-at. Update Purpose after archive.
## Requirements
### Requirement: News article linked events use the current event summary contract
The system SHALL model linked events on news article detail without `eventSlug` and without the removed separate enrichment lifecycle field.

#### Scenario: Linked event badges use current event status
- **WHEN** a news article detail page renders linked events
- **THEN** linked event status badges use the current event status enum values `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, and `ARCHIVED`
- **THEN** no separate enrichment-status badge is rendered from `eventEnrichmentStatus`

#### Scenario: Linked event links use event id
- **WHEN** a linked event has an `eventId` and the user can read events
- **THEN** the event link points to `/events/{eventId}`
- **THEN** the UI does not depend on `eventSlug`

### Requirement: Market chart annotation evidence uses news article identifiers
The system SHALL model market chart annotation evidence with `newsArticleId` instead of `sourceDocumentId`.

#### Scenario: Annotation evidence parses news article id
- **WHEN** the market chart candle response includes annotation evidence with `newsArticleId`
- **THEN** the frontend response schema accepts the field
- **THEN** the parsed evidence preserves the id for downstream displays or links

#### Scenario: Annotation evidence no longer expects source document id
- **WHEN** market chart annotation evidence is parsed
- **THEN** the frontend does not require or type the removed `sourceDocumentId` field

### Requirement: Graph view uses news article event edge kind
The system SHALL accept, label, filter, and style graph edges with kind `news-article-event` instead of `source-artifact-event`.

#### Scenario: Graph response validation accepts renamed edge kind
- **WHEN** `GET /graph-view` returns an edge with kind `news-article-event`
- **THEN** frontend validation succeeds

#### Scenario: Graph controls include renamed edge kind
- **WHEN** graph edge filters or legends are rendered
- **THEN** they refer to `news-article-event`
- **THEN** they do not expose `source-artifact-event`

#### Scenario: Graph edge visuals remain stable
- **WHEN** the graph contains news article event edges
- **THEN** those edges retain the intended evidence-to-event visual treatment

