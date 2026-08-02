# news-article-detail-review-alignment Specification

## Purpose
TBD - created by archiving change resolve-news-article-detail-review-findings. Update Purpose after archive.

## Requirements

### Requirement: News article route identity is consistent
The system SHALL present the `/news-articles` route with one consistent user-facing label across sidebar navigation and breadcrumbs.

#### Scenario: User opens a news article detail page
- **WHEN** an authorized user opens `/news-articles/{id}`
- **THEN** the active sidebar item and breadcrumb parent label use the same Vietnamese product term for the route

#### Scenario: User navigates from list to detail
- **WHEN** an authorized user moves from `/news-articles` to `/news-articles/{id}`
- **THEN** the route identity remains consistent between the list page, sidebar, and detail breadcrumb

### Requirement: Detail page follows an editorial reading hierarchy
The news article detail page SHALL present article information in one consistent reading order across viewport sizes.

#### Scenario: Article has summary and feature image
- **WHEN** an authorized user opens an article with a summary and feature image
- **THEN** the page shows title and provenance first, followed by the summary, feature image, and article body

#### Scenario: Optional article content is missing
- **WHEN** the summary or feature image is absent
- **THEN** the page omits the missing region without reserving an empty labeled surface

### Requirement: Detail header is the primary metadata location
The news article detail page SHALL use the header provenance row as the single visible location for the article-owned source-name snapshot, publication time, and original-article access.

#### Scenario: Article header renders core provenance
- **WHEN** an authorized user opens a news article detail page
- **THEN** the header shows `sourceName`, published time, and original-article access once beneath the headline

#### Scenario: Reading content renders
- **WHEN** summary, image, and body content render below the header
- **THEN** those regions do not repeat status, source name, publication time, or technical metadata cards

### Requirement: Long article content uses a readable desktop measure
The news article detail page SHALL constrain long-form article content to approximately 65-75 characters per line on desktop, use at least base body text sizing with relaxed line height, and preserve responsive behavior on smaller viewports.

#### Scenario: Desktop user reads article content
- **WHEN** an authorized user views article content on a desktop-width viewport
- **THEN** body copy remains in a narrow prose column instead of spanning the workspace width

#### Scenario: Mobile user reads article content
- **WHEN** an authorized user views article content on a narrow viewport
- **THEN** the prose column fills the available width without horizontal scrolling

### Requirement: Detail skeleton mirrors final layout
The news article detail loading skeleton SHALL mirror the reader-first layout closely enough to avoid visible structural movement when data resolves.

#### Scenario: Detail page is loading
- **WHEN** the news article detail data is suspended
- **THEN** the fallback reserves space for headline and provenance, summary/media flow, article body, and the optional compact administrative action

#### Scenario: Loaded page replaces skeleton
- **WHEN** the suspended detail data resolves
- **THEN** the loaded page does not introduce linked-event, technical-information, status, or primary-action regions absent from the skeleton
