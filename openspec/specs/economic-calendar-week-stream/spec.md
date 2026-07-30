# economic-calendar-week-stream Specification

## Purpose
TBD - created by archiving change add-economic-calendar-week-stream. Update Purpose after archive.
## Requirements
### Requirement: UTC+7 week-window loading
The economic calendar list page SHALL load events for a selected UTC+7 week by deriving a `scheduledAt` range filter from URL state.

#### Scenario: Page loads without an explicit week
- **WHEN** a user opens the economic calendar list without a valid `week` query parameter
- **THEN** the page loads the current UTC+7 week

#### Scenario: Page loads a selected week
- **WHEN** the URL contains a valid `week=YYYY-MM-DD` query parameter
- **THEN** the page derives a filter from the UTC+7 start of that week through the exclusive start of the next week

#### Scenario: Scheduled range filter is sent
- **WHEN** the selected week starts on `2026-06-01`
- **THEN** the backend request includes a filter equivalent to `scheduledAt ge '2026-06-01T00:00:00+07:00' and scheduledAt lt '2026-06-08T00:00:00+07:00'`

### Requirement: Week stream replaces visible pagination
The economic calendar list page SHALL use a single large backend week-window request instead of visible pagination controls.

#### Scenario: Week stream request is built
- **WHEN** the page requests economic calendar entries for the selected week
- **THEN** it uses backend `page=0`, a large fixed `size`, and `sort=scheduledAt_asc` unless the user has selected another supported sort

#### Scenario: Pagination UI is absent
- **WHEN** the economic calendar list renders
- **THEN** the page does not render the standard pagination surface or page-size selector

### Requirement: Navigation-only week strip
The economic calendar list page SHALL render a compact week strip for navigating the selected UTC+7 week.

#### Scenario: Week strip renders
- **WHEN** the economic calendar list renders
- **THEN** the week strip shows Today, previous week, next week, the selected week range, and seven day chips

#### Scenario: Week strip avoids unsupported aggregates
- **WHEN** the week strip renders
- **THEN** it does not show daily counts, category counts, country flags, countdowns, or summary cards

#### Scenario: User changes selected week
- **WHEN** a user activates Today, previous week, or next week
- **THEN** the page updates the `week` query parameter and reloads the corresponding UTC+7 week window

### Requirement: Day chips navigate loaded day groups
The economic calendar list page SHALL use day chips to navigate within the already-loaded week stream.

#### Scenario: User selects a day chip
- **WHEN** a user activates a day chip for a day that exists in the loaded stream
- **THEN** the matching day group is scrolled or focused without changing the backend week filter

#### Scenario: User selects a day without events
- **WHEN** a user activates a day chip for a day with no events in the loaded stream
- **THEN** the page keeps the selected week context and does not imply that hidden events exist for that day

### Requirement: Current-time line
The economic calendar list page SHALL show a red current-time line in the event stream when the selected UTC+7 week contains the current time.

#### Scenario: Selected week contains now
- **WHEN** the selected UTC+7 week contains the current UTC+7 time
- **THEN** the event stream displays a red current-time line at the appropriate chronological position

#### Scenario: Selected week does not contain now
- **WHEN** the selected UTC+7 week is before or after the current UTC+7 week
- **THEN** the event stream does not display the current-time line

### Requirement: Adjacent-week controls
The economic calendar list page SHALL provide top and bottom controls for moving to the previous and next week.

#### Scenario: User loads earlier events
- **WHEN** a user activates the top previous-week control
- **THEN** the page changes the selected `week` to the previous UTC+7 week and reloads that week window

#### Scenario: User loads later events
- **WHEN** a user activates the bottom next-week control
- **THEN** the page changes the selected `week` to the next UTC+7 week and reloads that week window

### Requirement: Existing calendar list behavior is preserved
The week stream SHALL preserve existing economic calendar list behaviors that are not replaced by week-window navigation and remain supported by the backend contract.

#### Scenario: Search and sync remain available
- **WHEN** the week stream renders
- **THEN** search and sync controls remain available with localized labels and existing permission behavior

#### Scenario: Event rows remain detail-capable
- **WHEN** an event row renders in the week stream
- **THEN** grouped day rows, market-calendar row hierarchy, localized publication status, and canonical localized detail links remain available
- **AND** supporting-content expansion is not rendered
