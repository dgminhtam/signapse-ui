## MODIFIED Requirements

### Requirement: Latest News presents article information without internal metadata

The Latest News module SHALL render each returned article using its title, description, source name, and publication time when available. Missing optional values SHALL use localized fallbacks. The module SHALL provide a localized header action to the existing `/news-articles` route. Each article row SHALL be a button-backed shadcn `Item asChild` that opens the shared dashboard news-article quick-detail drawer on pointer or keyboard activation. Rows SHALL NOT expose a per-row canonical `/news-articles/{id}` `href`; the drawer SHALL provide the explicit full-page action. The module SHALL NOT expose internal derivation status, event/calendar relationships, or other unsupported metadata.

#### Scenario: Latest News has articles

- **WHEN** the news request succeeds with one or more articles
- **THEN** the module renders no more than five article rows
- **AND** each row presents the article title and available description, source, and publication time
- **AND** each row is a keyboard-reachable localized button-backed `Item asChild` with an accessible article-open name
- **AND** a pointer click, Enter, or Space opens the shared news-article quick-detail drawer without changing the dashboard URL
- **AND** the module header links to the localized `/news-articles` list route
- **AND** no row presents derivation status, event relationship, calendar metadata, or unsupported internal metadata

#### Scenario: User opens the canonical article page

- **WHEN** a user activates the drawer's full-page action on an article row
- **THEN** the application navigates to the current-locale `/news-articles/{id}` route

#### Scenario: An article omits optional display fields

- **WHEN** an article has no description, source name, or publication time
- **THEN** the module renders the corresponding localized fallback instead of blank or hardcoded text

