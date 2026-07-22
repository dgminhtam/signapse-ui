## ADDED Requirements

### Requirement: Local news article quick detail follows a reader-first hierarchy
Workspace-owned news article quick-detail drawers SHALL present article information in a focused single-column reading order without operational or linked-event review UI.

#### Scenario: News article quick detail renders
- **WHEN** an authorized user opens a news article in local quick detail
- **THEN** the drawer shows the article description when available, outlet, publication time, original-article access, feature image when available, and complete article content rendered with the canonical safe Typeset Markdown behavior
- **AND** the drawer does not show processing status, linked-event cards or empty states, redundant content headings, or dashboard-style content borders

#### Scenario: Article content contains Markdown
- **WHEN** the selected article contains supported CommonMark or GitHub Flavored Markdown
- **THEN** quick detail renders the same semantic headings, links, lists, blockquotes, code, tables, and safe HTML handling as the canonical detail page

#### Scenario: Drawer renders article content on a wide viewport
- **WHEN** news article quick detail has horizontal space beyond the canonical prose measure
- **THEN** its Typeset content uses the full available drawer body width
- **AND** the canonical detail page retains its readable constrained measure

#### Scenario: Original article access renders
- **WHEN** the selected news article has an original URL
- **THEN** the drawer exposes one original-article link beside outlet and publication metadata
- **AND** it does not repeat that action after the article content

#### Scenario: Optional article regions are missing
- **WHEN** the selected news article has no description or feature image
- **THEN** the drawer omits the missing region without reserving an empty labeled surface

### Requirement: Local quick detail provides extended reading space
The shared workspace-owned quick-detail drawer SHALL provide a taller stable reading surface while preserving workspace context and internal scroll containment.

#### Scenario: Local quick detail opens
- **WHEN** an event or news article quick detail opens on a supported viewport
- **THEN** the drawer uses approximately 90 percent of the small viewport height with a reasonable desktop cap
- **AND** the header and footer remain visible while long content scrolls inside the drawer body

#### Scenario: Viewport is short
- **WHEN** quick detail opens on a short viewport
- **THEN** the drawer remains within the visible viewport and leaves context behind the overlay

## MODIFIED Requirements

### Requirement: Local quick detail preserves focused reading behavior
Workspace-owned quick-detail drawers SHALL render focused reading content without embedding full page shells.

#### Scenario: Local event quick detail is focused
- **WHEN** a local event quick-detail drawer is open
- **THEN** it shows focused event reading content and evidence context
- **AND** it does not duplicate breadcrumb, list back button, or page-level technical panels from the full event detail page

#### Scenario: Local news article quick detail is focused
- **WHEN** a local news article quick-detail drawer is open
- **THEN** it shows focused reader-first article content without linked-event review context
- **AND** it does not duplicate breadcrumb, list back button, or page-level technical panels from the full news article detail page

#### Scenario: Access and missing-entity states stay local
- **WHEN** local quick detail cannot load content because of missing permissions, missing entity, or fetch failure
- **THEN** the drawer renders a concise local access-denied, empty, or error state
- **AND** the underlying analytical workspace remains mounted
