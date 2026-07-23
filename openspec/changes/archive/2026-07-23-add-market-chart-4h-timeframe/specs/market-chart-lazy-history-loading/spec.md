## ADDED Requirements

### Requirement: Four-hour charts load older history
The system SHALL build older candle requests for timeframe `4h` using a four-hour interval and a 14-day lookback window.

#### Scenario: User reaches the oldest four-hour candles
- **WHEN** lazy history is triggered for an active `4h` chart
- **THEN** the older request retains timeframe `4h`
- **AND** its `to` boundary is one four-hour interval before the oldest loaded candle
- **AND** its `from` boundary is 14 days before that `to` boundary

#### Scenario: Four-hour older candles are returned
- **WHEN** an older `4h` request succeeds
- **THEN** valid new candles are merged in chronological order
- **AND** existing de-duplication and exhaustion behavior remains in effect
