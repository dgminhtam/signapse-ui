## ADDED Requirements

### Requirement: News article Quick detail omits canonical-detail escalation
Workspace-owned News article Quick detail drawers SHALL remain focused reader-first overlays and SHALL NOT expose a control that navigates to the canonical News article detail route.

#### Scenario: Authorized user reads a news article in Quick detail
- **WHEN** an authorized user opens a News article in local Quick detail
- **THEN** the drawer provides the focused article reading body without a canonical-detail navigation action
- **AND** the canonical article route remains available through normal links, direct URLs, reloads, and copied URLs outside the drawer

## MODIFIED Requirements

### Requirement: Local news article quick detail follows a reader-first hierarchy
Workspace-owned News article quick-detail drawers SHALL present article information in a focused single-column reading order based on the current canonical detail-page body hierarchy, without operational or linked-event review UI.

#### Scenario: News article quick detail renders
- **WHEN** an authorized user opens a news article in local quick detail
- **THEN** the drawer shows the article description when available, the article-owned outlet and publication time, one original-article access control only when an original URL exists, an uncropped feature image when available, and complete article content rendered with the canonical safe Typeset Markdown behavior
- **AND** the drawer does not show processing status, linked-event cards or empty states, redundant content headings, dashboard-style content borders, page breadcrumb, list back button, or full-page shell chrome

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

#### Scenario: Original article URL is absent
- **WHEN** the selected news article has no original URL
- **THEN** the drawer does not render an empty, disabled, or unusable original-article control

#### Scenario: Optional article regions are missing
- **WHEN** the selected news article has no description or feature image
- **THEN** the drawer omits the missing region without reserving an empty labeled surface

### Requirement: Local quick detail provides extended reading space
The shared workspace-owned quick-detail drawer SHALL provide a taller stable reading surface while preserving workspace context and internal scroll containment.

#### Scenario: Local quick detail opens
- **WHEN** an event or news article quick detail opens on a supported viewport
- **THEN** the drawer uses approximately 90 percent of the small viewport height with a reasonable desktop cap
- **AND** the header remains visible while long content scrolls inside the drawer body

#### Scenario: Viewport is short
- **WHEN** quick detail opens on a short viewport
- **THEN** the drawer remains within the visible viewport and leaves context behind the overlay
