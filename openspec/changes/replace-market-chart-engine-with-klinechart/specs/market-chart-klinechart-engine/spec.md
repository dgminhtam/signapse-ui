## ADDED Requirements

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
