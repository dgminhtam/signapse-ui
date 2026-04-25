## ADDED Requirements

### Requirement: Detail page MUST prioritize article review information
The system SHALL present `/news-articles/{id}` as a review surface focused on article identity, processing status, readable content, and linked event validation.

#### Scenario: User opens a news article detail page
- **WHEN** an authorized user opens `/news-articles/{id}`
- **THEN** the page MUST show the article title, article status, news outlet name, published time, original link access, and readable description or content before low-priority system metadata

#### Scenario: Detail summary avoids duplicate metadata cards
- **WHEN** the detail page renders the top summary area
- **THEN** it MUST avoid showing duplicated fields that already appear in the header unless they materially help review the article

### Requirement: Detail page MUST de-emphasize system metadata
The system SHALL keep technical identifiers and backend trace fields out of the primary reading path.

#### Scenario: Technical metadata exists
- **WHEN** the article has fields such as `id`, `externalKey`, `newsOutletId`, `url`, `createdDate`, or `lastModifiedDate`
- **THEN** the page MUST either place those fields in a secondary technical information section or omit them from the primary detail layout

#### Scenario: User needs original URL
- **WHEN** the article has an original URL
- **THEN** the page MUST provide an obvious way to open the original article without rendering the raw URL as a dominant card in the primary layout

### Requirement: Detail page MUST prioritize linked event validation
The system SHALL make linked events easy to inspect because the main operator task is validating whether a news article maps to the correct event.

#### Scenario: Article has linked events
- **WHEN** the article detail payload includes linked events
- **THEN** the page MUST show linked event summaries near the article content and before low-priority technical metadata

#### Scenario: Article has no linked events
- **WHEN** the article has no linked events
- **THEN** the page MUST show a clear empty state explaining that no linked event exists yet

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
