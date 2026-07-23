## ADDED Requirements

### Requirement: Market chart calculates classic Ichimoku
The system SHALL calculate the complete classic Ichimoku Kinko Hyo indicator with Tenkan period `9`, Kijun period `26`, Senkou Span B period `52`, and displacement `26`.

#### Scenario: Tenkan reaches its initial period
- **WHEN** the active chart contains at least 9 valid candles and Ichimoku is enabled
- **THEN** the first Tenkan value appears on the ninth candle
- **AND** it equals the midpoint of the highest high and lowest low over those 9 candles
- **AND** earlier candles do not expose a synthetic Tenkan value

#### Scenario: Kijun reaches its initial period
- **WHEN** the active chart contains at least 26 valid candles and Ichimoku is enabled
- **THEN** the first Kijun value appears on the twenty-sixth candle
- **AND** it equals the midpoint of the highest high and lowest low over those 26 candles
- **AND** earlier candles do not expose a synthetic Kijun value

#### Scenario: Senkou Span A is calculated
- **WHEN** Tenkan and Kijun are both available for a candle
- **THEN** Senkou Span A equals their midpoint
- **AND** the value is plotted 26 candle indexes after its source candle

#### Scenario: Senkou Span B reaches its initial period
- **WHEN** the active chart contains at least 52 valid candles
- **THEN** Senkou Span B equals the midpoint of the highest high and lowest low over those 52 candles
- **AND** the value is plotted 26 candle indexes after its source candle

#### Scenario: Chikou is calculated
- **WHEN** a valid candle has at least 26 preceding candle indexes
- **THEN** its closing price is plotted as Chikou 26 candle indexes before the source candle

### Requirement: Market chart renders the complete Ichimoku system
The system SHALL render the five classic Ichimoku lines and bullish or bearish Kumo on the main candle pane through the stable KLineCharts `10.0.0` custom-indicator contract.

#### Scenario: User enables Ichimoku
- **WHEN** the user enables Ichimoku on a chart with valid candle data
- **THEN** the adapter creates one `ICHIMOKU` price-series indicator on `candle_pane`
- **AND** Tenkan, Kijun, Senkou Span A, Senkou Span B, and Chikou render over the price chart
- **AND** no secondary pane is created for Ichimoku

#### Scenario: Bullish Kumo segment renders
- **WHEN** Senkou Span A is greater than or equal to Senkou Span B for a rendered cloud segment
- **THEN** the area between the spans uses the chart's bullish color with translucent treatment

#### Scenario: Bearish Kumo segment renders
- **WHEN** Senkou Span A is less than Senkou Span B for a rendered cloud segment
- **THEN** the area between the spans uses the chart's bearish color with translucent treatment

#### Scenario: Senkou spans cross within a segment
- **WHEN** Senkou Span A and Senkou Span B exchange order between adjacent plotted indexes
- **THEN** the Kumo segment is divided at their interpolated crossing point
- **AND** each side uses the color corresponding to its span ordering

#### Scenario: Chart theme changes
- **WHEN** the app switches between light and dark theme while Ichimoku is active
- **THEN** the Kumo uses the current deterministic candle up and down colors
- **AND** the mounted KLineCharts instance remains in use

### Requirement: Ichimoku projects Kumo beyond the latest candle
The system SHALL render the Senkou spans and Kumo 26 candle indexes beyond the latest real candle and provide matching right-side chart space while Ichimoku is active.

#### Scenario: Ichimoku is enabled
- **WHEN** the adapter creates the Ichimoku indicator
- **THEN** the right-side chart offset reserves the current visual width of 26 bars
- **AND** the projected Senkou spans and Kumo can render within that future area

#### Scenario: Ichimoku is disabled
- **WHEN** the adapter removes the active Ichimoku indicator
- **THEN** the projected lines and Kumo are removed
- **AND** the chart restores its default right-side offset

#### Scenario: Another indicator changes while Ichimoku remains active
- **WHEN** the user enables or disables another indicator without changing Ichimoku
- **THEN** the Ichimoku right-side offset is not reset
- **AND** the mounted chart instance remains in use

### Requirement: Ichimoku follows market chart data updates
The system SHALL recalculate the active Ichimoku indicator from the current KLineCharts candle data without rebuilding the chart.

#### Scenario: User changes asset or timeframe
- **WHEN** the selected asset or timeframe changes while Ichimoku is active
- **THEN** all Ichimoku values are recalculated from the replacement candle data
- **AND** Ichimoku remains selected
- **AND** the mounted KLineCharts instance is reused

#### Scenario: Older history is loaded
- **WHEN** lazy loading prepends older candles while Ichimoku is active
- **THEN** the shifted Ichimoku results are recalculated against the merged chronological candle list
- **AND** the cloud remains aligned with candle indexes

#### Scenario: Live candle changes
- **WHEN** the active candle is appended or updated through the live chart subscription
- **THEN** Ichimoku recalculates the values affected by the current candle list
- **AND** the chart does not rebuild solely because the live candle changed

#### Scenario: Ichimoku is toggled repeatedly
- **WHEN** the user enables, disables, and re-enables Ichimoku
- **THEN** the chart contains at most one `ICHIMOKU` indicator
- **AND** each toggle preserves the mounted KLineCharts instance
