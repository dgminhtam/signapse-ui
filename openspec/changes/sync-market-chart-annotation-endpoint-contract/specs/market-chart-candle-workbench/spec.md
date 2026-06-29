## MODIFIED Requirements

### Requirement: Latest candle API integration
The system SHALL define market chart frontend types, validation, and authenticated action for the backend candle bridge while hiding backend-only time params from the user.

#### Scenario: Fetch authenticated candle data
- **WHEN** the workbench needs candle data for the selected watchlist asset
- **THEN** the system calls the backend candle endpoint through `fetchAuthenticated()`

#### Scenario: Build latest rolling candle request
- **WHEN** the system requests candles
- **THEN** it sends flat query parameters `assetId`, `timeframe`, `from`, and `to` to `GET /market-charts/candles`
- **AND** it does not send `includeAnnotations`
- **AND** `assetId` is the selected watchlist item's numeric asset id
- **AND** `to` is computed from the current request time
- **AND** `from` is computed from `to` using the current market chart rolling-window calculation

#### Scenario: Refresh uses current time
- **WHEN** the user refreshes or re-requests the current chart
- **THEN** the system recomputes `to` from the latest current time instead of reusing a stale timestamp

#### Scenario: Parse candle response
- **WHEN** the backend returns a candle response
- **THEN** the system validates and maps `asset`, `timeframe`, `from`, `to`, and `candles[]` before rendering
- **AND** it does not require or parse `annotations[]` from the candle response
- **AND** if a compatibility `symbol` field is present, the system treats it as optional metadata and prefers `asset.symbol` for UI display

#### Scenario: Keep annotations outside candle payload
- **WHEN** chart annotations are needed
- **THEN** the system obtains them through the annotation marker capability instead of the candle response

#### Scenario: Handle backend error
- **WHEN** the backend rejects the request or provider fetch fails
- **THEN** the system shows a non-crashing error state with retry guidance in Vietnamese
