## ADDED Requirements

### Requirement: Page-level workbench skeleton
The system SHALL render a page-level market chart skeleton that mirrors the final workbench shell while server-side permissions and watchlist assets are loading.

#### Scenario: Market chart page is suspended
- **WHEN** the market chart route is waiting for server-side permissions or watchlist bootstrap data
- **THEN** the page-level skeleton displays a cardless toolbar-shaped placeholder
- **AND** the page-level skeleton displays a single chart surface placeholder
- **AND** the page-level skeleton does not display the removed right-side summary rail
- **AND** the page-level skeleton does not display a main card shell around the toolbar

#### Scenario: Page skeleton toolbar shape
- **WHEN** the page-level skeleton displays toolbar placeholders
- **THEN** the leading placeholder mirrors the asset select width rhythm
- **AND** the trailing placeholders mirror the timeframe select, event switch, refresh button, and freshness text positions

#### Scenario: Page skeleton chart surface shape
- **WHEN** the page-level skeleton displays the chart surface placeholder
- **THEN** the placeholder uses the same top spacing and rounded chart surface rhythm as the final market chart surface

### Requirement: Chart-level candle loading skeleton
The system SHALL render a chart-level skeleton inside the mounted workbench when candle data is loading.

#### Scenario: Candle data is loading after workbench mount
- **WHEN** the user changes asset or timeframe and candle data is loading
- **THEN** the existing toolbar remains visible
- **AND** only the chart/data region is replaced by the chart-level skeleton

#### Scenario: Chart skeleton avoids stale metadata header
- **WHEN** the chart-level skeleton is rendered
- **THEN** it does not render fake in-chart symbol, timeframe, update-time, or metadata header pills
- **AND** it mirrors the chart canvas area and optional lower chart pane instead

#### Scenario: Annotation rail skeleton follows annotation mode
- **WHEN** the chart-level skeleton is rendered with annotation layer enabled
- **THEN** it includes a compact bottom event rail skeleton
- **AND** the rail skeleton mirrors the final event rail height and spacing

#### Scenario: Annotation rail skeleton is omitted when disabled
- **WHEN** the chart-level skeleton is rendered with annotation layer disabled
- **THEN** it does not render an event rail skeleton
