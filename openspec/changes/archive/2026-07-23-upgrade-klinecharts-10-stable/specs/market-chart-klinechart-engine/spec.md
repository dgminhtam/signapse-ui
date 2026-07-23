## ADDED Requirements

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
