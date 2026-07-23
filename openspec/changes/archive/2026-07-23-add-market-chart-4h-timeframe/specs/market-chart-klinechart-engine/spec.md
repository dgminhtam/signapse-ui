## ADDED Requirements

### Requirement: KLineCharts renders four-hour market periods
The system SHALL map market-chart timeframe `4h` to the stable KLineCharts hour period with span `4`.

#### Scenario: Four-hour chart data is applied
- **WHEN** the active market chart timeframe is `4h`
- **THEN** KLineCharts receives period type `hour` and span `4`
- **AND** the existing mounted chart instance is used

#### Scenario: User switches to or from four-hour timeframe
- **WHEN** the user changes between `4h` and another supported timeframe
- **THEN** the chart loads data for the selected timeframe
- **AND** the existing timeframe-change lifecycle remains in effect
