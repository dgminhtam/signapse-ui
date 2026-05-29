# chart-instance-lifecycle Specification

## Purpose

This change is **implementation-only** — it replaces the lifecycle management of the klinecharts chart instance from a single `useEffect` with `dispose`/`init` on every prop change, to a stable instance that persists across prop changes via instance methods. All spec-level behaviors defined in `market-chart-klinechart-engine` remain unchanged.

## Requirements

### Requirement: Chart instance is created once and remains stable

The system SHALL initialize the klinecharts chart instance once when the canvas mounts and dispose it only when the canvas unmounts.

#### Scenario: Mount creates chart
- **WHEN** `MarketChartCanvas` mounts
- **THEN** a single klinecharts `init()` call creates the chart instance
- **AND** the instance is stored and reused for the component's lifetime

#### Scenario: Unmount disposes chart
- **WHEN** `MarketChartCanvas` unmounts
- **THEN** `dispose()` is called exactly once to clean up the chart instance

#### Scenario: Prop changes do not dispose chart
- **WHEN** props such as `timeframe`, `assetId`, `showVolumePane`, `chartThemePalette`, `intlLocale`, `symbol`, or `includeAnnotations` change
- **THEN** the chart instance is NOT disposed
- **AND** corresponding instance methods are called instead (`setPeriod`, `setDataLoader`, `setPaneOptions`, `setStyles`, `setLocale`, `setSymbol`)

### Requirement: User drawings persist across prop changes

The system SHALL preserve all klinecharts overlay drawings when props that require chart updates change.

#### Scenario: Timeframe switch
- **WHEN** the user switches from one timeframe to another
- **THEN** all existing drawings on the chart remain intact
- **AND** new candle data for the selected timeframe is displayed

#### Scenario: Theme change
- **WHEN** the user changes the application theme
- **THEN** all existing drawings remain intact
- **AND** the chart colors update to match the new theme

#### Scenario: Volume pane toggle
- **WHEN** the user toggles the volume pane visibility
- **THEN** all existing drawings remain intact
- **AND** the volume pane is shown or hidden accordingly

### Requirement: Data refresh does not force chart re-initialization

The system SHALL refresh candle data through the DataLoader without destroying the chart instance.

#### Scenario: Asset change
- **WHEN** the user selects a different watchlist asset
- **THEN** fresh candle data is fetched and displayed via `setDataLoader` + DataLoader callback
- **AND** the chart instance is not re-initialized

#### Scenario: Annotation layer toggle
- **WHEN** the user toggles the annotation layer
- **THEN** candle data with updated `includeAnnotations` flag is requested
- **AND** the chart instance remains stable

### Requirement: No chart reset mechanism via nonce

The system SHALL remove the `chartResetNonce`/`resetKey` mechanism that previously forced chart re-initialization.

#### Scenario: Chart absence of resetKey
- **WHEN** candle data is refreshed after a prop change
- **THEN** the canvas does not increment a nonce or change any `resetKey`
- **AND** the chart instance persists without forced re-init
