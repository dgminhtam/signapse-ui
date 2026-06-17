# economic-calendar-selected-day-stream Specification

## Purpose
TBD - created by archiving change scope-economic-calendar-to-selected-day. Update Purpose after archive.
## Requirements
### Requirement: Selected day URL state
The economic calendar list SHALL use `date=YYYY-MM-DD` as the primary URL state for the selected UTC+7 day.

#### Scenario: URL contains a valid date
- **WHEN** the economic calendar list is opened with `date=2026-06-03`
- **THEN** the selected day is `2026-06-03` in UTC+7 calendar semantics

#### Scenario: URL has no date
- **WHEN** the economic calendar list is opened without a `date` query parameter
- **THEN** the selected day defaults to the current UTC+7 date

#### Scenario: URL contains an invalid date
- **WHEN** the economic calendar list is opened with an invalid `date` query parameter
- **THEN** the selected day defaults to the current UTC+7 date

### Requirement: Selected day backend filter
The economic calendar list SHALL fetch only events inside the selected UTC+7 day boundary.

#### Scenario: Selected date is fetched
- **WHEN** the selected day is `2026-06-03`
- **THEN** the backend request includes a scheduledAt filter equivalent to `scheduledAt ge '2026-06-03T00:00:00+07:00' and scheduledAt lt '2026-06-04T00:00:00+07:00'`

#### Scenario: Search filters are present
- **WHEN** search or other supported list filters are present
- **THEN** the selected-day scheduledAt filter is combined with the search filters

### Requirement: No visible pagination
The economic calendar selected-day stream SHALL load the selected day with a large enough backend page size and MUST NOT render visible pagination controls.

#### Scenario: Selected day loads
- **WHEN** the economic calendar list requests selected-day data
- **THEN** the backend request uses `page=0` and a large day-window size

#### Scenario: Stream renders
- **WHEN** the selected-day stream renders
- **THEN** no page-number or page-size pagination controls are visible

### Requirement: Week strip day navigation
The economic calendar week strip SHALL navigate selected days instead of scrolling to day anchors.

#### Scenario: User clicks a day chip
- **WHEN** the user selects a day chip in the week strip
- **THEN** the URL `date` query parameter changes to that chip's UTC+7 date

#### Scenario: User clicks today
- **WHEN** the user clicks the Today control
- **THEN** the URL `date` query parameter changes to the current UTC+7 date

#### Scenario: Selected date is active
- **WHEN** a week strip day chip matches the selected UTC+7 date
- **THEN** that chip renders as the active selected day

### Requirement: Selected day table content
The economic calendar list SHALL render only the selected day shell and that day's time, currency/region, and event rows.

#### Scenario: Selected day has events
- **WHEN** the selected day has economic calendar events
- **THEN** the table renders one compact day separator followed by merged time/currency event rows for that day

#### Scenario: Selected day has no events
- **WHEN** the selected day has no economic calendar events
- **THEN** the table renders one compact selected-day separator and localized empty-day content

### Requirement: Day-specific current-time line
The economic calendar list SHALL render the red current-time line only when the selected UTC+7 day is today.

#### Scenario: Selected day is today
- **WHEN** the selected day is the current UTC+7 date
- **THEN** the current-time line renders at the appropriate position inside the selected-day table flow

#### Scenario: Selected day is not today
- **WHEN** the selected day is not the current UTC+7 date
- **THEN** the current-time line does not render

### Requirement: Adjacent day navigation
The economic calendar selected-day stream SHALL provide adjacent-day navigation if body-level load controls remain visible.

#### Scenario: Previous control is visible
- **WHEN** the body-level previous control is rendered
- **THEN** it navigates to the previous UTC+7 day, not the previous week

#### Scenario: Next control is visible
- **WHEN** the body-level next control is rendered
- **THEN** it navigates to the next UTC+7 day, not the next week

