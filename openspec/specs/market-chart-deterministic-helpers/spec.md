# market-chart-deterministic-helpers Specification

## Purpose
TBD - created by archiving change extract-market-chart-view-model. Update Purpose after archive.
## Requirements
### Requirement: Candle helpers are vendor-free pure functions
The system SHALL provide candle normalization, merge, validation, and KLineData conversion as pure functions that import no chart-vendor types and are deterministically testable without a browser or chart engine.

#### Scenario: Normalize candles deduplicates by timestamp
- **WHEN** `normalizeCandleItems` receives an array of candle items where multiple items share the same millisecond timestamp
- **THEN** the function returns exactly one item per timestamp, keeping the last occurrence in iteration order

#### Scenario: Normalize candles sorts ascending
- **WHEN** `normalizeCandleItems` receives an unsorted array of candle items
- **THEN** the returned array is sorted by timestamp ascending

#### Scenario: Merge candles merges and normalizes
- **WHEN** `mergeCandleItems` receives two arrays with overlapping timestamps
- **THEN** the result is deduplicated (newer overwrites older at same timestamp) and sorted ascending

#### Scenario: Merge live candle appends newer timestamp
- **WHEN** `mergeLiveCandleItem` receives a live candle whose timestamp is after the newest historical candle timestamp
- **THEN** the live candle is appended to the result

#### Scenario: Merge live candle overwrites same timestamp
- **WHEN** `mergeLiveCandleItem` receives a live candle whose timestamp matches the newest historical candle timestamp
- **THEN** the live candle replaces the matching historical candle

#### Scenario: Merge live candle ignores older timestamp
- **WHEN** `mergeLiveCandleItem` receives a live candle whose timestamp is before the newest historical candle timestamp
- **THEN** the live candle is not included in the result

#### Scenario: Merge live candle handles null
- **WHEN** `mergeLiveCandleItem` receives a null live candle
- **THEN** the function returns normalized historical candles unchanged

#### Scenario: Create KLineData converts valid candles
- **WHEN** `createKLineData` receives valid candle items with open, high, low, close, and optional volume
- **THEN** the function returns an array of objects with `timestamp` (milliseconds), `open`, `high`, `low`, `close`, and `volume` (omitted when null or non-finite)

#### Scenario: Create KLineData skips invalid candles
- **WHEN** `createKLineData` receives a candle item with an unparseable time
- **THEN** the function omits that candle from the result without throwing

#### Scenario: Validate candle rejects invalid time
- **WHEN** `isValidMarketChartCandle` receives an object with an unparseable `time` field
- **THEN** the function returns false

#### Scenario: Validate candle requires open, high, low, close
- **WHEN** `isValidMarketChartCandle` receives an object missing open, high, low, or close
- **THEN** the function returns false

### Requirement: History helpers compute lazy-load requests correctly
The system SHALL provide pure functions for computing older-history fetch requests, filtering genuinely older candles, and determining the oldest loaded timestamp, without importing chart-vendor types.

#### Scenario: Create older history request computes valid time range
- **WHEN** `createOlderHistoryRequest` receives an oldest candle timestamp and a valid timeframe
- **THEN** the function returns a `MarketChartCandleRequest` with `from` earlier than `to`, and `to` set to one interval before the oldest timestamp

#### Scenario: Create older history request returns null when range is invalid
- **WHEN** `createOlderHistoryRequest` produces a computed `from` that is not before computed `to`
- **THEN** the function returns null

#### Scenario: Get new older candles filters by timestamp
- **WHEN** `getNewOlderCandles` receives incoming candles and an oldest timestamp
- **THEN** the function returns only incoming candles whose timestamp is strictly before the oldest timestamp and not already present in the current candles

#### Scenario: Get new older candles deduplicates
- **WHEN** `getNewOlderCandles` receives incoming candles with duplicate timestamps
- **THEN** the function returns each timestamp at most once

#### Scenario: Get oldest loaded timestamp from empty array
- **WHEN** `getOldestLoadedTimestamp` receives an empty candle array
- **THEN** the function returns null

### Requirement: Theme helpers expose palette and styles without vendor imports
The system SHALL provide chart theme palettes and style factories as pure functions that do not import klinecharts types, enabling the canvas adapter to apply them at the boundary.

#### Scenario: Light and dark palettes are defined
- **WHEN** `getMarketChartThemePalette` is called with `"light"` or `"dark"`
- **THEN** the function returns a complete `MarketChartThemePalette` with defined values for axis, crosshairBackground, crosshairText, down, drawing, drawingMuted, drawingSelected, grid, noChange, up, volumeDown, volumeNoChange, and volumeUp

#### Scenario: Theme mode resolves unknown to light
- **WHEN** `resolveChartThemeMode` receives an undefined or unrecognized theme string
- **THEN** the function returns `"light"`

#### Scenario: Create chart styles returns complete styles object
- **WHEN** `createChartStyles` receives a valid `MarketChartThemePalette`
- **THEN** the function returns a styles object with grid, candle, indicator, xAxis, yAxis, crosshair, and overlay sections, each with font family resolved from CSS variables

### Requirement: Period helpers map timeframe to klinecharts Period without vendor leaks in public API
The system SHALL provide timeframe-to-Period mapping and KLineChart locale registration as helpers that do not force callers outside the canvas adapter to import klinecharts types.

#### Scenario: Minute timeframes map correctly
- **WHEN** `createKLinePeriod` receives `"1m"`, `"5m"`, `"15m"`, or `"30m"`
- **THEN** the function returns `{ type: "minute", span: N }` where N matches the timeframe

#### Scenario: Hour, day, week, month timeframes map correctly
- **WHEN** `createKLinePeriod` receives `"1h"`, `"1d"`, `"1w"`, or `"1mo"`
- **THEN** the function returns the corresponding Period with correct type and span

### Requirement: No duplicate annotation color helper
The system SHALL have exactly one public function for annotation marker color class resolution, exported from `market-chart-annotations.ts`.

#### Scenario: Canvas imports annotation colors from annotations module
- **WHEN** the market chart canvas renders annotation markers
- **THEN** it imports `getMarketChartAnnotationColorClassNames` from `./market-chart-annotations`
- **AND** no private duplicate of this function exists in the canvas file

### Requirement: View-model modules have deterministic unit tests
The system SHALL include unit tests for every extracted view-model module, covering core logic, edge cases (empty inputs, null inputs, boundary values), and documented behavior from existing specs.

#### Scenario: Annotation grouping tests
- **WHEN** running the test suite for `market-chart-annotations`
- **THEN** tests cover: grouping annotations into the nearest candle, omitting annotations outside the candle range, computing MIXED direction from mixed inputs, and assigning high priority based on count or severity

#### Scenario: Candle helper tests
- **WHEN** running the test suite for `market-chart-candle-helpers`
- **THEN** tests cover: normalization deduplication and sort, live-candle merge (newer, same, older, null), KLineData conversion with valid and invalid inputs, and volume availability checks

#### Scenario: History helper tests
- **WHEN** running the test suite for `market-chart-history-helpers`
- **THEN** tests cover: older-history request creation for each timeframe, null result for invalid ranges, older-candle filtering and deduplication, and oldest-timestamp extraction from empty and non-empty arrays

#### Scenario: Drawing helper tests
- **WHEN** running the test suite for `market-chart-drawing`
- **THEN** tests cover: tool-to-overlay-name mapping for all 30 tools, palette-to-tool lookup, and drawing group ID generation

