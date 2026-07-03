## ADDED Requirements

### Requirement: API mapping ledger documents split market chart annotations
The system SHALL document the split market chart candle and annotation endpoints from `docs/api_mapping.json` in `docs/APIMAPPING.md`.

#### Scenario: Candle endpoint documents candles-only contract
- **WHEN** `docs/APIMAPPING.md` documents `GET /market-charts/candles`
- **THEN** it lists `assetId`, `timeframe`, `from`, and `to` as the candle request fields
- **AND** it MUST NOT document `includeAnnotations` as a candle request field
- **AND** it MUST NOT document `annotations[]` as part of `MarketChartCandleResponse`

#### Scenario: Annotation endpoint is documented
- **WHEN** `docs/api_mapping.json` includes `GET /market-charts/annotations`
- **THEN** `docs/APIMAPPING.md` records the endpoint, `getAnnotations` operation, `market-chart:read` permission, request fields `assetId`, `from`, and `to`, and array response of `MarketChartAnnotationResponse`

#### Scenario: Frontend integration status is accurate
- **WHEN** frontend code is updated to call the annotation endpoint
- **THEN** `docs/APIMAPPING.md` records the market chart frontend action and affected market chart UI files as integrated
