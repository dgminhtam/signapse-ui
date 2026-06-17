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
The economic calendar list rows SHALL prioritize scheduled time, currency, impact, event title, actual value, forecast value, previous value, and availability status before technical metadata.

#### Scenario: User scans an event row
- **WHEN** a user views an event row
- **THEN** the row exposes the event time, currency, impact, title, actual, forecast, previous, and status without requiring navigation to the detail page

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

### Requirement: Expandable event support content
The economic calendar list page SHALL provide a local row expansion affordance for available supporting event content while preserving canonical detail navigation.

#### Scenario: User expands an event with supporting content
- **WHEN** a user expands an event that has supporting content available
- **THEN** the row reveals concise supporting content and an action to open the canonical localized detail page

#### Scenario: User views an event without supporting content
- **WHEN** an event has no supporting content available
- **THEN** the row does not present a misleading expansion affordance for unavailable content

### Requirement: Contract-aligned minimal visual treatment
The economic calendar list page SHALL use existing Signapse shared list and shadcn wrapper patterns with minimal calendar-specific composition.

#### Scenario: Page renders the redesigned list
- **WHEN** the list page renders
- **THEN** it uses existing shared list/table/toolbar surfaces and localized dictionary copy instead of hardcoded labels or bespoke primitive imports

#### Scenario: Loading and empty states render
- **WHEN** the list is loading or empty
- **THEN** the skeleton and empty states mirror the grouped list layout closely enough to avoid major layout shift

