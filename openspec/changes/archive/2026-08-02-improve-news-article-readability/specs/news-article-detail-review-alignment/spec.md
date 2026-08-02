## ADDED Requirements

### Requirement: Detail page follows an editorial reading hierarchy
The news article detail page SHALL present article information in one consistent reading order across viewport sizes.

#### Scenario: Article has summary and feature image
- **WHEN** an authorized user opens an article with a summary and feature image
- **THEN** the page shows title and provenance first, followed by the summary, feature image, and article body

#### Scenario: Optional article content is missing
- **WHEN** the summary or feature image is absent
- **THEN** the page omits the missing region without reserving an empty labeled surface

## MODIFIED Requirements

### Requirement: Detail header is the primary metadata location
The news article detail page SHALL use the header provenance row as the single visible location for outlet, publication time, and original-article access.

#### Scenario: Article header renders core provenance
- **WHEN** an authorized user opens a news article detail page
- **THEN** the header shows outlet, published time, and original-article access once beneath the headline

#### Scenario: Reading content renders
- **WHEN** summary, image, and body content render below the header
- **THEN** those regions do not repeat status, outlet, publication time, or technical metadata cards

### Requirement: Long article content uses a readable desktop measure
The news article detail page SHALL constrain long-form article content to approximately 65–75 characters per line on desktop, use at least base body text sizing with relaxed line height, and preserve responsive behavior on smaller viewports.

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

## REMOVED Requirements

### Requirement: Detail page prioritizes linked event review before long content

**Reason**: Linked-event validation is no longer part of the reader-first detail route.

**Migration**: Remove linked-event content and empty-state regions from the page and its loading skeleton.
