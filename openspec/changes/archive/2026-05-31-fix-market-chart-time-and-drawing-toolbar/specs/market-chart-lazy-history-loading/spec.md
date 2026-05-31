## MODIFIED Requirements

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

### Requirement: Lazy annotation history
The system SHALL keep annotation markers and controls aligned with lazily loaded candle history when the annotation layer is enabled.

#### Scenario: Request annotations for older windows
- **WHEN** the annotation layer is enabled and the system requests older candles
- **THEN** the older candle request includes `includeAnnotations=true`

#### Scenario: Merge older annotations
- **WHEN** an older candle response includes `annotations[]`
- **THEN** the system merges those annotations into the loaded annotation set
- **AND** duplicate annotations do not render twice

#### Scenario: Recompute marker placement
- **WHEN** older candles or annotations are merged successfully
- **THEN** the system recomputes annotation marker placement against the expanded loaded candle range

#### Scenario: Keep annotation layer disabled
- **WHEN** the annotation layer is disabled and the system requests older candles
- **THEN** the older candle request includes `includeAnnotations=false`
- **AND** the system does not show annotation markers, annotation controls, or annotation empty-state copy for disabled annotations

#### Scenario: Ignore invalid older annotation items
- **WHEN** an older candle response or local lazy-merge collection includes a null, undefined, malformed, duplicate-id, or invalid-time annotation item
- **THEN** the system omits invalid annotation items before sorting, merging, or marker placement
- **AND** valid annotations still merge into the loaded annotation set
- **AND** the chart does not crash with a runtime `.time` read error
