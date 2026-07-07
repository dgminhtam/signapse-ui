## ADDED Requirements

### Requirement: Timeline annotation contract mapping
The system SHALL map market chart annotations from the timeline response shell without relying on removed flat annotation fields.

#### Scenario: Hot event fields are nested
- **WHEN** `GET /market-charts/annotations` returns an annotation with `annotationType` equal to `HOT_EVENT`
- **AND** the annotation includes a `hotEvent` payload
- **THEN** the frontend preserves top-level `id`, `annotationType`, `assetId`, and `time`
- **AND** the frontend preserves hot event fields from `hotEvent`, including event identity, title, summary, direction, confidence, reactions, evidence, and links

#### Scenario: Warm episode fields are nested
- **WHEN** `GET /market-charts/annotations` returns an annotation with `annotationType` equal to `WARM_EPISODE`
- **AND** the annotation includes a `warmEpisode` payload
- **THEN** the frontend preserves top-level `id`, `annotationType`, `assetId`, and `time`
- **AND** the frontend preserves warm episode fields from `warmEpisode`, including `warmEpisodeId`, `periodStart`, `periodEnd`, direction, summary, outcome, and `events[]`

#### Scenario: Removed flat annotation fields are not required
- **WHEN** a valid timeline annotation omits removed flat fields such as top-level `title`, `summary`, `periodStart`, `periodEnd`, `topMarketReaction`, `marketReactions`, or `outcome`
- **THEN** the frontend accepts the annotation without validation failure

### Requirement: Hot event point markers
The system SHALL keep hot annotations on the existing point-marker grouping path.

#### Scenario: Render hot event marker
- **WHEN** the annotation layer is enabled and a timeline annotation has `annotationType` equal to `HOT_EVENT`
- **AND** the annotation has a valid top-level `time` and a `hotEvent` payload
- **THEN** the system renders the annotation through the existing point marker grouping behavior at the top-level `time`
- **AND** marker direction and priority are derived from `hotEvent`

#### Scenario: Omit invalid hot event marker
- **WHEN** a hot annotation has an invalid top-level `time` or no `hotEvent` payload
- **THEN** the system omits that hot marker without crashing
- **AND** valid annotation markers and bands continue to render

### Requirement: Warm episode range bands
The system SHALL render backend warm episodes as non-persisted chart time-range bands when the annotation layer is enabled.

#### Scenario: Render warm episode band
- **WHEN** the annotation layer is enabled and a timeline annotation has `annotationType` equal to `WARM_EPISODE`
- **AND** the annotation includes a `warmEpisode` payload with valid `periodStart` and `periodEnd` values that overlap the loaded candle pane
- **THEN** the system renders a translucent band covering the visible portion of that period on the candle pane
- **AND** the band is vertically bounded by the highest candle high and lowest candle low inside the warm episode period

#### Scenario: Warm band follows viewport changes
- **WHEN** the chart scrolls, zooms, resizes, loads older candles, or its visible range changes while a warm band is visible
- **THEN** the warm band remains aligned to the current candle pane coordinates

#### Scenario: Omit invalid warm episode period
- **WHEN** a warm episode annotation has an invalid `periodStart`, invalid `periodEnd`, no loaded candle price data inside the period, or a period that cannot be mapped to the visible chart pane
- **THEN** the system omits that warm band without crashing
- **AND** valid annotation markers and bands continue to render

#### Scenario: Annotation layer disabled hides annotation visuals
- **WHEN** the user disables the annotation layer
- **THEN** the chart does not render warm episode bands
- **AND** the chart does not render hot event markers

### Requirement: Warm episode band inspection
The system SHALL let users inspect a warm episode from its chart band through the annotation detail preview.

#### Scenario: Select warm episode band
- **WHEN** a user selects a warm episode band
- **THEN** the system opens the annotation popup or responsive fallback with that warm episode's summary, outcome, and nested event timeline

#### Scenario: Warm band selection is replaced
- **WHEN** a warm episode band is selected and the user selects another annotation marker or band
- **THEN** the system replaces the old annotation preview with the newly selected annotation preview

#### Scenario: Warm band remains separate from drawings
- **WHEN** the system renders or selects a warm episode band
- **THEN** the band is not stored as a drawing overlay
- **AND** the band is not included in drawing selection, drawing deletion, drawing lock, or drawing export behavior
