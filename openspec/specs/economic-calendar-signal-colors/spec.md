# economic-calendar-signal-colors Specification

## Purpose
TBD - created by archiving change scope-economic-calendar-to-selected-day. Update Purpose after archive.
## Requirements
### Requirement: Impact signal colors
The economic calendar list SHALL render impact badges with distinct approved visual treatments that help users scan event importance.

#### Scenario: High impact event renders
- **WHEN** an event has high impact
- **THEN** its impact badge uses the approved red categorical Badge palette

#### Scenario: Medium impact event renders
- **WHEN** an event has medium impact
- **THEN** its impact badge uses the approved purple categorical Badge palette

#### Scenario: Low impact event renders
- **WHEN** an event has low impact
- **THEN** its impact badge uses the approved sky categorical Badge palette

#### Scenario: Unknown impact event renders
- **WHEN** an event has missing or unknown impact
- **THEN** its impact badge uses the neutral outline treatment

### Requirement: Localized uppercase impact labels
The economic calendar SHALL map recognized impact values to localized uppercase labels and SHALL NOT display recognized raw backend impact text directly.

#### Scenario: Recognized impact renders in Vietnamese
- **WHEN** the active locale is Vietnamese and an event impact is high, medium, or low regardless of source casing
- **THEN** its label is rendered as the corresponding uppercase Vietnamese translation

#### Scenario: Recognized impact renders in English
- **WHEN** the active locale is English and an event impact is high, medium, or low regardless of source casing
- **THEN** its label is rendered as the corresponding uppercase English translation

#### Scenario: Missing impact renders
- **WHEN** an event impact is empty or missing
- **THEN** its badge uses the localized uppercase no-impact label

#### Scenario: Unknown impact renders
- **WHEN** an event impact is present but does not match high, medium, or low
- **THEN** its badge uses the localized uppercase unknown-impact label instead of raw backend text

### Requirement: Numeric value colors
The economic calendar list SHALL render actual, forecast, and previous numeric values with restrained text-level signal colors.

#### Scenario: Positive numeric value renders
- **WHEN** an actual, forecast, or previous value parses as a positive number
- **THEN** the value text uses a positive signal treatment

#### Scenario: Negative numeric value renders
- **WHEN** an actual, forecast, or previous value parses as a negative number
- **THEN** the value text uses a negative signal treatment

#### Scenario: Missing numeric value renders
- **WHEN** an actual, forecast, or previous value is missing, `N/A`, or cannot be parsed as a number
- **THEN** the value text uses a muted or neutral treatment

### Requirement: Theme-safe color usage
The economic calendar signal color treatment SHALL remain compatible with the app theme and shadcn composition policy.

#### Scenario: Signal colors are implemented
- **WHEN** impact or numeric value signal colors are added
- **THEN** the implementation uses existing variants, semantic tokens, or the exact repository-approved Badge palettes instead of broad global theme token changes

#### Scenario: Dense table renders
- **WHEN** the selected-day table renders with signal colors
- **THEN** colors do not obscure event titles, merged time/currency cells, row actions, or current-time line visibility

### Requirement: Contract-safe color mapping
The economic calendar signal color treatment SHALL use only existing economic calendar row data and MUST NOT infer unsupported country or event category information.

#### Scenario: Currency row renders with signal colors
- **WHEN** an event row renders signal colors
- **THEN** the row does not infer country names, country flags, or unsupported categories from currencyCode or title text
