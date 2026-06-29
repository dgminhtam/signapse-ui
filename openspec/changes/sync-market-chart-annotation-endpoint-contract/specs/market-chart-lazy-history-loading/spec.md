## MODIFIED Requirements

### Requirement: Lazy older candle loading
The system SHALL load older market chart candles when users navigate toward the oldest currently loaded candle range.

#### Scenario: Trigger older history load
- **WHEN** an authorized user pans the market chart toward the oldest loaded candles
- **THEN** the system requests an older candle window for the selected watchlist asset and timeframe

#### Scenario: Use existing candle endpoint
- **WHEN** the system requests an older candle window
- **THEN** it calls `GET /market-charts/candles` through the authenticated market chart action
- **AND** it sends the selected watchlist asset `assetId`, current `timeframe`, computed `from`, and computed `to`
- **AND** it does not send `includeAnnotations`

#### Scenario: Compute older range from loaded data
- **WHEN** the system builds an older candle request
- **THEN** `to` is before the oldest loaded candle time
- **AND** `from` is computed from `to` using a timeframe-aware lazy history window

#### Scenario: Preserve route state
- **WHEN** lazy historical loading occurs
- **THEN** the route URL continues to include only `assetId` and `timeframe` for chart state
- **AND** the route URL does not add `from`, `to`, `symbol`, cursor, or lazy-load parameters

#### Scenario: Keep manual time controls hidden
- **WHEN** lazy historical loading is available
- **THEN** the market chart workbench still does not expose editable `from` or `to` controls

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
