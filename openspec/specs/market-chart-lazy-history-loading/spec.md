# market-chart-lazy-history-loading Specification

## Purpose
TBD - created by archiving change add-market-chart-lazy-history-loading. Update Purpose after archive.
## Requirements
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

### Requirement: Stable chart prepend behavior
The system SHALL prepend older loaded candles without resetting the visible chart workspace.

#### Scenario: Prepend older candles
- **WHEN** an older candle request returns candles that are older than the currently loaded range
- **THEN** the system prepends those candles into the active chart data stream
- **AND** the chart keeps the user's visible viewport stable

#### Scenario: De-duplicate overlapping candles
- **WHEN** an older candle response overlaps candles that are already loaded
- **THEN** the system de-duplicates candles by chart timestamp before applying them
- **AND** duplicate candles do not render twice

#### Scenario: Sort loaded candles
- **WHEN** older candles are applied to the chart
- **THEN** the system provides them to the chart in chronological order

#### Scenario: Avoid full chart reload
- **WHEN** lazy older data is being loaded
- **THEN** the system does not replace the existing chart with the initial loading skeleton
- **AND** the system does not rebuild the chart instance solely because older candles were prepended

#### Scenario: Ignore invalid older candle items
- **WHEN** an older candle response or local lazy-merge collection includes a null, undefined, malformed, or invalid-time candle item
- **THEN** the system omits that item before timestamp de-duplication or prepend
- **AND** valid older candles still merge into the active chart data stream
- **AND** the chart does not crash with a runtime `.time` read error

### Requirement: Older history exhaustion
The system SHALL stop requesting older candle windows when no older data remains available from the backend response stream.

#### Scenario: Empty older response
- **WHEN** an older candle request succeeds with an empty `candles[]`
- **THEN** the system marks older history as exhausted for the active chart identity
- **AND** the system stops requesting older windows until the chart identity resets

#### Scenario: No new candles after de-duplication
- **WHEN** an older candle request returns only candles that are already loaded
- **THEN** the system treats that older request as exhausted for the active chart identity

#### Scenario: Reset exhaustion
- **WHEN** the user changes asset, timeframe, annotation layer state, refreshes the chart, or the workspace watchlist context changes
- **THEN** the older-history exhaustion state resets for the new chart identity

### Requirement: Lazy annotation history
The system SHALL keep annotation markers and controls aligned with lazily loaded candle history when the annotation layer is enabled.

#### Scenario: Request annotations for older windows
- **WHEN** the system successfully requests an older candle window and the annotation layer is enabled
- **THEN** the system requests annotations from `GET /market-charts/annotations` for the same `assetId`, `from`, and `to` window

#### Scenario: Merge older annotations
- **WHEN** an older annotation response includes annotation items
- **THEN** the system merges those annotations into the loaded annotation set
- **AND** duplicate annotations do not render twice

#### Scenario: Recompute marker placement
- **WHEN** older candles or annotations are merged successfully and the annotation layer is enabled
- **THEN** the system recomputes annotation marker placement against the expanded loaded candle range

#### Scenario: Keep annotation layer disabled
- **WHEN** the annotation layer is disabled during lazy older-history loading
- **THEN** the system keeps annotation markers, annotation controls, and annotation empty-state copy hidden
- **AND** the system does not fetch older annotations solely for hidden marker visibility

### Requirement: Lazy loading feedback
The system SHALL provide non-disruptive feedback for lazy historical loading states.

#### Scenario: Older history pending
- **WHEN** an older candle request is pending
- **THEN** the chart remains visible
- **AND** the system shows compact pending feedback that indicates older history is being loaded

#### Scenario: Older history error
- **WHEN** an older candle request fails
- **THEN** the chart keeps the currently loaded candles visible
- **AND** the system shows concise Vietnamese error feedback for the lazy-load failure

#### Scenario: Retry after lazy error
- **WHEN** an older candle request failed and the user later navigates to the older-history boundary again
- **THEN** the system can retry the older-history request for the active chart identity

### Requirement: Lazy loading scope boundaries
The system SHALL keep lazy historical loading scoped to older candles only.

#### Scenario: Do not load future candles
- **WHEN** the user navigates to the newest visible chart edge
- **THEN** the system does not request a future or realtime candle window as part of this change

#### Scenario: Refresh still loads latest window
- **WHEN** the user activates the chart refresh action
- **THEN** the system reloads the latest rolling window using the current time
- **AND** previously lazy-loaded older history is cleared for the refreshed chart identity

#### Scenario: No toolbar expansion
- **WHEN** lazy historical loading is implemented
- **THEN** the system does not add indicator, drawing, screenshot, fullscreen, or TradingView-like toolbar controls as part of this capability

### Requirement: Four-hour charts load older history
The system SHALL build older candle requests for timeframe `4h` using a four-hour interval and a 14-day lookback window.

#### Scenario: User reaches the oldest four-hour candles
- **WHEN** lazy history is triggered for an active `4h` chart
- **THEN** the older request retains timeframe `4h`
- **AND** its `to` boundary is one four-hour interval before the oldest loaded candle
- **AND** its `from` boundary is 14 days before that `to` boundary

#### Scenario: Four-hour older candles are returned
- **WHEN** an older `4h` request succeeds
- **THEN** valid new candles are merged in chronological order
- **AND** existing de-duplication and exhaustion behavior remains in effect
