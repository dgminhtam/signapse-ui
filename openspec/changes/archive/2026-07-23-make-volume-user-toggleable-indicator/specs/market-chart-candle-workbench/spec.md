## MODIFIED Requirements

### Requirement: Candlestick chart rendering

The system SHALL render successful candle responses as a financial candlestick chart using the selected chart engine and SHALL keep optional volume visualization under explicit user control.

#### Scenario: Render candles

- **WHEN** the backend returns one or more candles
- **THEN** the system renders candlesticks using candle `time`, `open`, `high`, `low`, and `close`

#### Scenario: Keep available volume hidden by default

- **WHEN** candles include usable volume values
- **AND** the user has not enabled the Volume indicator
- **THEN** the system does not render the volume pane

#### Scenario: Render enabled volume when available

- **WHEN** candles include usable volume values
- **AND** the user enables the Volume indicator
- **THEN** the system renders volume as a secondary pane without competing with the price chart

#### Scenario: Resize chart surface

- **WHEN** the chart container size changes
- **THEN** the chart resizes without overflowing the app layout
