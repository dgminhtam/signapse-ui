## ADDED Requirements

### Requirement: Impact signal colors
The economic calendar list SHALL render impact badges with distinct visual treatments that help users scan event importance.

#### Scenario: High impact event renders
- **WHEN** an event has high impact
- **THEN** its impact badge uses the strongest danger or warm signal treatment among impact levels

#### Scenario: Medium impact event renders
- **WHEN** an event has medium impact
- **THEN** its impact badge uses a warning signal treatment distinct from high and low impact

#### Scenario: Low impact event renders
- **WHEN** an event has low impact
- **THEN** its impact badge uses a subtle cool or secondary signal treatment distinct from medium and high impact

#### Scenario: Unknown impact event renders
- **WHEN** an event has missing or unknown impact
- **THEN** its impact badge uses a neutral treatment

### Requirement: Status signal colors
The economic calendar list SHALL render status badges with distinct visual treatments that communicate availability.

#### Scenario: Available status renders
- **WHEN** an event's content/status is available
- **THEN** its status badge uses a positive or success signal treatment

#### Scenario: Pending status renders
- **WHEN** an event's content/status is pending
- **THEN** its status badge uses a warning signal treatment

#### Scenario: Unknown status renders
- **WHEN** an event's content/status is unknown or unavailable
- **THEN** its status badge uses a neutral treatment

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
- **WHEN** impact, status, or numeric value signal colors are added
- **THEN** the implementation uses existing variants, semantic tokens, or narrowly scoped feature-local styling instead of broad global theme token changes

#### Scenario: Dense table renders
- **WHEN** the selected-day table renders with signal colors
- **THEN** colors do not obscure event titles, merged time/currency cells, row actions, or current-time line visibility

### Requirement: Contract-safe color mapping
The economic calendar signal color treatment SHALL use only existing economic calendar row data and MUST NOT infer unsupported country or event category information.

#### Scenario: Currency row renders with signal colors
- **WHEN** an event row renders signal colors
- **THEN** the row does not infer country names, country flags, or unsupported categories from currencyCode or title text
