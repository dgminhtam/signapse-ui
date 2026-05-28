## MODIFIED Requirements

### Requirement: Annotation layer control
The system SHALL enable market chart annotation markers by default and let users disable or re-enable them from the market chart workbench.

#### Scenario: Annotation layer defaults to enabled
- **WHEN** a user opens the market chart workbench for a selected watchlist asset and timeframe
- **THEN** the annotation layer is enabled by default
- **AND** the system requests candle data from `GET /market-charts/candles` with `includeAnnotations=true`

#### Scenario: Enable annotation layer
- **WHEN** a user enables the annotation layer for a selected watchlist asset and timeframe
- **THEN** the system requests candle data from `GET /market-charts/candles` with `includeAnnotations=true`

#### Scenario: Disable annotation layer
- **WHEN** a user disables the annotation layer
- **THEN** the system requests or refreshes candle data with `includeAnnotations=false`
- **AND** the chart does not render annotation markers

#### Scenario: Preserve chart identity
- **WHEN** the annotation layer is toggled
- **THEN** the route state continues to identify the chart by `assetId` and `timeframe`
- **AND** the system does not add manual `from`, `to`, or `symbol` controls
