## MODIFIED Requirements

### Requirement: Lazy older candle loading
The system SHALL load older market chart candles when users navigate toward the oldest currently loaded candle range.

#### Scenario: Trigger older history load
- **WHEN** an authorized user pans the market chart toward the oldest loaded candles
- **THEN** the system requests an older candle window for the selected watchlist asset and timeframe

#### Scenario: Use existing candle endpoint
- **WHEN** the system requests an older candle window
- **THEN** it calls `GET /market-charts/candles` through the authenticated market chart action
- **AND** it sends the selected watchlist asset `assetId`, current `timeframe`, computed `from`, computed `to`, and current `includeAnnotations` value

#### Scenario: Compute older range from loaded data
- **WHEN** the system builds an older candle request
- **THEN** `to` is before the oldest loaded candle time
- **AND** `from` is computed from `to` using this older-history lookback mapping: `1m=1 day`, `5m=1 day`, `15m=1 day`, `30m=2 days`, `1h=4 days`, `1d=75 days`, `1w=385 days`, `1mo=1825 days`

#### Scenario: Preserve route state
- **WHEN** lazy historical loading occurs
- **THEN** the route URL continues to include only `assetId` and `timeframe` for chart state
- **AND** the route URL does not add `from`, `to`, `symbol`, cursor, or lazy-load parameters

#### Scenario: Keep manual time controls hidden
- **WHEN** lazy historical loading is available
- **THEN** the market chart workbench still does not expose editable `from` or `to` controls
