## MODIFIED Requirements

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
