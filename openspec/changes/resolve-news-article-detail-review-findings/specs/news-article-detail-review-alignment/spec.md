## ADDED Requirements

### Requirement: News article route identity is consistent
The system SHALL present the `/news-articles` route with one consistent user-facing label across sidebar navigation and breadcrumbs.

#### Scenario: User opens a news article detail page
- **WHEN** an authorized user opens `/news-articles/{id}`
- **THEN** the active sidebar item and breadcrumb parent label use the same Vietnamese product term for the route

#### Scenario: User navigates from list to detail
- **WHEN** an authorized user moves from `/news-articles` to `/news-articles/{id}`
- **THEN** the route identity remains consistent between the list page, sidebar, and detail breadcrumb

### Requirement: Detail page prioritizes linked event review before long content
The news article detail page SHALL place linked event review before long-form article content in the main reading order.

#### Scenario: Article has linked events
- **WHEN** an authorized user opens a news article that has linked event summaries
- **THEN** the page shows linked event cards after the article summary area and before the full article content

#### Scenario: Article has no linked events
- **WHEN** an authorized user opens a news article with no linked events
- **THEN** the page shows the linked event empty state before the full article content

### Requirement: Detail header is the primary metadata location
The news article detail page SHALL avoid repeating status, outlet, and published time as duplicate first-viewport metadata cards when those fields already appear in the header.

#### Scenario: Article header renders core facts
- **WHEN** an authorized user opens a news article detail page
- **THEN** the header shows the article status, outlet, and published time once in the primary review area

#### Scenario: Summary cards render
- **WHEN** the detail page renders any first-viewport summary cards
- **THEN** those cards contain non-redundant information that materially helps the article review task

### Requirement: Long article content uses a readable desktop measure
The news article detail page SHALL constrain long-form article content to a readable line length on desktop while preserving responsive behavior on smaller viewports.

#### Scenario: Desktop user reads article content
- **WHEN** an authorized user views article content on a desktop-width viewport
- **THEN** the content text does not span the full workspace width when that would create excessively long lines

#### Scenario: Mobile user reads article content
- **WHEN** an authorized user views article content on a narrow viewport
- **THEN** the content remains readable without horizontal scrolling

### Requirement: Detail skeleton mirrors final layout
The news article detail loading skeleton SHALL mirror the final detail layout closely enough to avoid visible layout shift when data resolves.

#### Scenario: Detail page is loading
- **WHEN** the news article detail data is suspended
- **THEN** the fallback reserves space for the header, action group, summary/media area, linked event area, content area, and technical information section

#### Scenario: Loaded page replaces skeleton
- **WHEN** the suspended detail data resolves
- **THEN** the loaded page does not introduce major structural movement caused by missing action placeholders or extra skeleton-only labels
