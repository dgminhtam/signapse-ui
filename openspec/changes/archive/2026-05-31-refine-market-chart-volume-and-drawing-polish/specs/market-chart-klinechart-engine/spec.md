## ADDED Requirements

### Requirement: Volume pane renders only when volume data exists
The system SHALL render the market chart volume pane only when the active chart data contains usable numeric volume.

#### Scenario: Historical candles contain volume
- **WHEN** the market chart receives a successful candle response where at least one candle has finite numeric `volume`
- **THEN** the KLineChart layout includes the volume pane
- **AND** candle volume values are passed to KLineChart without replacing missing candle volume with synthetic zeroes

#### Scenario: Historical candles do not contain volume
- **WHEN** the market chart receives a successful candle response where no candle has finite numeric `volume`
- **THEN** the KLineChart layout does not include the volume pane
- **AND** the chart keeps the candle pane available for price analysis

#### Scenario: Live candle introduces volume availability
- **WHEN** the active chart initially has no volume pane and later receives live candle data with finite numeric `volume`
- **THEN** the system MAY rebuild the chart once for the volume-availability boundary
- **AND** it MUST NOT rebuild the KLineChart instance on every live candle update solely because the live candle object changed

### Requirement: Missing volume is not treated as zero volume
The system SHALL preserve the distinction between unavailable volume and actual zero volume.

#### Scenario: Candle volume is unavailable
- **WHEN** a historical or live candle has `volume` as `null`, `undefined`, or a non-finite value
- **THEN** the chart data mapper does not pass `volume: 0` for that candle
- **AND** the UI does not imply that provider volume was zero

#### Scenario: Candle volume is zero
- **WHEN** a historical or live candle has finite numeric `volume` equal to `0`
- **THEN** the chart data mapper may pass `volume: 0` as real provider data

### Requirement: Drawing rail is always expanded
The system SHALL render the market chart drawing rail without a collapse affordance.

#### Scenario: Drawing toolbar renders
- **WHEN** the market chart canvas is successful and drawing tools are available
- **THEN** the drawing rail starts directly with drawing tool controls
- **AND** it does not render a collapse or expand button

#### Scenario: Chart selection changes
- **WHEN** the selected asset or timeframe changes
- **THEN** drawing state resets tool selection, lock, visibility, magnet, and selected-drawing state as needed
- **AND** it does not preserve or restore any collapse state

### Requirement: Drawing overlays use lighter chart-local styling
The system SHALL style market chart drawing overlays so they remain visible without dominating candle data.

#### Scenario: Drawing overlay styles are created
- **WHEN** the KLineChart adapter creates drawing overlay styles
- **THEN** line, circle, and rectangle strokes use the chart-local drawing palette
- **AND** their stroke treatment is lighter than the previous heavy visual treatment

#### Scenario: Drawing is selected
- **WHEN** a drawing overlay is selected
- **THEN** selected points remain discoverable
- **AND** their selected treatment stays lighter than the previous heavy active point border treatment

### Requirement: KLineChart text uses the Signapse app font
The system SHALL configure visible KLineChart-owned text with the Signapse app font family when those text styles are exposed by KLineChart.

#### Scenario: Chart styles are created
- **WHEN** the market chart KLineChart style object is built
- **THEN** axis tick text, candle tooltip text, indicator tooltip text, crosshair labels, last price mark text, indicator last value mark text, and drawing overlay text use the app font family

#### Scenario: Unsupported chart text surface
- **WHEN** KLineChart does not expose a style hook for a chart-owned text surface
- **THEN** the implementation keeps the scoped style changes that are supported
- **AND** it does not change global app font tokens to work around a chart-local limitation
