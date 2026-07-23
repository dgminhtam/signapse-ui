## MODIFIED Requirements

### Requirement: Calendar marker styling and legend
The system SHALL distinguish calendar markers from existing event annotation markers with compact styling and legend text, while calendar quick lists SHALL use the canonical economic calendar impact badges.

#### Scenario: Calendar legend point
- **WHEN** the Calendar layer is enabled and calendar events are available
- **THEN** the workbench displays a legend point labeled `Economic calendar` in English and `Lịch kinh tế` in Vietnamese
- **AND** the legend point uses a calendar-specific color distinct from bullish, bearish, neutral, and mixed annotation colors

#### Scenario: Impact styling
- **WHEN** a calendar quick-list event includes an `impact` value
- **THEN** the quick list renders the impact as the canonical localized uppercase economic calendar Badge
- **AND** recognized high, medium, and low values use the approved red, purple, and sky treatments respectively
- **AND** unrecognized values use the neutral outline treatment
- **AND** the system does not translate raw `actualBetterWorse` or `revisionBetterWorse` values

#### Scenario: Calendar marker impact behavior remains stable
- **WHEN** a calendar event includes an `impact` value
- **THEN** existing marker grouping, priority, and calendar-specific marker color behavior remain unchanged

#### Scenario: Calendar layer disabled hides legend
- **WHEN** the Calendar layer is disabled
- **THEN** the workbench does not show calendar marker legend copy

#### Scenario: Single calendar event marker
- **WHEN** one economic calendar event maps to a lane marker position
- **THEN** the system renders a compact calendar marker without a separate count badge

#### Scenario: Multiple calendar events marker
- **WHEN** multiple economic calendar events map to the same lane marker position
- **THEN** the system renders the grouped event count inside the marker node
- **AND** the system does not render a separate floating count badge outside the marker node

### Requirement: Calendar quick list and detail navigation
The system SHALL provide an accessible quick list for loaded calendar events and route users to the existing economic calendar detail page for full content.

#### Scenario: Show quick list fields
- **WHEN** a user opens a calendar marker or grouped calendar marker
- **THEN** the quick list displays available `time`, title, currency code, type, forecast value, previous value, actual value, revision, better/worse fields, description, status, and content availability without placeholder copy for missing optional fields
- **AND** an available impact value is displayed as the canonical localized Badge rather than raw generic metadata

#### Scenario: Missing quick-list impact
- **WHEN** a calendar quick-list event has no impact value
- **THEN** the quick list does not render an impact placeholder or no-impact badge

#### Scenario: Open full calendar detail
- **WHEN** a user activates a calendar event detail action
- **THEN** the system navigates to the locale-preserving `/economic-calendar/{id}` detail route
- **AND** it relies on the existing `GET /economic-calendar/{id}` detail endpoint for content

#### Scenario: Keyboard calendar review
- **WHEN** calendar events are loaded
- **THEN** users can focus calendar lane markers or quick list entries by keyboard
- **AND** they can open the event detail action without requiring pointer-only chart interaction
