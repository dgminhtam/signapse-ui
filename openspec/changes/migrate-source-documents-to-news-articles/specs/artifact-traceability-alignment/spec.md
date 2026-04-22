## ADDED Requirements

### Requirement: Event evidence MUST be artifact-aware
The system SHALL render event evidence using the backend artifact evidence shape, and it MUST stop assuming that every evidence record is a source document.

#### Scenario: Event detail parses artifact evidence fields
- **WHEN** the frontend renders `GET /events/{id}` evidence
- **THEN** it MUST read `artifactType`, `artifactId`, `artifactTitle`, `artifactUrl`, `newsOutletName`, `publishedAt`, `evidenceRole`, `confidence`, and `evidenceNote`
- **AND** it MUST NOT depend on legacy `sourceDocument*` fields as the canon evidence contract

#### Scenario: Event evidence internal drilldown only targets news articles when appropriate
- **WHEN** an event evidence record represents a `NEWS_ARTICLE` and the user can read articles
- **THEN** the frontend MUST offer an internal link to `/news-articles/{artifactId}`
- **AND** it MUST avoid presenting a `/source-documents/{id}` drilldown as the canon target

### Requirement: Market-query evidence MUST use artifact naming and drilldown rules
The system SHALL render market-query evidence using backend artifact terminology and MUST align traceability links with the article canon route.

#### Scenario: Market-query evidence parses artifact fields
- **WHEN** the frontend renders market-query evidence returned from `POST /query`
- **THEN** it MUST read `artifactType`, `artifactId`, `artifactTitle`, `artifactUrl`, `newsOutletName`, `publishedAt`, `evidenceRole`, and `evidenceConfidence`
- **AND** it MUST stop presenting those evidence records with legacy `sourceDocument*` naming as canon

#### Scenario: Market-query drilldown targets the canon article route
- **WHEN** a market-query evidence record represents a readable `NEWS_ARTICLE`
- **THEN** the frontend MUST link to `/news-articles/{artifactId}`
- **AND** it MUST use a generic artifact presentation for non-article evidence records

### Requirement: Graph view MUST adopt backend news-article graph entities
The system SHALL align graph-view parsing and drilldown behavior with the backend graph contract for articles and artifact edges.

#### Scenario: Graph view parses backend news-article node and edge kinds
- **WHEN** the frontend parses `GET /graph-view`
- **THEN** node kinds MUST include `news-article`
- **AND** edge kinds MUST include `source-artifact-event`
- **AND** the frontend MUST stop treating `source-document` and `source-document-event` as the canon graph naming

#### Scenario: Graph view article drilldown uses the canon article route
- **WHEN** a user drills into a graph node that represents a news article and has article read access
- **THEN** the frontend MUST offer internal drilldown to `/news-articles/{id}`
- **AND** it MUST not use `/source-documents/{id}` as the canon drilldown target

#### Scenario: Graph node metadata uses backend-aligned outlet naming
- **WHEN** the graph-view inspector renders metadata for an article node
- **THEN** it MUST read `newsOutletName` from backend metadata
- **AND** it MUST stop presenting legacy `sourceName` as the canon article metadata field
