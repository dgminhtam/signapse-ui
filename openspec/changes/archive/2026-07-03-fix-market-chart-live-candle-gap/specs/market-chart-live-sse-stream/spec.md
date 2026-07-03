## MODIFIED Requirements

### Requirement: Quote-only latest candle close rendering
The system SHALL update only the displayed close value of the latest REST-loaded candle from live quote events for the active timeframe.

#### Scenario: Quote updates latest REST candle close
- **WHEN** a live quote belongs to the same timeframe bucket as the latest displayed candle
- **THEN** the system displays that candle with close updated to the quote price
- **AND** preserves the candle open, high, low, time, and volume from REST data

#### Scenario: Quote does not expand candle range
- **WHEN** a live quote price is above the latest REST candle high or below the latest REST candle low
- **THEN** the system updates only the displayed close value
- **AND** does not change the displayed high or low value

#### Scenario: Quote newer than latest REST candle bucket
- **WHEN** a live quote belongs to a timeframe bucket after the latest displayed candle
- **THEN** the system ignores the quote for candle rendering until REST refresh supplies the newer candle bucket

#### Scenario: Quote older than latest REST candle bucket
- **WHEN** a live quote belongs to a timeframe bucket before the latest displayed candle
- **THEN** the system does not regress the displayed latest candle close

#### Scenario: SSE candle payload ignored for rendering
- **WHEN** a live `candle` event or `snapshot.candle` payload arrives
- **THEN** the system does not use that payload to create, replace, or update rendered chart candles
