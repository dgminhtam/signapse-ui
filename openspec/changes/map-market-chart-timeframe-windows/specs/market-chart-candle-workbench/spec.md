## MODIFIED Requirements

### Requirement: Latest candle API integration
The system SHALL define market chart frontend types, validation, and authenticated action for the backend candle bridge while hiding backend-only time params from the user.

#### Scenario: Fetch authenticated candle data
- **WHEN** the workbench needs candle data for the selected watchlist asset
- **THEN** the system calls the backend candle endpoint through `fetchAuthenticated()`

#### Scenario: Build latest rolling candle request
- **WHEN** the system requests candles
- **THEN** it sends flat query parameters `assetId`, `timeframe`, `from`, `to`, and `includeAnnotations` to `GET /market-charts/candles`
- **AND** `assetId` is the selected watchlist item's numeric asset id
- **AND** `to` is computed from the current request time
- **AND** `from` is computed from `to` using this initial lookback mapping: `1m=1 day`, `5m=1 day`, `15m=2 days`, `30m=4 days`, `1h=7 days`, `1d=150 days`, `1w=770 days`, `1mo=3650 days`
- **AND** `includeAnnotations` defaults to `true` when the caller does not explicitly provide a value
- **AND** the default candle request does not derive `includeAnnotations=false` solely because annotation markers are hidden in the UI

#### Scenario: Refresh uses current time
- **WHEN** the user refreshes or re-requests the current chart
- **THEN** the system recomputes `to` from the latest current time instead of reusing a stale timestamp

#### Scenario: Parse candle response
- **WHEN** the backend returns a candle response
- **THEN** the system validates and maps `provider`, `asset`, `timeframe`, `from`, `to`, `candles[]`, and `annotations[]` before rendering
- **AND** if a compatibility `symbol` field is present, the system treats it as optional metadata and prefers `asset.symbol` for UI display

#### Scenario: Parse annotations as chart payload
- **WHEN** the backend returns `annotations[]`
- **THEN** the system keeps the annotation payload typed and non-crashing
- **AND** marker and detail visibility are governed by the annotation marker capability

#### Scenario: Handle backend error
- **WHEN** the backend rejects the request or provider fetch fails
- **THEN** the system shows a non-crashing error state with retry guidance in Vietnamese
