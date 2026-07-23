## ADDED Requirements

### Requirement: Market chart calculates Wilder ATR
The system SHALL calculate the market chart ATR indicator with a default period of 14 using true range and Wilder smoothing.

#### Scenario: ATR reaches its initial period
- **WHEN** the active chart contains at least 14 valid candles and ATR is enabled
- **THEN** the first ATR value is rendered on the fourteenth candle
- **AND** that value is the arithmetic mean of the first 14 true ranges
- **AND** earlier candles do not expose synthetic ATR zeroes

#### Scenario: ATR processes a price gap
- **WHEN** a candle high or low is separated from the previous candle close
- **THEN** true range is the maximum of the current high-low range, absolute high-to-previous-close distance, and absolute low-to-previous-close distance

#### Scenario: ATR advances after its initial value
- **WHEN** a new valid candle follows an existing ATR value
- **THEN** the next ATR value equals `(previous ATR * 13 + current true range) / 14`

### Requirement: Market chart renders ATR and DMI in secondary panes
The system SHALL render ATR and DMI through the stable KLineCharts 10 indicator contract in separate deterministic secondary panes.

#### Scenario: User enables ATR
- **WHEN** the user enables ATR
- **THEN** the adapter creates one registered custom ATR line indicator in its deterministic secondary pane
- **AND** the pane uses the existing secondary-pane height, minimum height, and drag behavior

#### Scenario: User enables DMI
- **WHEN** the user enables DMI
- **THEN** the adapter creates the KLineCharts built-in `DMI` indicator in its deterministic secondary pane
- **AND** the indicator retains its PDI, MDI, ADX, and ADXR figures
- **AND** the UI and chart keep the indicator name `DMI`

#### Scenario: User toggles ATR or DMI repeatedly
- **WHEN** the user enables, disables, and re-enables ATR or DMI
- **THEN** the chart contains at most one pane for that indicator
- **AND** disabling the indicator removes its pane
- **AND** each toggle preserves the mounted KLineCharts instance

#### Scenario: User changes chart data while ATR or DMI is active
- **WHEN** the selected asset or timeframe changes while ATR or DMI is enabled
- **THEN** the enabled indicator is recalculated from the active candle data
- **AND** the selected indicator remains active
- **AND** the mounted KLineCharts instance is reused
