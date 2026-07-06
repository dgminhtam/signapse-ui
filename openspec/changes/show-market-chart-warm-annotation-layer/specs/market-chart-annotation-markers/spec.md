## ADDED Requirements

### Requirement: Warm annotation range bands
The system SHALL render backend warm annotations as non-persisted chart time-range bands when the annotation layer is enabled.

#### Scenario: Render warm event band
- **WHEN** the annotation layer is enabled and `GET /market-charts/annotations` returns an annotation with `annotationType` equal to `WARM_EVENT`
- **AND** the annotation has valid `periodStart` and `periodEnd` values that overlap the loaded candle pane
- **THEN** the system renders a translucent band covering the visible portion of that period on the candle pane
- **AND** the band is vertically bounded by the highest candle high and lowest candle low inside the warm period

#### Scenario: Render warm episode band
- **WHEN** the annotation layer is enabled and `GET /market-charts/annotations` returns an annotation with `annotationType` equal to `WARM_EPISODE`
- **AND** the annotation has valid `periodStart` and `periodEnd` values that overlap the loaded candle pane
- **THEN** the system renders a translucent band covering the visible portion of that period on the candle pane
- **AND** the band is vertically bounded by the highest candle high and lowest candle low inside the warm period

#### Scenario: Preserve hot event marker behavior
- **WHEN** the annotation layer is enabled and an annotation is a `HOT_EVENT` or has no recognized warm period type
- **THEN** the system continues to render the annotation through the existing point marker grouping behavior

#### Scenario: Warm band follows viewport changes
- **WHEN** the chart scrolls, zooms, resizes, loads older candles, or its visible range changes while a warm band is visible
- **THEN** the warm band remains aligned to the current candle pane coordinates

#### Scenario: Omit invalid warm period
- **WHEN** a warm annotation has an invalid `periodStart`, invalid `periodEnd`, no loaded candle price data inside the period, or a period that cannot be mapped to the visible chart pane
- **THEN** the system omits that warm band without crashing
- **AND** valid annotation markers and bands continue to render

#### Scenario: Annotation layer disabled hides warm bands
- **WHEN** the user disables the annotation layer
- **THEN** the chart does not render warm annotation bands
- **AND** the chart does not render hot annotation markers

### Requirement: Warm annotation band inspection
The system SHALL let users inspect a warm annotation from its chart band through the existing annotation detail preview.

#### Scenario: Select warm band
- **WHEN** a user selects a warm annotation band
- **THEN** the system opens the annotation popup or responsive fallback with that warm annotation's title, time, summary, direction, and available reaction or outcome preview

#### Scenario: Warm band selection is replaced
- **WHEN** a warm annotation band is selected and the user selects another annotation marker or band
- **THEN** the system replaces the old annotation preview with the newly selected annotation preview

#### Scenario: Warm band remains separate from drawings
- **WHEN** the system renders or selects a warm annotation band
- **THEN** the band is not stored as a drawing overlay
- **AND** the band is not included in drawing selection, drawing deletion, drawing lock, or drawing export behavior

### Requirement: Warm annotation contract mapping
The system SHALL preserve backend warm annotation fields needed by the market chart annotation layer.

#### Scenario: Warm fields are returned
- **WHEN** `GET /market-charts/annotations` returns `annotationType`, `warmEpisodeId`, `warmEpisodeEventId`, `periodStart`, `periodEnd`, or top-level `outcome`
- **THEN** the frontend annotation response mapping preserves those fields for chart rendering and popup preview logic

#### Scenario: Missing optional warm fields
- **WHEN** an annotation omits optional warm fields
- **THEN** the frontend response mapping accepts the annotation without adding placeholder values
