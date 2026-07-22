## ADDED Requirements

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

## MODIFIED Requirements

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

### Requirement: Theme-safe color usage

The economic calendar signal color treatment SHALL remain compatible with the app theme and shadcn composition policy.

#### Scenario: Signal colors are implemented

- **WHEN** impact or numeric value signal colors are added
- **THEN** the implementation uses existing variants, semantic tokens, or the exact repository-approved Badge palettes instead of broad global theme token changes

#### Scenario: Dense table renders

- **WHEN** the selected-day table renders with signal colors
- **THEN** colors do not obscure event titles, merged time/currency cells, row actions, or current-time line visibility

## REMOVED Requirements

### Requirement: Status signal colors

**Reason**: The economic calendar list no longer displays a status column, so list-specific status badge colors are obsolete.

**Migration**: Remove the list status header and row badge while retaining status data and detail-page presentation.
