## ADDED Requirements

### Requirement: Debounced URL-driven list search on in-scope canon pages
The system SHALL treat list search on the in-scope canon pages as live debounced search, and it MUST update URL query state without requiring an explicit search button submission.

#### Scenario: Apply search term after debounce
- **WHEN** a user types into list search on `ai-provider-configs`, `blogs`, `cronjobs`, or `events`
- **THEN** the system updates the configured search query parameter after a `300ms` debounce
- **AND** resets the `page` query parameter to `1`
- **AND** preserves unrelated query parameters

#### Scenario: Clear search term
- **WHEN** the user clears the search input or leaves only whitespace
- **THEN** the system removes the corresponding search query parameter from the URL
- **AND** keeps the interaction as live search without requiring a separate submit button

### Requirement: Search input state reflects current query state
The system SHALL keep each in-scope list search input synchronized with the current URL query state so that the visible input value matches the active search filter.

#### Scenario: Load page from deep link
- **WHEN** a user opens an in-scope list page with an existing search query parameter in the URL
- **THEN** the search input shows the same active search value

#### Scenario: Query state changes after initial render
- **WHEN** the active search query parameter changes because of navigation such as browser back, browser forward, or another route update
- **THEN** the search input updates to reflect the current query state
- **AND** does not remain stuck on a stale initial value

### Requirement: Consistent pending feedback and accessibility for list search
The system SHALL provide consistent pending feedback and accessible search semantics for each in-scope list search field.

#### Scenario: Render accessible search field
- **WHEN** an in-scope list search field is rendered
- **THEN** it exposes a search input with `type="search"`
- **AND** it includes an accessible label suitable for screen readers

#### Scenario: Show pending search feedback
- **WHEN** a debounced search route transition is pending
- **THEN** the search field shows an inline loading indicator in the toolbar
- **AND** the pending state reflects the active route transition rather than an unrelated local timer state

### Requirement: Search copy is consistent with repo language rules
The system SHALL present user-facing copy within each in-scope list search field using professional, consistent Vietnamese.

#### Scenario: Render placeholder and accessible label
- **WHEN** an in-scope list search field renders placeholder text or accessible label text
- **THEN** that copy is written in Vietnamese that matches the repo language rules
