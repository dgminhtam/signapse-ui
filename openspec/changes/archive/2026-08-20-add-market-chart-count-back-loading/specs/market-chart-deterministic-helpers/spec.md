## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: History helpers compute lazy-load requests correctly
The system SHALL provide pure functions for computing older count-back requests, filtering genuinely older candles, and determining the oldest loaded timestamp, without importing chart-vendor types.

#### Scenario: Create older history request computes an exclusive count-back page
- **WHEN** `createOlderHistoryRequest` receives an oldest candle timestamp and a valid timeframe
- **THEN** it returns a count-back request with `to` equal to that oldest timestamp as an exclusive boundary
- **AND** it uses the configured older-page count for the timeframe
- **AND** it does not include `from`

#### Scenario: Create older history request returns null without an oldest candle
- **WHEN** `createOlderHistoryRequest` cannot receive a finite oldest candle timestamp
- **THEN** the function returns `null`

#### Scenario: Get new older candles filters by timestamp
- **WHEN** `getNewOlderCandles` receives incoming candles and an oldest timestamp
- **THEN** the function returns only incoming candles whose timestamp is strictly before the oldest timestamp and not already present in the current candles

#### Scenario: Get new older candles deduplicates
- **WHEN** `getNewOlderCandles` receives incoming candles with duplicate timestamps
- **THEN** the function returns each timestamp at most once

#### Scenario: Get oldest loaded timestamp from empty array
- **WHEN** `getOldestLoadedTimestamp` receives an empty candle array
- **THEN** the function returns `null`

### Requirement: View-model modules have deterministic unit tests
The system SHALL include unit tests for every extracted view-model module, covering core logic, edge cases, boundary values, and documented behavior from existing specs.

#### Scenario: Annotation grouping tests
- **WHEN** running the test suite for `market-chart-annotations`
- **THEN** tests cover grouping annotations into the nearest candle, omitting annotations outside the candle range, computing MIXED direction from mixed inputs, and assigning high priority based on count or severity

#### Scenario: Candle helper tests
- **WHEN** running the test suite for `market-chart-candle-helpers`
- **THEN** tests cover normalization deduplication and sort, live-candle merge (newer, same, older, null), KLineData conversion with valid and invalid inputs, and volume availability checks

#### Scenario: History helper tests
- **WHEN** running the test suite for `market-chart-history-helpers`
- **THEN** tests cover initial and older count-back request creation for every timeframe, UTC end-boundary rules including ISO-week boundaries, exclusive anchors, count bounds, short non-terminal pages, exact-empty exhaustion, retryable failures and paging-contract violations, partial-candle displayed intervals, older-candle filtering and de-duplication, and oldest-timestamp extraction from empty and non-empty arrays

#### Scenario: Drawing helper tests
- **WHEN** running the test suite for `market-chart-drawing`
- **THEN** tests cover tool-to-overlay-name mapping for all 30 tools, palette-to-tool lookup, and drawing group ID generation
