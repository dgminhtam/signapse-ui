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

### Requirement: Volume pane renders only when enabled and volume data exists
The system SHALL render the market chart volume pane only when the user has enabled the Volume indicator and the active chart data contains usable numeric volume.

#### Scenario: Historical candles contain volume and Volume is disabled
- **WHEN** the market chart receives a successful candle response where at least one candle has finite numeric `volume`
- **AND** the user has not enabled the Volume indicator
- **THEN** the KLineChart layout does not include the volume pane
- **AND** the candle pane retains the available chart space

#### Scenario: Historical candles contain volume and Volume is enabled
- **WHEN** the active chart contains at least one candle with finite numeric `volume`
- **AND** the user enables the Volume indicator
- **THEN** the KLineChart layout includes one volume pane
- **AND** candle volume values are passed to KLineChart without replacing missing candle volume with synthetic zeroes

#### Scenario: User disables Volume
- **WHEN** the KLineChart volume pane is visible
- **AND** the user disables the Volume indicator
- **THEN** the system removes the volume pane
- **AND** the candle pane remains available for price analysis

#### Scenario: Historical candles do not contain volume
- **WHEN** the market chart receives a successful candle response where no candle has finite numeric `volume`
- **THEN** the KLineChart layout does not include the volume pane
- **AND** the chart keeps the candle pane available for price analysis

#### Scenario: Live candle introduces volume availability
- **WHEN** the active chart initially has no usable volume
- **AND** later receives live candle data with finite numeric `volume`
- **THEN** the Volume indicator becomes available for explicit user selection
- **AND** the system MUST NOT create the volume pane until the user enables Volume
- **AND** it MUST NOT rebuild the KLineChart instance on every live candle update solely because the live candle object changed

#### Scenario: Volume is toggled repeatedly
- **WHEN** the user enables, disables, and re-enables Volume while usable volume data remains available
- **THEN** the chart contains at most one volume pane
- **AND** each toggle preserves the mounted KLineChart instance

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

### Requirement: Market chart uses stable KLineChart 10 contracts
The system SHALL pin KLineChart version `10.0.0` and SHALL configure the market chart through APIs supported by that stable release rather than prerelease-only layout or indicator signatures.

#### Scenario: Stable dependency is installed
- **WHEN** project dependencies are resolved
- **THEN** the installed `klinecharts` package version is exactly `10.0.0`
- **AND** the dependency manifest and lockfile do not resolve `10.0.0-beta1`

#### Scenario: Chart initializes with stable layout options
- **WHEN** the market chart canvas mounts
- **THEN** KLineChart receives the stable object-based default layout configuration
- **AND** the candle y-axis retains the configured top and bottom gap
- **AND** the chart keeps using the built-in `candle_pane` identity

#### Scenario: Main-pane indicator is enabled
- **WHEN** the user enables `MA`, `EMA`, or `BOLL`
- **THEN** the adapter creates the indicator on `candle_pane` through the stable indicator contract
- **AND** the indicator is stacked on the main price pane

#### Scenario: Secondary-pane indicator is enabled
- **WHEN** the user enables `MACD`, `RSI`, `KDJ`, or `VOL`
- **THEN** the adapter creates the indicator with its deterministic pane ID
- **AND** applies the existing pane height, minimum height, and drag behavior through the stable pane configuration API

#### Scenario: Stable upgrade preserves existing chart behavior
- **WHEN** the stable dependency and adapter migration are complete
- **THEN** candle loading, live updates, lazy history, indicator toggles, Volume availability, drawings, annotations, theme, locale, screenshot, and fullscreen behavior remain available
- **AND** prop changes continue to reuse the mounted chart instance

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

### Requirement: KLineCharts renders four-hour market periods
The system SHALL map market-chart timeframe `4h` to the stable KLineCharts hour period with span `4`.

#### Scenario: Four-hour chart data is applied
- **WHEN** the active market chart timeframe is `4h`
- **THEN** KLineCharts receives period type `hour` and span `4`
- **AND** the existing mounted chart instance is used

#### Scenario: User switches to or from four-hour timeframe
- **WHEN** the user changes between `4h` and another supported timeframe
- **THEN** the chart loads data for the selected timeframe
- **AND** the existing timeframe-change lifecycle remains in effect
