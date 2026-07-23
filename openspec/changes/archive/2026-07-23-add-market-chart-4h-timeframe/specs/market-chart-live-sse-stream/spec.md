## ADDED Requirements

### Requirement: Four-hour live quotes use four-hour buckets
The system SHALL evaluate quote-only candle updates for timeframe `4h` against fixed four-hour bucket boundaries.

#### Scenario: Quote belongs to the latest four-hour bucket
- **WHEN** a live quote and the latest REST candle belong to the same `4h` bucket
- **THEN** the displayed latest candle close is updated to the quote price
- **AND** its REST-provided open, high, low, time, and volume remain unchanged

#### Scenario: Quote belongs to a newer four-hour bucket
- **WHEN** a live quote belongs to the four-hour bucket after the latest REST candle
- **THEN** the quote does not create or update a rendered candle
- **AND** the existing REST refresh remains responsible for supplying that candle

#### Scenario: Four-hour stream identity changes
- **WHEN** the selected chart changes to or from timeframe `4h`
- **THEN** the previous stream is closed
- **AND** the replacement stream uses the active asset and timeframe
