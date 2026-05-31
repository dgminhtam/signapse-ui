## MODIFIED Requirements

### Requirement: Lazy annotation history
The system SHALL keep annotation markers and controls aligned with lazily loaded candle history when the annotation layer is enabled.

#### Scenario: Request annotations for older windows
- **WHEN** the system requests older candles for the active chart
- **THEN** the older candle request uses the same default `includeAnnotations=true` contract as the latest candle request

#### Scenario: Merge older annotations
- **WHEN** an older candle response includes `annotations[]`
- **THEN** the system merges those annotations into the loaded annotation set
- **AND** duplicate annotations do not render twice

#### Scenario: Recompute marker placement
- **WHEN** older candles or annotations are merged successfully and the annotation layer is enabled
- **THEN** the system recomputes annotation marker placement against the expanded loaded candle range

#### Scenario: Keep annotation layer disabled
- **WHEN** the annotation layer is disabled and older candle responses include `annotations[]`
- **THEN** the system keeps annotation markers, annotation controls, and annotation empty-state copy hidden
- **AND** the system does not treat hidden marker visibility as a backend payload opt-out
