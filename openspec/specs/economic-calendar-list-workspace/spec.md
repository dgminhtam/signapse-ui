# economic-calendar-list-workspace Specification

## Purpose
TBD - created by archiving change redesign-economic-calendar-list. Update Purpose after archive.
## Requirements
### Requirement: Calendar-first grouped list
The economic calendar list page SHALL present entries in a calendar-first grouped layout using each entry's scheduled day as the primary grouping context.

#### Scenario: Entries render grouped by scheduled day
- **WHEN** the economic calendar list receives entries with scheduled timestamps
- **THEN** the page displays day group headers and renders the entries for each day beneath the matching header

#### Scenario: Entries remain scannable when scheduled day is missing
- **WHEN** an entry has no scheduled timestamp
- **THEN** the page displays the entry in a fallback group using localized unavailable copy

### Requirement: Event rows prioritize market calendar data
The economic calendar list rows SHALL prioritize scheduled time, currency, impact, event title, actual value, forecast value, previous value, and publication status before technical metadata.

#### Scenario: User scans an event row
- **WHEN** a user views an event row
- **THEN** the row exposes the event time, currency, impact, title, actual, forecast, previous, and localized `status` without requiring navigation to the detail page

#### Scenario: Technical metadata is secondary
- **WHEN** an event has identifiers, created timestamps, modified timestamps, or synced timestamps
- **THEN** those technical details are not presented as the dominant row content ahead of market calendar data

### Requirement: Focused list controls
The economic calendar list page SHALL keep existing search, sync, sort, page size, and pagination behaviors while avoiding controls for unsupported calendar data.

#### Scenario: Existing URL-backed controls are used
- **WHEN** a user searches, sorts, changes page size, or paginates the list
- **THEN** the page preserves the existing URL-backed list state behavior

#### Scenario: Unsupported filters are omitted
- **WHEN** the frontend contract does not provide category, country, week aggregate, or realtime countdown data
- **THEN** the list does not render category tabs, country flag controls, aggregate day cards, or countdown controls that imply those data sources exist

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

### Requirement: Contract-aligned minimal visual treatment
The economic calendar list page SHALL use existing Signapse shared list and shadcn wrapper patterns with minimal calendar-specific composition.

#### Scenario: Page renders the redesigned list
- **WHEN** the list page renders
- **THEN** it uses existing shared list/table/toolbar surfaces and localized dictionary copy instead of hardcoded labels or bespoke primitive imports

#### Scenario: Loading and empty states render
- **WHEN** the list is loading or empty
- **THEN** the skeleton and empty states mirror the grouped list layout closely enough to avoid major layout shift
