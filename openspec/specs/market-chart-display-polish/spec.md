# market-chart-display-polish Specification

## Purpose
TBD - created by archiving change refine-market-chart-toolbar-metadata-and-price-marks. Update Purpose after archive.
## Requirements
### Requirement: Toolbar freshness metadata
The system SHALL show market chart freshness metadata outside the chart plot area.

#### Scenario: Successful chart data has update time
- **WHEN** the market chart has successfully loaded candle data with a valid response `to` time
- **THEN** the system displays freshness metadata in the trailing toolbar near the refresh action
- **AND** the metadata text uses professional Vietnamese copy such as `Cập nhật 10:17 07/05/2026`

#### Scenario: Avoid duplicated chart identity
- **WHEN** the system displays freshness metadata in the toolbar
- **THEN** the metadata does not repeat the selected symbol
- **AND** the metadata does not repeat the selected timeframe

#### Scenario: Keep chart plot area clear
- **WHEN** the chart canvas is rendered
- **THEN** the system does not render a symbol, timeframe, or update-time pill inside the chart plot area

#### Scenario: Metadata is contextual not actionable
- **WHEN** freshness metadata is visible
- **THEN** it is rendered as low-emphasis text rather than a button, badge, bordered pill, or focusable control

### Requirement: Last price mark typography
The system SHALL style the KLineChart last price marker text with the same font family used by the Signapse UI.

#### Scenario: Last price marker is visible
- **WHEN** the chart renders the last price marker
- **THEN** `candle.priceMark.last.text.family` uses the app font family resolved from the chart style helper

#### Scenario: Last price marker remains enabled
- **WHEN** the high and low price marks are hidden
- **THEN** the last price marker remains visible for current-price scanning

### Requirement: High and low price mark visibility
The system SHALL hide persistent KLineChart high and low price markers to reduce chart clutter.

#### Scenario: Chart styles are created
- **WHEN** the chart style object is built
- **THEN** `candle.priceMark.high.show` is set to `false`
- **AND** `candle.priceMark.low.show` is set to `false`

#### Scenario: Exact values remain available
- **WHEN** high and low price markers are hidden
- **THEN** users can still inspect exact values through the chart axis, crosshair, or candle tooltip behavior

### Requirement: Drawing overlay tool palette
The system SHALL render market chart drawing overlays with a dedicated chart-tool palette that is distinct from candle direction and annotation reaction colors.

#### Scenario: Drawing overlays use tool colors
- **WHEN** a user creates a drawing object on the market chart
- **THEN** the drawing line, circle, rectangle, and point styles use chart-local drawing colors
- **AND** the drawing colors are not the same semantic red or green used for candle direction

#### Scenario: Drawing overlays remain legible in light and dark mode
- **WHEN** the market chart theme is light or dark
- **THEN** drawing overlays remain visible against the chart background and grid
- **AND** selected drawing handles use a stronger same-hue treatment than inactive drawing handles

#### Scenario: Drawing overlay strokes avoid fuzzy fractional widths
- **WHEN** drawing overlay styles are created
- **THEN** line, circle, and rectangle border sizes use crisp chart-friendly stroke values
- **AND** selected point borders use a visible selected treatment without relying on neutral gray

#### Scenario: Drawing palette remains chart-local
- **WHEN** drawing overlay colors are adjusted
- **THEN** the implementation changes only the market chart KLineChart style helper
- **AND** global shadcn theme tokens and shared UI wrappers remain unchanged

