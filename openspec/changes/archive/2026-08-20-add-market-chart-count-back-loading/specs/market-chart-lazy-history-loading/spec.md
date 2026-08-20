## MODIFIED Requirements

### Requirement: Lazy older candle loading
The system SHALL load older available market chart candles when users navigate toward the oldest currently loaded candle range.

#### Scenario: Trigger older history load
- **WHEN** an authorized user pans the market chart toward the oldest loaded candles
- **THEN** the system requests an older count-back page for the selected watchlist asset and timeframe

#### Scenario: Use existing candle endpoint
- **WHEN** the system requests an older candle page
- **THEN** it calls `GET /market-charts/candles` through the authenticated market chart action
- **AND** it sends the selected watchlist asset `assetId`, current `timeframe`, the oldest loaded candle timestamp as exclusive `to`, and the configured older `countBack`
- **AND** it does not send `from` or `includeAnnotations`

#### Scenario: Compute older count-back page from loaded data
- **WHEN** the system builds an older candle request
- **THEN** `to` equals the oldest loaded candle time as an exclusive boundary
- **AND** `countBack` uses this older-page mapping: `1m=1000`, `5m=288`, `15m=96`, `30m=96`, `1h=336`, `4h=84`, `1d=75`, `1w=55`, `1mo=60`

#### Scenario: Preserve route state
- **WHEN** lazy historical loading occurs
- **THEN** the route URL continues to include only `assetId` and `timeframe` for chart state
- **AND** the route URL does not add `from`, `to`, `symbol`, cursor, or lazy-load parameters

#### Scenario: Keep manual time controls hidden
- **WHEN** lazy historical loading is available
- **THEN** the market chart workbench still does not expose editable `from` or `to` controls

### Requirement: Older history exhaustion
The system SHALL stop requesting older count-back pages only when exhausted candle history is confirmed for the active chart identity.

#### Scenario: Short successful older page
- **WHEN** an older count-back request succeeds with fewer valid returned candles than its requested `countBack`
- **THEN** the system merges the returned valid candles in chronological order
- **AND** it keeps older history pageable for the active chart identity
- **AND** the next user-triggered older request uses the returned page's oldest candle time as exclusive `to`
- **AND** it does not automatically issue another request solely because the page is short

#### Scenario: Empty older response
- **WHEN** an older count-back request succeeds with an empty `candles[]`
- **AND** the response `from` and `to` both equal the request's exclusive anchor
- **THEN** the system marks older history as exhausted for the active chart identity

#### Scenario: No strictly older candles after de-duplication
- **WHEN** a non-empty older count-back response yields no valid candle timestamp strictly before the existing oldest candle after normalization and de-duplication
- **THEN** the system treats that response as a retryable response-contract error
- **AND** it does not mark history as exhausted or automatically issue another older request

#### Scenario: Older-page failure remains retryable
- **WHEN** an older count-back request fails or returns invalid data
- **THEN** the system does not mark history as exhausted
- **AND** a later navigation to the older-history boundary can retry the request for the active chart identity

#### Scenario: Reset exhaustion
- **WHEN** the user changes asset, timeframe, refreshes the chart, or the workspace watchlist context changes
- **THEN** the older-history exhaustion state resets for the new chart identity

### Requirement: Lazy annotation history
The system SHALL keep annotation markers and controls aligned with the displayed candle interval when the annotation layer is enabled.

#### Scenario: Request annotations for older available candles
- **WHEN** an older count-back request returns one or more valid candles and the annotation layer is enabled
- **THEN** the system derives that page's displayed candle interval from the returned candles
- **AND** it requests annotations from `GET /market-charts/annotations` for that interval's `assetId`, `from`, and exclusive `to`

#### Scenario: Do not request annotations for an empty page
- **WHEN** an older count-back request succeeds without valid candles
- **THEN** the system does not request annotations for that page

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

### Requirement: Four-hour charts load older history
The system SHALL build older candle requests for timeframe `4h` using an exclusive count-back page.

#### Scenario: User reaches the oldest four-hour candles
- **WHEN** lazy history is triggered for an active `4h` chart
- **THEN** the older request retains timeframe `4h`
- **AND** its exclusive `to` boundary equals the oldest loaded candle timestamp
- **AND** it requests `countBack=84`

#### Scenario: Four-hour older candles are returned
- **WHEN** an older `4h` request succeeds
- **THEN** valid new candles are merged in chronological order
- **AND** existing de-duplication and exhaustion behavior remains in effect
