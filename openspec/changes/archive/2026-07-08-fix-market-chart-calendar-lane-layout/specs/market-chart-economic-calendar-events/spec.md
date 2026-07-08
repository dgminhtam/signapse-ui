## ADDED Requirements

### Requirement: Calendar event lane avoids chart overlap
The system SHALL render the economic calendar event lane outside the active KLineCharts canvas area so it does not cover candles, indicators, or the volume pane.

#### Scenario: Calendar lane renders below chart canvas
- **WHEN** the Calendar layer is enabled and economic calendar events are available
- **THEN** the chart canvas area is resized to leave dedicated space for the calendar lane
- **AND** the calendar lane renders in that dedicated space below the chart canvas
- **AND** candles, indicators, and the volume pane remain unobstructed by the lane

#### Scenario: Calendar lane keeps chart x-axis alignment
- **WHEN** a calendar event maps to a visible chart time
- **THEN** its lane marker is horizontally aligned with the chart x-coordinate for that event time
- **AND** visual lane padding does not shift marker placement away from the chart coordinate system

#### Scenario: Calendar hover guide stays in chart area
- **WHEN** a user hovers or focuses a calendar lane marker
- **THEN** the red vertical guide line aligns with the marker x-coordinate
- **AND** the guide line does not render through the calendar lane itself

### Requirement: Calendar grouped marker count appears inside node
The system SHALL render grouped economic calendar event counts inside the calendar marker node instead of as a separate floating badge.

#### Scenario: Single calendar event marker
- **WHEN** one economic calendar event maps to a lane marker position
- **THEN** the system renders a compact calendar marker without a separate count badge

#### Scenario: Multiple calendar events marker
- **WHEN** multiple economic calendar events map to the same lane marker position
- **THEN** the system renders the grouped event count inside the marker node
- **AND** the system does not render a separate floating count badge outside the marker node
