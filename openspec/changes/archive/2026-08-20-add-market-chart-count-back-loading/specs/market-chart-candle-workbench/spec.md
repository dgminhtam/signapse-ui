## MODIFIED Requirements

### Requirement: Latest candle API integration
The system SHALL define market chart frontend types, validation, and an authenticated action for the backend candle bridge while hiding backend-only retrieval parameters from the user.

#### Scenario: Fetch authenticated candle data
- **WHEN** the workbench needs candle data for the selected watchlist asset
- **THEN** the system calls the backend candle endpoint through `fetchAuthenticated()`

#### Scenario: Build latest count-back candle request
- **WHEN** the system requests initial or refreshed candles
- **THEN** it sends flat query parameters `assetId`, `timeframe`, exclusive `to`, and `countBack` to `GET /market-charts/candles`
- **AND** it does not send `from` or `includeAnnotations`
- **AND** `assetId` is the selected watchlist item's numeric asset id
- **AND** `to` is the UTC end boundary of the candle bucket containing the current request time
- **AND** weekly boundaries use ISO Monday `00:00:00Z`
- **AND** `countBack` uses this initial mapping: `1m=1000`, `5m=288`, `15m=192`, `30m=192`, `1h=720`, `4h=180`, `1d=150`, `1w=110`, `1mo=120`
- **AND** `countBack` is a positive integer no greater than `1000`

#### Scenario: Do not fall back to a calendar-time request
- **WHEN** the backend candle request fails or returns no candles
- **THEN** the system does not retry the same chart load with `from` and `to` calendar-time parameters

#### Scenario: Refresh uses a fresh aligned boundary
- **WHEN** the user refreshes or re-requests the current chart
- **THEN** the system recomputes exclusive `to` as the UTC end boundary for the latest current request time instead of reusing a stale timestamp

#### Scenario: Parse candle response
- **WHEN** the backend returns a candle response
- **THEN** the system validates and maps `provider`, optional `symbol`, `asset`, `timeframe`, `from`, `to`, and `candles[]` before rendering
- **AND** it requires `candles[]` to be explicitly present rather than defaulting a missing field to an empty result
- **AND** it retains optional candle `partial` flags
- **AND** if a compatibility `symbol` field is present, the system treats it as optional metadata and prefers `asset.symbol` for UI display

#### Scenario: Render a partial historical candle
- **WHEN** a valid candle response contains a candle with `partial=true`
- **THEN** the system renders that candle as available price data
- **AND** it does not forward-fill, replace, or discard the candle solely because it is partial

#### Scenario: Keep annotations outside the candle payload
- **WHEN** the workbench loads annotations for a non-empty candle result
- **THEN** it loads them through the annotation capability for the displayed candle interval
- **AND** it does not require `annotations[]` in the candle response

#### Scenario: Handle backend error
- **WHEN** the backend rejects the request or provider fetch fails
- **THEN** the system shows a non-crashing error state with retry guidance in Vietnamese

### Requirement: Workbench states
The system SHALL provide clear visual states for the market chart workbench lifecycle.

#### Scenario: First run with watchlist assets
- **WHEN** the user opens the workbench without query params and the watchlist has assets
- **THEN** the system either auto-selects a valid watchlist asset or prompts the user to choose one without exposing a symbol input

#### Scenario: Loading watchlist data
- **WHEN** watchlist assets are pending
- **THEN** the system shows a skeleton or spinner state that mirrors the final selector and chart shell

#### Scenario: Loading candle data
- **WHEN** a candle request is pending
- **THEN** the system shows a skeleton or spinner state that preserves the selected asset and timeframe context

#### Scenario: No available candle data
- **WHEN** a successful count-back response explicitly contains `candles=[]` and its `from` and `to` both equal the requested anchor
- **THEN** the system shows a localized no-data state that preserves the selected asset and timeframe context
- **AND** the state provides a retry action
- **AND** the system does not synthesize a candle from a live quote or request annotations or calendar events for that empty result

#### Scenario: Do not classify an API error as empty history
- **WHEN** the backend rejects the request or the provider fetch fails
- **THEN** the system shows the error state rather than the no-data state
- **AND** it does not infer candle-history exhaustion from that error

#### Scenario: Do not classify a malformed response as empty history
- **WHEN** a candle response omits `candles[]`, contains invalid candles, or has an empty array whose `from` or `to` does not equal the requested anchor
- **THEN** the system treats the response as a retryable response error rather than available-empty history
