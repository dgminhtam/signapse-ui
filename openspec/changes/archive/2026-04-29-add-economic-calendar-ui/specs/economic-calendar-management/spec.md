## ADDED Requirements

### Requirement: Economic calendar list page
The system SHALL provide an authenticated `/economic-calendar` page that lists economic calendar entries from the backend API.

#### Scenario: Authorized user views the list
- **WHEN** a user with economic calendar read permission opens `/economic-calendar`
- **THEN** the system MUST render a Card-based list page with title, description, toolbar, table, pagination, and economic calendar entries from `GET /economic-calendar`

#### Scenario: Unauthorized user views the list
- **WHEN** a user without economic calendar read permission opens `/economic-calendar`
- **THEN** the system MUST render an access denied state before loading protected economic calendar data

#### Scenario: List is empty
- **WHEN** the backend returns an empty economic calendar page
- **THEN** the system MUST render an `<Empty>` state inside the shared list table surface

### Requirement: Economic calendar list controls
The system SHALL allow users to search, sort, and paginate economic calendar entries using URL-backed list state.

#### Scenario: User searches economic calendar entries
- **WHEN** the user types in the economic calendar search input
- **THEN** the system MUST debounce input by 300ms, trim the query, reset `page` to `1`, and write the search filter to the URL

#### Scenario: User changes sort
- **WHEN** the user selects a sort option
- **THEN** the system MUST update the URL sort parameter and fetch the list with the mapped backend sort query

#### Scenario: User changes page size
- **WHEN** the user changes page size
- **THEN** the system MUST update the URL page size and keep pagination consistent with the shared pagination controls

### Requirement: Economic calendar synchronization
The system SHALL allow authorized users to trigger backend economic calendar synchronization.

#### Scenario: Authorized user syncs economic calendar entries
- **WHEN** a user with economic calendar sync permission clicks the sync button
- **THEN** the system MUST call `POST /economic-calendar/sync`, show pending feedback, disable the button while pending, show a Vietnamese toast summary, and refresh the current route

#### Scenario: Unauthorized user cannot sync
- **WHEN** a user without economic calendar sync permission views the list page
- **THEN** the system MUST NOT render the sync action

#### Scenario: Sync fails
- **WHEN** `POST /economic-calendar/sync` returns an error
- **THEN** the system MUST show a Vietnamese error toast and keep the user on the current page

### Requirement: Economic calendar detail page
The system SHALL provide an authenticated `/economic-calendar/{id}` page for inspecting a single economic calendar entry.

#### Scenario: Authorized user views detail
- **WHEN** a user with economic calendar read permission opens `/economic-calendar/{id}`
- **THEN** the system MUST fetch `GET /economic-calendar/{id}` and render title, country, provider, importance, scheduled time, actual value, forecast value, previous value, description, raw content, and original link when available

#### Scenario: Detail technical metadata is secondary
- **WHEN** detail data includes technical fields such as `externalKey`, `rawMetadata`, `ingestedAt`, `createdDate`, or `lastModifiedDate`
- **THEN** the system MUST place those fields in a lower-priority technical information section rather than the primary reading path

#### Scenario: Detail entry is not found
- **WHEN** `GET /economic-calendar/{id}` returns a not found error
- **THEN** the system MUST render the standard not found behavior instead of a broken detail page

### Requirement: Economic calendar navigation and documentation
The system SHALL expose the economic calendar feature consistently in navigation and API documentation.

#### Scenario: Navigation is available
- **WHEN** a user has economic calendar read permission
- **THEN** the left navigation MUST show `Lịch kinh tế` under the `Nội dung` group and link to `/economic-calendar`

#### Scenario: API mapping is updated
- **WHEN** the feature is implemented
- **THEN** `docs/APIMAPPING.md` MUST mark the economic calendar endpoints as implemented and list the new frontend files

### Requirement: Economic calendar UI language
The system SHALL use professional Vietnamese copy for all user-facing economic calendar UI.

#### Scenario: User views economic calendar surfaces
- **WHEN** the list, detail, empty, loading, access denied, sync, toast, or error states render
- **THEN** all user-facing labels, placeholders, descriptions, and messages MUST be Vietnamese with proper diacritics
