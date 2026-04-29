## ADDED Requirements

### Requirement: Frontend MUST provide canonical news-article management routes
The system SHALL expose canonical article-management routes under `/news-articles`, and it MUST use that route family as the primary frontend surface for article management instead of `/source-documents`.

#### Scenario: Navigation points to the canon news-article route
- **WHEN** an authorized signed-in user can see the article-management entry in navigation
- **THEN** the navigation MUST point to `/news-articles`
- **AND** the frontend MUST present that entry as the canon article-management surface

#### Scenario: List route is protected by the article read gate
- **WHEN** a signed-in user opens `/news-articles` without satisfying the read gate for article management
- **THEN** the frontend MUST deny access using the repo's protected-route pattern

#### Scenario: Detail route is protected by the article read gate
- **WHEN** a signed-in user opens `/news-articles/{id}` without satisfying the read gate for article management
- **THEN** the frontend MUST deny access using the repo's protected-route pattern

### Requirement: Frontend MUST integrate the backend news-article contract
The system SHALL fetch and mutate article data through the backend `news-articles` surface, and it MUST shape list, detail, and operator actions around the backend fields `title`, `description`, `content`, `url`, `featureImage`, `newsOutletId`, `newsOutletName`, `publishedAt`, `status`, `externalKey`, `linkedEvents`, `createdDate`, and `lastModifiedDate`.

#### Scenario: List page uses the backend news-articles endpoint
- **WHEN** the article list page loads authorized data
- **THEN** the frontend MUST fetch paginated data from `GET /news-articles`
- **AND** it MUST parse rows using the `NewsArticleListResponse` shape instead of the legacy `SourceDocumentListResponse` shape

#### Scenario: Detail page uses the backend news-article endpoint
- **WHEN** an authorized user opens `/news-articles/{id}`
- **THEN** the frontend MUST fetch data from `GET /news-articles/{id}`
- **AND** it MUST parse the payload using the backend `NewsArticleResponse` shape

#### Scenario: Operator actions call the backend news-article endpoints
- **WHEN** an authorized user runs analyze, crawl full content, derive primary event, derive pending news events, delete, or update feature image
- **THEN** the frontend MUST call the corresponding `/news-articles*` endpoint
- **AND** it MUST no longer call the legacy `/source-documents*` surface for those article-management actions

#### Scenario: Derivation results use backend-aligned article naming
- **WHEN** the frontend receives a primary-event derivation result
- **THEN** it MUST read article identity from `newsArticleId` and `newsArticleTitle`
- **AND** it MUST read derivation outcome from the backend `status` field instead of the legacy `outcome` naming

### Requirement: News-article UI MUST reflect backend naming and simplified schema
The system SHALL present this feature as news-article management in route naming, component semantics, and user-facing copy, and it MUST remove source-document-specific metadata that no longer exists in the backend contract.

#### Scenario: List page no longer shows source-document-only fields
- **WHEN** the news-article list renders
- **THEN** it MUST NOT render `documentType`, `lifecycleStatus`, `readinessStatus`, or `eventDerivationStatus`
- **AND** it MUST derive row content from the backend article schema and article status only

#### Scenario: Detail page no longer shows removed source-document metadata
- **WHEN** the news-article detail page renders
- **THEN** it MUST NOT render economic-calendar-specific sections or source-document-only crawl and derivation metadata that are absent from the backend article contract
- **AND** it MUST present the record as a news article tied to a news outlet

#### Scenario: Canon copy uses news-article vocabulary
- **WHEN** the frontend renders page titles, descriptions, buttons, empty states, breadcrumbs, and toast copy for this feature
- **THEN** it MUST describe the entity as a news article rather than a source document
- **AND** it MUST use backend-aligned naming such as `newsOutletName` instead of legacy source-document wording

### Requirement: Legacy source-document routes MUST remain temporarily compatible
The system SHALL preserve compatibility for existing `/source-documents*` URLs while the canon article-management feature moves to `/news-articles`.

#### Scenario: Legacy list route redirects to the canon article list
- **WHEN** a user opens `/source-documents`
- **THEN** the frontend MUST redirect to `/news-articles`

#### Scenario: Legacy detail route redirects to the canon article detail
- **WHEN** a user opens `/source-documents/{id}`
- **THEN** the frontend MUST redirect to `/news-articles/{id}`
