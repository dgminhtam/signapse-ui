# workspace-local-quick-detail-overlays Specification

## Purpose
Defines explicit workspace-owned quick-detail overlays for analytical surfaces without global intercepted route behavior.

## Requirements
### Requirement: Analytical workspaces own quick-detail overlays explicitly
Analytical workspaces SHALL open entity quick detail through local workspace state instead of relying on global intercepted routes.

#### Scenario: Market chart opens event detail locally
- **WHEN** a user opens event detail from a market chart annotation
- **THEN** the market chart workspace renders a local event quick-detail drawer
- **AND** the current market chart URL remains unchanged

#### Scenario: Graph view opens entity detail locally
- **WHEN** a user opens event or news article detail from Graph View
- **THEN** Graph View renders a local quick-detail drawer
- **AND** the current Graph View URL remains unchanged

#### Scenario: Closing quick detail does not navigate
- **WHEN** a user closes a workspace-owned quick-detail drawer
- **THEN** the drawer closes by clearing local workspace state
- **AND** the close action does not call `router.back()`, `router.push()`, or `router.replace()`

### Requirement: Global quick-detail route interception is removed cleanly
The app SHALL NOT keep active global quick-detail route interception files, slots, placeholders, or route-level compatibility components after this change.

#### Scenario: Parallel route slot is absent
- **WHEN** the `(main)` layout renders protected app content
- **THEN** it renders the normal child route content without a `quickDetail` parallel route prop or slot

#### Scenario: Intercepted route tree is absent
- **WHEN** the repository is searched for active quick-detail interception routes
- **THEN** there is no active `app/[lang]/(main)/@quickDetail/**` route tree

#### Scenario: Route-level compatibility components are absent
- **WHEN** route-level quick-detail drawer wrappers have no local state-based usage
- **THEN** they are deleted rather than left as unused compatibility code

#### Scenario: No placeholders remain
- **WHEN** the global route interceptor is removed
- **THEN** placeholder `default`, `error`, `not-found`, route shell, and adapter files for the removed interceptor are not kept in the active app tree

### Requirement: Canonical detail routes remain full-page destinations
The system SHALL treat canonical event and news article detail URLs as full-page destinations outside local quick-detail state.

#### Scenario: Full detail action leaves workspace intentionally
- **WHEN** a local quick-detail drawer provides a full detail action
- **THEN** the action links to the canonical detail route for that entity
- **AND** activating it intentionally leaves the current analytical workspace

#### Scenario: Normal detail links are not intercepted globally
- **WHEN** a user activates a normal internal link to `/events/{id}` or `/news-articles/{id}`
- **THEN** the app renders the corresponding full detail page
- **AND** no global quick-detail overlay route handles the navigation

### Requirement: News article Quick detail omits canonical-detail escalation

Workspace-owned News article Quick detail drawers SHALL remain focused reader-first overlays and SHALL NOT expose a control that navigates to the canonical News article detail route.

#### Scenario: Authorized user reads a news article in Quick detail

- **WHEN** an authorized user opens a News article in local Quick detail
- **THEN** the drawer provides the focused article reading body without a canonical-detail navigation action
- **AND** the canonical article route remains available through normal links, direct URLs, reloads, and copied URLs outside the drawer

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

### Requirement: Local news article quick detail follows a reader-first hierarchy
Workspace-owned news article quick-detail drawers SHALL present article information in a focused single-column reading order based on the current canonical detail-page body hierarchy, without operational or linked-event review UI.

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
