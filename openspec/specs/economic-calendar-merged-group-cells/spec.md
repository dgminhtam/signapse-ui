# economic-calendar-merged-group-cells Specification

## Purpose
TBD - created by archiving change refine-economic-calendar-merged-group-cells. Update Purpose after archive.
## Requirements
### Requirement: Merged time cells
The economic calendar week stream SHALL render each UTC+7 time bucket as a single visual cell in the `Time` column spanning the event rows in that time bucket.

#### Scenario: Multiple events share a time
- **WHEN** multiple events share the same selected UTC+7 day and scheduled time
- **THEN** the `Time` column renders one merged visual time cell for those events instead of a separate time header row

#### Scenario: Time bucket has one event
- **WHEN** a UTC+7 time bucket contains one event
- **THEN** the `Time` column renders the time value in that event row without adding a standalone time group row

### Requirement: Merged currency-region cells
The economic calendar week stream SHALL render each currency/region bucket as a single visual cell in the `Currency` column spanning the event rows in that currency/region bucket.

#### Scenario: Multiple events share a currency in a time bucket
- **WHEN** multiple events in the same UTC+7 time bucket share the same `currencyCode`
- **THEN** the `Currency` column renders one merged visual currency/region cell for those events instead of a separate currency/region header row

#### Scenario: Currency is unavailable
- **WHEN** an event has no `currencyCode`
- **THEN** the merged currency/region cell uses localized unavailable fallback copy

### Requirement: Day separators remain full width
The economic calendar week stream SHALL keep selected UTC+7 day shells as compact full-width table separators and stable week-strip navigation targets.

#### Scenario: Day has events
- **WHEN** a selected UTC+7 day has events
- **THEN** the day separator renders before that day's merged-cell event rows

#### Scenario: Day has no events
- **WHEN** a selected UTC+7 day has no events
- **THEN** the day remains available as a week-strip navigation target and renders compact empty-day content

### Requirement: Current-time line remains available
The economic calendar week stream SHALL preserve the red current-time line inside today's UTC+7 day shell while using merged time and currency/region cells.

#### Scenario: Current time falls before a rendered time bucket
- **WHEN** today's day shell contains a time bucket at or after the current UTC+7 time in ascending sort
- **THEN** the current-time line renders before that time bucket without breaking merged cell alignment

#### Scenario: Current day has no events
- **WHEN** today's day shell has no events
- **THEN** the current-time line renders inside today's day shell before the compact empty-day content

#### Scenario: Selected week is not current
- **WHEN** the selected UTC+7 week does not contain the current UTC+7 date
- **THEN** the current-time line does not render

### Requirement: Contract-honest merged cells
The merged-cell presentation SHALL use `currencyCode` as the currency/region source and MUST NOT infer country names or render country flags.

#### Scenario: Currency code is present
- **WHEN** an event has `currencyCode=SGD`
- **THEN** the merged currency/region cell displays `SGD` without claiming a country name that the backend did not return

#### Scenario: Unsupported country UI is avoided
- **WHEN** merged time and currency/region cells render
- **THEN** the stream does not render flags, inferred country names, or country-specific controls
