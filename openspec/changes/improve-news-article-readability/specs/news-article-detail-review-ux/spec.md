## MODIFIED Requirements

### Requirement: Detail page MUST prioritize article review information
The system SHALL present `/news-articles/{id}` as a reading-first article surface focused on article identity, provenance, summary, feature image, and readable content.

#### Scenario: User opens a news article detail page
- **WHEN** an authorized user opens `/news-articles/{id}`
- **THEN** the page MUST show the article title, news outlet name, published time, original article access, summary when available, feature image when available, and readable article content in that order

#### Scenario: Detail header avoids operational status
- **WHEN** the detail header renders article identity and provenance
- **THEN** it MUST NOT show processing status or other operational metadata that competes with the reading task

### Requirement: Detail page MUST de-emphasize system metadata
The system SHALL omit technical identifiers, backend trace fields, and the visible technical information section from the news article reading surface.

#### Scenario: Article response contains technical metadata
- **WHEN** the article response contains fields such as `id`, `externalKey`, `newsOutletId`, `createdDate`, or `lastModifiedDate`
- **THEN** the page MUST NOT render those values as visible article metadata

#### Scenario: User needs original URL
- **WHEN** the article has an original URL
- **THEN** the page MUST provide an obvious original-article link beside the source and publication metadata without rendering the raw URL

## REMOVED Requirements

### Requirement: Detail page MUST prioritize linked event validation

**Reason**: The route is now a reading-first article surface and linked-event operations no longer belong in its primary information hierarchy.

**Migration**: Do not render linked-event summaries or empty states on `/news-articles/{id}`; event review remains available through event-focused workflows.
