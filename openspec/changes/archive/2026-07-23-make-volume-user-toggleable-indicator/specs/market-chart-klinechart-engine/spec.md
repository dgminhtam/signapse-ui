## MODIFIED Requirements

### Requirement: Volume pane renders only when enabled and volume data exists

The system SHALL render the market chart volume pane only when the user has enabled the Volume indicator and the active chart data contains usable numeric volume.

#### Scenario: Historical candles contain volume and Volume is disabled

- **WHEN** the market chart receives a successful candle response where at least one candle has finite numeric `volume`
- **AND** the user has not enabled the Volume indicator
- **THEN** the KLineChart layout does not include the volume pane
- **AND** the candle pane retains the available chart space

#### Scenario: Historical candles contain volume and Volume is enabled

- **WHEN** the active chart contains at least one candle with finite numeric `volume`
- **AND** the user enables the Volume indicator
- **THEN** the KLineChart layout includes one volume pane
- **AND** candle volume values are passed to KLineChart without replacing missing candle volume with synthetic zeroes

#### Scenario: User disables Volume

- **WHEN** the KLineChart volume pane is visible
- **AND** the user disables the Volume indicator
- **THEN** the system removes the volume pane
- **AND** the candle pane remains available for price analysis

#### Scenario: Historical candles do not contain volume

- **WHEN** the market chart receives a successful candle response where no candle has finite numeric `volume`
- **THEN** the KLineChart layout does not include the volume pane
- **AND** the chart keeps the candle pane available for price analysis

#### Scenario: Live candle introduces volume availability

- **WHEN** the active chart initially has no usable volume
- **AND** later receives live candle data with finite numeric `volume`
- **THEN** the Volume indicator becomes available for explicit user selection
- **AND** the system MUST NOT create the volume pane until the user enables Volume
- **AND** it MUST NOT rebuild the KLineChart instance on every live candle update solely because the live candle object changed

#### Scenario: Volume is toggled repeatedly

- **WHEN** the user enables, disables, and re-enables Volume while usable volume data remains available
- **THEN** the chart contains at most one volume pane
- **AND** each toggle preserves the mounted KLineChart instance
