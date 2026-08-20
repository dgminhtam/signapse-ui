## MODIFIED Requirements

### Requirement: Latest News presents article information without internal metadata
The Latest News module SHALL render each returned article using its title, description, source name, publication time, and optional `featureImage` when available. Missing optional values SHALL use localized fallbacks. When an article has an image, the row SHALL render it through `ItemMedia variant="image"` using the best available media URL in thumbnail-to-original order; when no usable image exists, it SHALL render the existing newspaper icon. The module SHALL provide a localized header action to the existing `/news-articles` route. Each article row SHALL be a regular shadcn `Item` container with a native button around the visible title only, opening the shared dashboard News article Quick detail drawer on pointer or keyboard activation. Descriptions, source, publication time, and media SHALL remain non-interactive. Rows SHALL NOT expose a per-row canonical `/news-articles/{id}` `href`, and the News article Quick detail drawer SHALL NOT provide a canonical full-page action. The module SHALL NOT expose internal derivation status, event/calendar relationships, or other unsupported metadata.

#### Scenario: Latest News has articles
- **WHEN** the news request succeeds with one or more articles
- **THEN** the module renders no more than five article rows
- **AND** each row presents the article title and available description, source, and publication time
- **AND** each title is a keyboard-reachable localized button with an accessible article-open name
- **AND** each row renders its available feature image through `ItemMedia variant="image"`, or the newspaper icon when no usable image exists
- **AND** a pointer click, Enter, or Space on the title opens the shared News article quick-detail drawer without changing the dashboard URL
- **AND** the module header links to the localized `/news-articles` list route
- **AND** no row presents derivation status, event relationship, calendar metadata, or unsupported internal metadata

#### Scenario: User reads an article in Quick detail
- **WHEN** a user opens an article from a Latest News row
- **THEN** the drawer provides the focused News article reading body without a canonical full-page action
- **AND** the user can still reach the canonical article route through normal navigation outside the drawer

#### Scenario: An article omits optional display fields
- **WHEN** an article has no description, source name, or publication time
- **THEN** the module renders the corresponding localized fallback instead of blank or hardcoded text
