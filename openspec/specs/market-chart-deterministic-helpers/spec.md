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

### Requirement: Count-back loading policy is deterministic
The system SHALL provide vendor-free pure helpers that build valid count-back candle requests, derive displayed candle intervals, and classify successful page outcomes deterministically.

#### Scenario: Create initial count-back request
- **WHEN** the helper receives a valid watchlist asset, timeframe, and current request time
- **THEN** it returns a request with `assetId`, `timeframe`, exclusive `to`, and the configured initial `countBack`
- **AND** `to` is the UTC end boundary of the candle bucket containing the request time
- **AND** four-hour buckets begin at `00:00Z`, `04:00Z`, `08:00Z`, `12:00Z`, `16:00Z`, or `20:00Z`
- **AND** weekly buckets begin at ISO Monday `00:00Z` and monthly buckets begin on day 1 at `00:00Z`
- **AND** it does not include `from`

#### Scenario: Enforce count-back bounds
- **WHEN** a caller attempts to create or validate a count-back request outside the inclusive range `1` through `1000`
- **THEN** the helper or request validation rejects the request before it reaches the backend transport

#### Scenario: Classify a short non-empty page as loaded
- **WHEN** a successful count-back page contains one or more valid candles but fewer than the requested `countBack`
- **THEN** the helper classifies the page as loaded and still pageable
- **AND** it does not classify the page as exhausted

#### Scenario: Classify an exhausted page
- **WHEN** a successful count-back page explicitly contains `candles=[]`
- **AND** its response `from` and `to` each equal the exclusive request anchor
- **THEN** the helper classifies the page as exhausted candle history

#### Scenario: Classify a paging-contract violation as retryable
- **WHEN** a non-empty older page yields no valid timestamp strictly before the prior oldest candle after normalization and de-duplication
- **THEN** the helper classifies the result as retryable and not exhausted

#### Scenario: Classify a failed page as retryable
- **WHEN** a count-back request fails or its response is invalid
- **THEN** the helper classifies the result as retryable and not exhausted

#### Scenario: Derive displayed candle interval
- **WHEN** the helper receives one or more valid normalized candles, a timeframe, and the count-back anchor
- **THEN** it returns an interval beginning at the earliest candle
- **AND** it returns an exclusive end at the latest displayed candle bucket boundary clamped to the anchor when needed
- **AND** it uses a retained `partial` flag to clamp a forming latest candle to the count-back anchor

#### Scenario: Empty candles have no displayed interval
- **WHEN** the helper receives no valid candles
- **THEN** it returns no displayed candle interval

### Requirement: History helpers compute lazy-load requests correctly
The system SHALL provide pure functions for computing older count-back requests, filtering genuinely older candles, and determining the oldest loaded timestamp, without importing chart-vendor types.

#### Scenario: Create older history request computes an exclusive count-back page
- **WHEN** `createOlderHistoryRequest` receives an oldest candle timestamp and a valid timeframe
- **THEN** it returns a count-back request with `to` equal to that oldest timestamp as an exclusive boundary
- **AND** it uses the configured older-page count for the timeframe
- **AND** it does not include `from`

#### Scenario: Create older history request returns null without an oldest candle
- **WHEN** `createOlderHistoryRequest` cannot receive a finite oldest candle timestamp
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
- **THEN** tests cover: initial and older count-back request creation for every timeframe, UTC end-boundary rules including ISO-week boundaries, exclusive anchors, count bounds, short non-terminal pages, exact-empty exhaustion, retryable failures and paging-contract violations, partial-candle displayed intervals, older-candle filtering and de-duplication, and oldest-timestamp extraction from empty and non-empty arrays

#### Scenario: Drawing helper tests
- **WHEN** running the test suite for `market-chart-drawing`
- **THEN** tests cover: tool-to-overlay-name mapping for all 30 tools, palette-to-tool lookup, and drawing group ID generation
