# news-article-detail-review-ux Specification

## Purpose
TBD - created by archiving change refine-news-article-detail-ux. Update Purpose after archive.

## Requirements

### Requirement: Detail page MUST prioritize article review information
The system SHALL present `/news-articles/{id}` as a reading-first article surface focused on article identity, source attribution, summary, feature image, and readable content.

#### Scenario: User opens a news article detail page
- **WHEN** an authorized user opens `/news-articles/{id}`
- **THEN** the page MUST show the article title, article-owned `sourceName` snapshot, published time, original article access, summary when available, feature image when available, and readable article content in that order

#### Scenario: Detail header avoids operational status
- **WHEN** the detail header renders article identity and provenance
- **THEN** it MUST NOT show processing status or other operational metadata that competes with the reading task

### Requirement: Detail page MUST de-emphasize system metadata
The system SHALL omit technical identifiers, backend trace fields, and the visible technical information section from the news article reading surface.

#### Scenario: Article response contains technical metadata
- **WHEN** the article response contains fields such as `id`, `createdDate`, or `lastModifiedDate`
- **THEN** the page MUST NOT render those values as visible article metadata

#### Scenario: User needs original URL
- **WHEN** the article has an original URL
- **THEN** the page MUST provide an obvious original-article link beside the source and publication metadata without rendering the raw URL

### Requirement: Manual AI analysis action MUST be removed from news article UI
The system SHALL stop exposing manual AI analysis for news articles because analysis is handled by cronjob workflow.

#### Scenario: User views the news article list
- **WHEN** the news article list renders row actions
- **THEN** it MUST NOT show a `Phan tich AI` action or any button that calls `POST /news-articles/{id}/analyze`

#### Scenario: User views a news article detail page
- **WHEN** the news article detail header renders actions
- **THEN** it MUST NOT show a `Phan tich AI` action or any button that calls `POST /news-articles/{id}/analyze`

#### Scenario: Frontend data layer is reviewed
- **WHEN** the frontend no longer renders any manual analyze UI
- **THEN** it MUST remove unused frontend code paths for `analyzeNewsArticle` unless another active UI surface still imports them

### Requirement: News article copy MUST use professional Vietnamese
The system SHALL use professional Vietnamese copy for touched news article labels, button text, toast messages, descriptions, and empty states.

#### Scenario: News article detail or action copy is updated
- **WHEN** implementation edits user-facing copy in `news-articles`
- **THEN** the updated copy MUST use Vietnamese with proper diacritics and MUST avoid legacy no-diacritic strings such as `Chua co`, `Phan tich`, or `Suy dien`

### Requirement: API documentation MUST reflect cronjob analysis workflow
The system SHALL document that manual frontend usage of `POST /news-articles/{id}/analyze` has been retired.

#### Scenario: API mapping is reviewed
- **WHEN** `docs/APIMAPPING.md` describes `POST /news-articles/{id}/analyze`
- **THEN** it MUST mark the endpoint as not used by the UI and explain that analysis is handled through cronjob workflow
