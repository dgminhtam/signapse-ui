## ADDED Requirements

### Requirement: Nested time and currency-region grouping
The economic calendar week stream SHALL group events by UTC+7 day, UTC+7 scheduled time, and currency/region before rendering event rows.

#### Scenario: Events share a release time
- **WHEN** multiple events in the selected week have the same UTC+7 scheduled day and time
- **THEN** the events render under the same time group for that day

#### Scenario: Events share a currency in a time group
- **WHEN** multiple events in the same time group have the same `currencyCode`
- **THEN** the events render under the same currency/region group

#### Scenario: Currency is missing
- **WHEN** an event has no `currencyCode`
- **THEN** the event renders under a localized unavailable currency/region fallback group

### Requirement: Contract-honest region presentation
The economic calendar week stream SHALL use `currencyCode` as the current currency/region grouping key and MUST NOT infer country names or flags from currency.

#### Scenario: Currency code is present
- **WHEN** an event has `currencyCode=USD`
- **THEN** the group label uses `USD` or localized currency/region copy based on `USD`, without claiming a country name that the backend did not return

#### Scenario: Unsupported country UI is avoided
- **WHEN** the stream renders currency/region groups
- **THEN** it does not render country flags, inferred country names, or country-specific controls

### Requirement: Complete week day shells
The economic calendar week stream SHALL provide a day shell for each of the seven selected UTC+7 week days.

#### Scenario: Day has events
- **WHEN** a selected week day has events
- **THEN** the day shell contains the matching time and currency/region groups

#### Scenario: Day has no events
- **WHEN** a selected week day has no events
- **THEN** the day remains available as a navigation target and may render a compact localized empty-day treatment

### Requirement: Robust current-time line
The economic calendar week stream SHALL render the current-time line whenever the selected UTC+7 week contains the current UTC+7 time.

#### Scenario: Today has surrounding events
- **WHEN** today has events before or after the current UTC+7 time
- **THEN** the current-time line renders at the appropriate chronological position among time groups

#### Scenario: Today has no events
- **WHEN** the selected UTC+7 week contains today but today's day shell has no events
- **THEN** the current-time line still renders inside today's day shell

#### Scenario: Selected week is not current
- **WHEN** the selected UTC+7 week does not contain the current UTC+7 date
- **THEN** the current-time line does not render

### Requirement: Scheduled-time sort normalization
The economic calendar week stream SHALL normalize unsupported or stale sort values to scheduled-time sorting.

#### Scenario: URL contains stale sort
- **WHEN** the URL contains a sort value other than `scheduledAt_asc` or `scheduledAt_desc`
- **THEN** the week stream uses `scheduledAt_asc` for backend requests and render ordering

#### Scenario: URL contains supported scheduled sort
- **WHEN** the URL contains `scheduledAt_asc` or `scheduledAt_desc`
- **THEN** the week stream uses the requested scheduled-time sort

### Requirement: Existing stream behavior remains available
The time-grouped stream SHALL preserve the existing week-strip and event-row capabilities from the current economic calendar week stream.

#### Scenario: Week controls render
- **WHEN** the time-grouped stream renders
- **THEN** Today, previous week, next week, day chips, top/bottom adjacent-week controls, search, and sync remain available

#### Scenario: Event row actions render
- **WHEN** event rows render inside currency/region groups
- **THEN** expandable support content and canonical localized detail links remain available
