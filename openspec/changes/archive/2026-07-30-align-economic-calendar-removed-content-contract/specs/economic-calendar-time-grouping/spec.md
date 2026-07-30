## MODIFIED Requirements

### Requirement: Existing stream behavior remains available
The time-grouped stream SHALL preserve the existing week-strip and event-row capabilities from the current economic calendar week stream that remain supported by the backend contract.

#### Scenario: Week controls render
- **WHEN** the time-grouped stream renders
- **THEN** Today, previous week, next week, day chips, top/bottom adjacent-week controls, search, and sync remain available

#### Scenario: Event row actions render
- **WHEN** event rows render inside currency/region groups
- **THEN** canonical localized detail links and localized publication status remain available
- **AND** the rows do not expose supporting-content expansion
