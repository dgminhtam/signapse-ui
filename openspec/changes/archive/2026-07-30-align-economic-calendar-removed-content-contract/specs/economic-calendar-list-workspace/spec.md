## ADDED Requirements

### Requirement: Canonical event detail navigation
The economic calendar list SHALL keep canonical localized detail navigation available for every event without gating navigation or local UI on detailed-content availability.

#### Scenario: User opens an event from the list
- **WHEN** an economic calendar event row renders
- **THEN** its title link and detail action navigate to the localized `/economic-calendar/{id}` route
- **AND** the row does not render a supporting-content expansion control or support row

#### Scenario: Detail response follows the simplified contract
- **WHEN** a user opens an economic calendar detail route
- **THEN** the page renders available description, publication status, release values, timestamps and technical metadata
- **AND** the page does not expect `content`, `contentAvailable` or a detailed-content empty state

## MODIFIED Requirements

### Requirement: Event rows prioritize market calendar data
The economic calendar list rows SHALL prioritize scheduled time, currency, impact, event title, actual value, forecast value, previous value, and publication status before technical metadata.

#### Scenario: User scans an event row
- **WHEN** a user views an event row
- **THEN** the row exposes the event time, currency, impact, title, actual, forecast, previous, and localized `status` without requiring navigation to the detail page

#### Scenario: Technical metadata is secondary
- **WHEN** an event has identifiers, created timestamps, modified timestamps, or synced timestamps
- **THEN** those technical details are not presented as the dominant row content ahead of market calendar data

## REMOVED Requirements

### Requirement: Expandable event support content
**Reason**: Backend responses no longer expose `contentAvailable` or detail `content`, so the frontend cannot truthfully gate or populate supporting-content expansion.

**Migration**: Remove expansion state, controls, support rows and expansion-specific copy; retain canonical detail links and display publication state from `status`.
