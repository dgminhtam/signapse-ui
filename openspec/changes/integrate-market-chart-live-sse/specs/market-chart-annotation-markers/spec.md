## MODIFIED Requirements

### Requirement: Annotation layer control
The system SHALL let users enable or disable market chart annotation markers from the market chart workbench.

#### Scenario: Enable annotation layer
- **WHEN** a user enables the annotation layer for a selected watchlist asset and timeframe
- **THEN** the system displays returned backend annotations as chart markers and annotation detail controls
- **AND** candle requests can use the default `includeAnnotations=true` contract

#### Scenario: Disable annotation layer
- **WHEN** a user disables the annotation layer
- **THEN** the chart does not render annotation markers, annotation popups, annotation controls, or annotation empty-state copy
- **AND** the system does not clear typed annotation payload solely because markers are hidden
- **AND** the default candle request contract remains `includeAnnotations=true`

#### Scenario: Preserve chart identity
- **WHEN** the annotation layer is toggled
- **THEN** the route state continues to identify the chart by `assetId` and `timeframe`
- **AND** the system does not add manual `from`, `to`, or `symbol` controls
