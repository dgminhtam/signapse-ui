## MODIFIED Requirements

### Requirement: Impact signal colors
The economic calendar list, economic calendar detail page, and Market Charts economic calendar quick lists SHALL render available impact badges with the same approved visual treatments.

#### Scenario: High impact event renders
- **WHEN** an event has high impact on any affected surface
- **THEN** its impact badge uses the approved red categorical Badge palette

#### Scenario: Medium impact event renders
- **WHEN** an event has medium impact on any affected surface
- **THEN** its impact badge uses the approved purple categorical Badge palette

#### Scenario: Low impact event renders
- **WHEN** an event has low impact on any affected surface
- **THEN** its impact badge uses the approved sky categorical Badge palette

#### Scenario: Unknown impact event renders
- **WHEN** an event has an unknown impact value on any affected surface
- **THEN** its impact badge uses the neutral outline treatment

#### Scenario: Missing impact renders on economic calendar surfaces
- **WHEN** an event has missing impact on the economic calendar list or detail page
- **THEN** its impact badge uses the neutral outline treatment

#### Scenario: Missing impact renders in a chart quick list
- **WHEN** an event has no impact value in a Market Charts economic calendar quick list
- **THEN** the quick list omits the optional impact badge

### Requirement: Localized uppercase impact labels
The economic calendar list, economic calendar detail page, and Market Charts economic calendar quick lists SHALL map recognized impact values to localized uppercase labels and SHALL NOT display recognized raw backend impact text directly.

#### Scenario: Recognized impact renders in Vietnamese
- **WHEN** the active locale is Vietnamese and an event impact is high, medium, or low regardless of source casing
- **THEN** its label is rendered as the corresponding uppercase Vietnamese translation

#### Scenario: Recognized impact renders in English
- **WHEN** the active locale is English and an event impact is high, medium, or low regardless of source casing
- **THEN** its label is rendered as the corresponding uppercase English translation

#### Scenario: Missing impact renders on economic calendar surfaces
- **WHEN** an event impact is empty or missing on the economic calendar list or detail page
- **THEN** its badge uses the localized uppercase no-impact label

#### Scenario: Unknown impact renders
- **WHEN** an event impact is present but does not match high, medium, or low
- **THEN** its badge uses the localized uppercase unknown-impact label instead of raw backend text

#### Scenario: Detail impact renders without a prefix
- **WHEN** the economic calendar detail page renders an impact badge
- **THEN** the badge content matches the canonical localized label without an additional impact prefix
