# chart-theme-scroll-preservation Specification

## Purpose
TBD - created by archiving change fix-theme-scroll-jump. Update Purpose after archive.
## Requirements
### Requirement: Theme toggle preserves chart scroll position

The system SHALL maintain the visible candle range when the user switches between light and dark themes.

#### Scenario: Light → Dark toggle
- **WHEN** the user switches from light to dark theme
- **THEN** the chart colors update to match the dark palette
- **AND** the visible candle range remains unchanged

#### Scenario: Dark → Light toggle
- **WHEN** the user switches from dark to light theme
- **THEN** the chart colors update to match the light palette
- **AND** the visible candle range remains unchanged

### Requirement: Unnecessary data reset is avoided

The system SHALL NOT reset chart data or scroll position when the theme changes.

#### Scenario: Chart data is not re-fetched
- **WHEN** the theme changes
- **THEN** the chart does not call its DataLoader for fresh data
- **AND** existing candles, drawings, and annotations remain intact without re-fetch

#### Scenario: candles prop reference change does not trigger resetData
- **WHEN** the parent re-renders with the same candles content but a new array reference
- **THEN** the canvas does not call `chart.resetData()` unnecessarily

### Requirement: Intentional data reset still works

The system SHALL reset data and scroll to latest when the user changes timeframe or asset.

#### Scenario: Timeframe change resets data
- **WHEN** the user selects a different timeframe
- **THEN** new candle data is loaded for the selected timeframe
- **AND** the scroll position resets to show the latest data

#### Scenario: Asset change resets data
- **WHEN** the user selects a different watchlist asset
- **THEN** new candle data is loaded for the selected asset
- **AND** the scroll position resets to show the latest data

