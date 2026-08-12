# market-chart-annotation-markers Specification

## Purpose
TBD - created by archiving change add-market-chart-annotation-markers. Update Purpose after archive.
## Requirements
### Requirement: Annotation layer control
The system SHALL enable market chart annotation markers by default and let users disable or re-enable them from the market chart workbench.

#### Scenario: Annotation layer defaults to enabled
- **WHEN** a user opens the market chart workbench for a selected watchlist asset and timeframe
- **THEN** the annotation layer is enabled by default
- **AND** the system requests annotations from `GET /market-charts/annotations` for the loaded candle window

#### Scenario: Enable annotation layer
- **WHEN** a user enables the annotation layer for a selected watchlist asset and timeframe
- **THEN** the system requests annotations from `GET /market-charts/annotations` for the loaded candle window if annotation data is not already available

#### Scenario: Disable annotation layer
- **WHEN** a user disables the annotation layer
- **THEN** the chart does not render annotation markers
- **AND** the system does not send `includeAnnotations=false` to the candle endpoint

#### Scenario: Preserve chart identity
- **WHEN** the annotation layer is toggled
- **THEN** the route state continues to identify the chart by `assetId` and `timeframe`
- **AND** the system does not add manual `from`, `to`, or `symbol` controls

### Requirement: Annotation marker rendering
The system SHALL render backend annotation endpoint results as visual markers on the candlestick chart when the annotation layer is enabled.

#### Scenario: Fetch annotation endpoint data
- **WHEN** the annotation layer is enabled for a loaded candle window
- **THEN** the system calls `GET /market-charts/annotations` through an authenticated market chart action
- **AND** it sends flat query parameters `assetId`, `from`, and `to`

#### Scenario: Render returned annotations
- **WHEN** the backend returns non-empty annotation endpoint data
- **THEN** the system renders hot event markers at the annotation times on the candlestick chart

#### Scenario: Direction-specific marker treatment
- **WHEN** an annotation has direction `BULLISH`, `BEARISH`, `MIXED`, or `NEUTRAL`
- **THEN** the system maps the direction to a distinct marker treatment that helps users scan positive, negative, mixed, and neutral events

#### Scenario: Ignore invalid annotation time
- **WHEN** an annotation has an invalid time or cannot be placed in the loaded chart range
- **THEN** the system does not crash
- **AND** the system omits that annotation from chart markers

#### Scenario: Ignore malformed annotation items
- **WHEN** the annotation collection contains a null, undefined, or malformed annotation item
- **THEN** the system omits that item before reading annotation `time`
- **AND** valid annotations continue to group and render as chart markers
- **AND** the market chart does not crash with a runtime `.time` read error

#### Scenario: Avoid long chart labels
- **WHEN** the system renders annotation markers
- **THEN** markers use compact visual labels or icons
- **AND** the system does not render long annotation title, summary, evidence, or reaction text directly over the chart canvas

### Requirement: Group dense annotation markers
The system SHALL avoid visually stacking multiple annotation markers at the same chart time.

#### Scenario: Multiple annotations share one chart time
- **WHEN** multiple annotations map to the same chart time bucket
- **THEN** the chart renders a single grouped marker for that time
- **AND** the grouped detail surface allows the user to inspect the contained annotations

#### Scenario: Single annotation at a chart time
- **WHEN** only one annotation maps to a chart time
- **THEN** the chart renders it as a single annotation marker

### Requirement: Annotation detail inspection
The system SHALL let users inspect annotation details outside the chart canvas.

#### Scenario: Select annotation marker
- **WHEN** a user selects an annotation marker or grouped marker
- **THEN** the system shows the selected annotation or group details in the workbench

#### Scenario: Show useful annotation fields
- **WHEN** annotation details are shown
- **THEN** the system displays available hot event title, time, direction, confidence, summary, primary reaction context from `hotEvent.topMarketReaction`, evidence, and event detail link

#### Scenario: Omit unavailable optional fields
- **WHEN** optional annotation fields are missing or null
- **THEN** the system omits those fields without rendering placeholder technical copy

#### Scenario: Omit missing primary reaction
- **WHEN** a hot event annotation has no `hotEvent.topMarketReaction`
- **THEN** the system does not display reaction-derived confidence or infer a primary reaction from `marketReactions[]`

#### Scenario: Open event detail link
- **WHEN** a hot event annotation includes `hotEvent.links.eventDetail`
- **THEN** the system provides a user-accessible action to open that event detail target

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
The system SHALL render backend warm episodes as non-persisted chart time-range bands only when the annotation layer is enabled and the selected timeframe is `1d` or `1w`.

#### Scenario: Render warm episode band on a supported timeframe
- **WHEN** the annotation layer is enabled and the selected timeframe is `1d` or `1w`
- **AND** a timeline annotation has `annotationType` equal to `WARM_EPISODE`
- **AND** the annotation includes a `warmEpisode` payload with valid `periodStart` and `periodEnd` values that overlap the loaded candle pane
- **THEN** the system renders a translucent band covering the visible portion of that period on the candle pane
- **AND** the band is vertically bounded by the highest candle high and lowest candle low inside the warm episode period

#### Scenario: Hide warm bands on unsupported timeframes
- **WHEN** the selected timeframe is `1m`, `5m`, `15m`, `30m`, `1h`, `4h`, or `1mo`
- **THEN** the chart does not render warm episode bands
- **AND** hot event markers remain governed by the annotation-layer setting

#### Scenario: Warm band follows viewport changes
- **WHEN** the chart scrolls, zooms, resizes, loads older candles, or its visible range changes while a warm band is visible
- **THEN** the warm band remains aligned to the current candle pane coordinates

#### Scenario: Warm band does not block chart interaction
- **WHEN** a pointer pan, scroll, or zoom interaction begins within the painted warm-band area but outside its compact inspection trigger
- **THEN** the warm-band visual does not intercept the pointer interaction
- **AND** the underlying chart continues the corresponding pan, scroll, or zoom behavior

#### Scenario: Omit invalid warm episode period
- **WHEN** a warm episode annotation has an invalid `periodStart`, invalid `periodEnd`, no loaded candle price data inside the period, or a period that cannot be mapped to the visible chart pane
- **THEN** the system omits that warm band without crashing
- **AND** valid annotation markers and bands continue to render

#### Scenario: Annotation layer disabled hides annotation visuals
- **WHEN** the user disables the annotation layer
- **THEN** the chart does not render warm episode bands
- **AND** the chart does not render hot event markers

### Requirement: Warm episode band inspection
The system SHALL let users inspect a visible warm episode through a compact accessible trigger associated with its chart band and the existing annotation detail preview.

#### Scenario: Select warm episode from its compact trigger
- **WHEN** a user activates a visible warm band's compact inspection trigger with a pointer or touch input
- **THEN** the system opens the annotation popup or responsive fallback with that warm episode's summary, outcome, and nested event timeline

#### Scenario: Inspect warm episode with a keyboard
- **WHEN** keyboard focus reaches a visible warm band's compact inspection trigger
- **THEN** the trigger has a visible focus indicator and an accessible name describing the warm episode
- **AND** activating the trigger with Enter or Space opens the annotation popup or responsive fallback

#### Scenario: Warm band selection is replaced
- **WHEN** a warm episode band is selected and the user selects another annotation marker or band trigger
- **THEN** the system replaces the old annotation preview with the newly selected annotation preview

#### Scenario: Warm band remains separate from drawings
- **WHEN** the system renders or selects a warm episode band
- **THEN** the band is not stored as a drawing overlay
- **AND** the band is not included in drawing selection, drawing deletion, drawing lock, or drawing export behavior

### Requirement: Accessible annotation navigation
The system SHALL provide a keyboard-accessible way to review annotations when the annotation layer is enabled.

#### Scenario: Keyboard annotation review
- **WHEN** the annotation layer is enabled and annotations are available
- **THEN** the system exposes annotation rows or controls outside the canvas that can receive keyboard focus

#### Scenario: Canvas interaction is unavailable
- **WHEN** a user cannot interact with chart markers directly
- **THEN** the user can still select and inspect annotations through the accessible annotation controls

### Requirement: Annotation empty and loading states
The system SHALL handle annotation loading and empty states without adding redundant screen copy.

#### Scenario: Annotation layer loading
- **WHEN** the annotation layer is enabled and the annotation request is pending
- **THEN** the system shows pending feedback without changing the final chart layout unexpectedly

#### Scenario: No annotations returned
- **WHEN** the annotation layer is enabled and the backend returns an empty annotation collection
- **THEN** the system shows a concise empty annotation state
- **AND** the system does not render fake markers or future-feature placeholder panels

#### Scenario: Annotation layer disabled
- **WHEN** the annotation layer is disabled
- **THEN** the system does not show annotation empty-state copy as if data were missing

### Requirement: Annotation color semantics are shared
The system SHALL use one annotation color mapping for chart markers, popup marker affordances, and marker legends.

#### Scenario: Positive annotation is shown
- **WHEN** an annotation represents a positive or bullish market reaction
- **THEN** the chart marker, popup dot or pulse, and legend item use the same positive color treatment

#### Scenario: Negative annotation is shown
- **WHEN** an annotation represents a negative or bearish market reaction
- **THEN** the chart marker, popup dot or pulse, and legend item use the same negative color treatment

#### Scenario: Neutral annotation is shown
- **WHEN** an annotation represents a neutral market reaction
- **THEN** the chart marker, popup dot or pulse, and legend item use the same neutral color treatment

#### Scenario: Mixed annotation is shown
- **WHEN** an annotation represents a mixed market reaction
- **THEN** the chart marker, popup dot or pulse, and legend item use the same mixed color treatment

### Requirement: Annotation legend
The system SHALL provide a compact legend for annotation marker colors below the chart canvas and above the chart footer when marker colors are visible.

#### Scenario: Annotation layer has visible markers
- **WHEN** the annotation layer is enabled and the chart has visible annotation markers
- **THEN** the workbench displays a compact legend explaining positive, negative, neutral, and mixed marker colors

#### Scenario: Annotation layer is disabled
- **WHEN** the annotation layer is disabled
- **THEN** the workbench does not display annotation legend copy

#### Scenario: Annotation layer has no events
- **WHEN** the annotation layer is enabled but no annotations are available in the current loaded range
- **THEN** the workbench keeps the existing concise empty annotation footer state
- **AND** the workbench does not display an unnecessary color legend
