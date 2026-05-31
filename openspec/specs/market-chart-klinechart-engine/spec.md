# market-chart-klinechart-engine Specification

## Purpose
TBD - created by archiving change replace-market-chart-engine-with-klinechart. Update Purpose after archive.
## Requirements
### Requirement: Market chart uses KLineChart engine
The system SHALL render successful market candle responses with KLineChart instead of Lightweight Charts.

#### Scenario: Candle response renders through KLineChart
- **WHEN** the market chart workbench receives a successful candle response with one or more candles
- **THEN** the chart canvas renders the candles through a KLineChart instance

#### Scenario: Lightweight Charts dependency is removed
- **WHEN** the KLineChart migration is complete
- **THEN** runtime market chart source no longer imports `lightweight-charts` or uses Lightweight Charts types

### Requirement: Chart data mapping stays engine-neutral outside the canvas
The system SHALL keep KLineChart-specific data records and types inside the market chart canvas adapter boundary.

#### Scenario: Domain helpers do not expose chart vendor types
- **WHEN** annotation grouping or market chart DTO helpers are imported outside the chart canvas
- **THEN** they expose plain domain types rather than KLineChart or Lightweight Charts types

#### Scenario: Candle timestamps are converted at the adapter boundary
- **WHEN** backend candle `time` values are passed to the chart canvas
- **THEN** the canvas adapter converts them to KLineChart millisecond timestamps before applying data to the chart

#### Scenario: Invalid candle items are ignored before timestamp conversion
- **WHEN** the chart canvas receives a candle collection containing a null, undefined, malformed, or invalid-time candle item
- **THEN** the canvas adapter omits that item before reading candle `time`
- **AND** valid candles continue to render in chronological order
- **AND** the market chart does not crash with a runtime `.time` read error

### Requirement: Existing chart workbench behavior is preserved
The system SHALL preserve the current market chart workbench user flow while changing the chart engine.

#### Scenario: User selects a watchlist asset and timeframe
- **WHEN** a user selects a workspace watchlist asset and timeframe
- **THEN** the workbench requests the latest rolling candle window using the existing backend candle API contract

#### Scenario: Chart states remain available
- **WHEN** the workbench is idle, loading, empty, errored, or successful
- **THEN** the UI presents the same class of state feedback as before the engine migration

### Requirement: Annotation popup interaction works with KLineChart
The system SHALL preserve annotation notification markers and popup detail interaction after moving to KLineChart.

#### Scenario: Annotation layer is enabled
- **WHEN** the user enables the annotation layer and the candle response includes annotations within the visible candle range
- **THEN** the chart shows prominent red notification markers anchored to the corresponding candle times

#### Scenario: User opens annotation detail
- **WHEN** the user activates an annotation marker or accessible annotation control
- **THEN** the workbench opens a popup with grouped annotation detail, evidence, confidence, reaction context, and event link when present

#### Scenario: Annotation rail is not restored
- **WHEN** annotation detail is shown
- **THEN** the UI does not render a permanent right-side annotation detail panel

### Requirement: KLineChart adapter supports contained lazy loading
The system SHALL structure the chart adapter so lazy historical loading can run without changing the backend API contract or reintroducing manual `from/to` controls.

#### Scenario: User pans toward older candles
- **WHEN** a lazy-history capability is active and the user pans toward older candles
- **THEN** the integration point remains the KLineChart canvas adapter

#### Scenario: Loader boundary is contained
- **WHEN** lazy historical loading requests older candles
- **THEN** it does not require manual time controls in the surrounding workbench layout

### Requirement: Old vendor source is removed cleanly
The system SHALL remove obsolete Lightweight Charts and TradingView implementation remnants after the migration.

#### Scenario: TradingView attribution is no longer rendered
- **WHEN** the market chart screen uses KLineChart
- **THEN** it does not render TradingView attribution or branding copy that only applied to Lightweight Charts

#### Scenario: Temporary legacy code is removed
- **WHEN** the migration is complete
- **THEN** unused legacy chart or annotation components are deleted instead of being kept behind eslint suppressions or comments

#### Scenario: Repository rules cover clean vendor migrations
- **WHEN** future agents read `AGENTS.md`
- **THEN** they find a rule requiring source, dependency, attribution, documentation, and dead-code cleanup when replacing a UI/chart vendor

### Requirement: KLineCharts locale is safe for app locales
The system SHALL initialize market chart KLineCharts instances with a KLineCharts-supported locale that preserves localized chart tooltip copy when available.

#### Scenario: Vietnamese market chart tooltip renders
- **WHEN** a user opens the market chart route with the Vietnamese app locale
- **THEN** the chart registers Vietnamese KLineCharts locale labels before initializing the chart instance
- **AND** KLineCharts receives a supported Vietnamese locale for tooltip rendering
- **AND** the candle tooltip does not crash while resolving the `time` i18n key

#### Scenario: Vietnamese tooltip labels are localized
- **WHEN** KLineCharts renders candle tooltip labels for a Vietnamese route
- **THEN** labels for time, open, high, low, close, volume, turnover, and change are shown in professional Vietnamese

#### Scenario: Unsupported chart locale falls back safely
- **WHEN** the app provides a locale that has not been registered with KLineCharts
- **THEN** the chart adapter uses a KLineCharts-supported fallback locale
- **AND** tooltip rendering does not crash because of a missing locale dictionary

#### Scenario: Locale setup remains adapter-local
- **WHEN** market chart locale handling is implemented
- **THEN** KLineCharts-specific locale registration and fallback logic stays inside the market chart chart-adapter boundary
- **AND** shared app i18n helpers and backend DTO definitions do not import KLineCharts locale APIs

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

### Requirement: KLineCharts theme palette is deterministic
The system SHALL build market chart KLineCharts color styles from an explicit chart theme mode instead of timing-sensitive DOM color reads.

#### Scenario: Initial light theme palette
- **WHEN** the market chart renders while the resolved app theme is light
- **THEN** KLineCharts receives the light chart palette for candle up/down colors, grid, axes, tooltip text, crosshair labels, volume, and drawing overlays
- **AND** those core chart colors do not depend on reading theme-sensitive CSS variables during chart initialization

#### Scenario: Initial dark theme palette
- **WHEN** the market chart renders while the resolved app theme is dark
- **THEN** KLineCharts receives the dark chart palette for candle up/down colors, grid, axes, tooltip text, crosshair labels, volume, and drawing overlays
- **AND** those core chart colors do not depend on reading theme-sensitive CSS variables during chart initialization

#### Scenario: Light dark light transition is stable
- **WHEN** a user switches the market chart from light mode to dark mode and then back to light mode
- **THEN** the chart returns to the same light palette used before switching
- **AND** candle colors, grid colors, axis text colors, and crosshair colors do not drift because of stale CSS variable snapshots

#### Scenario: Unsupported or unresolved theme falls back safely
- **WHEN** the chart adapter cannot resolve a dark theme mode
- **THEN** the adapter uses the light chart palette
- **AND** KLineCharts still receives a complete style object without crashing or rendering partially themed colors

#### Scenario: Theme styling remains adapter-local
- **WHEN** market chart theme styling is implemented
- **THEN** KLineCharts palette selection stays inside the market chart canvas adapter boundary
- **AND** shared app theme providers, global shadcn tokens, backend DTO definitions, and non-chart features do not import KLineCharts style helpers

