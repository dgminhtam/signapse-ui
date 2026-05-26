## MODIFIED Requirements

### Requirement: Chart data mapping stays engine-neutral outside the canvas
The system SHALL keep KLineChart-specific data records and types inside the market chart canvas adapter boundary.

#### Scenario: Domain helpers do not expose chart vendor types
- **WHEN** annotation grouping or market chart DTO helpers are imported outside the chart canvas
- **THEN** they expose plain domain types rather than KLineChart or Lightweight Charts types

#### Scenario: Candle timestamps are converted at the adapter boundary
- **WHEN** backend candle `time` values are passed to the chart canvas
- **THEN** the canvas adapter converts them to KLineChart millisecond timestamps before applying data to the chart

#### Scenario: Invalid candle items are ignored before timestamp conversion
- **WHEN** the chart canvas receives a candle collection containing a null, undefined, malformed, or invalid-time candle item
- **THEN** the canvas adapter omits that item before reading candle `time`
- **AND** valid candles continue to render in chronological order
- **AND** the market chart does not crash with a runtime `.time` read error
