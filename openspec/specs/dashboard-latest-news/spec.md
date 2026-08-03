# dashboard-latest-news Specification

## Purpose

Define the live Latest News module for the production dashboard.
## Requirements
### Requirement: Latest News uses the five most recent global articles

The Latest News module SHALL use the existing authenticated `GET /news-articles` contract to request five articles with page zero, size five, and `publishedAt` descending. The request MUST NOT be scoped by the active workspace or include a workspace-specific filter.

#### Scenario: Dashboard requests global latest news

- **WHEN** an authenticated user with news read permission opens the dashboard with a readable active workspace
- **THEN** the dashboard requests `GET /news-articles` with page `0`, size `5`, and descending `publishedAt` ordering
- **AND** the request does not include the active workspace identifier or a workspace filter

### Requirement: Latest News presents article information without internal metadata

The Latest News module SHALL render each returned article using its title, description, source name, publication time, and optional `featureImage` when available. Missing optional values SHALL use localized fallbacks. When an article has an image, the row SHALL render it through `ItemMedia variant="image"` using the best available media URL in thumbnail-to-original order; when no usable image exists, it SHALL render the existing newspaper icon. The module SHALL provide a localized header action to the existing `/news-articles` route. Each article row SHALL be a regular shadcn `Item` container with a native button around the visible title only, opening the shared dashboard news-article quick-detail drawer on pointer or keyboard activation. Descriptions, source, publication time, and media SHALL remain non-interactive. Rows SHALL NOT expose a per-row canonical `/news-articles/{id}` `href`; the drawer SHALL provide the explicit full-page action. The module SHALL NOT expose internal derivation status, event/calendar relationships, or other unsupported metadata.

#### Scenario: Latest News has articles

- **WHEN** the news request succeeds with one or more articles
- **THEN** the module renders no more than five article rows
- **AND** each row presents the article title and available description, source, and publication time
- **AND** each title is a keyboard-reachable localized button with an accessible article-open name
- **AND** each row renders its available feature image through `ItemMedia variant="image"`, or the newspaper icon when no usable image exists
- **AND** a pointer click, Enter, or Space on the title opens the shared news-article quick-detail drawer without changing the dashboard URL
- **AND** the module header links to the localized `/news-articles` list route
- **AND** no row presents derivation status, event relationship, calendar metadata, or unsupported internal metadata

#### Scenario: User opens the canonical article page

- **WHEN** a user activates the drawer's full-page action on an article row
- **THEN** the application navigates to the current-locale `/news-articles/{id}` route

#### Scenario: An article omits optional display fields

- **WHEN** an article has no description, source name, or publication time
- **THEN** the module renders the corresponding localized fallback instead of blank or hardcoded text

### Requirement: Latest News has independent permission and data states

The module SHALL provide localized loading, empty, and error states without preventing the other dashboard modules from rendering. When the user lacks the existing news read permission, the module SHALL make no news request and SHALL be omitted from the dashboard.

#### Scenario: News is loading

- **WHEN** the dashboard is waiting for the news request
- **THEN** the Latest News region renders a compact skeleton footprint matching the final module

#### Scenario: News has no articles

- **WHEN** the news request succeeds with an empty result
- **THEN** the module renders a localized empty state
- **AND** the empty state provides the existing news list action

#### Scenario: News request fails

- **WHEN** the news request fails after the dashboard workspace gate succeeds
- **THEN** Latest News renders a localized error state inside its own module
- **AND** Current Workspace, Trading Snapshot, and Event Timeline remain available

#### Scenario: User cannot read news

- **WHEN** the user has none of the existing news article read permissions
- **THEN** the dashboard does not request news articles
- **AND** the Latest News module is not rendered
