# market-chart-price-precision Specification

## Purpose
Define how frontend asset contracts and market charts consume backend-provided price precision while preserving existing rendering for assets without configured metadata.

## Requirements

### Requirement: Frontend accepts backend asset price precision
The frontend SHALL represent backend `pricePrecision` metadata as a nullable or optional non-negative integer on asset and market-chart asset responses.

#### Scenario: Historical candle response includes precision
- **WHEN** a valid market-chart candle response contains `asset.pricePrecision`
- **THEN** the response parser preserves that value in the loaded chart data

#### Scenario: Live snapshot includes precision
- **WHEN** a valid SSE snapshot contains `asset.pricePrecision`
- **THEN** the shared market-chart asset parser accepts and preserves that value

#### Scenario: Asset metadata omits precision
- **WHEN** an asset response omits `pricePrecision` or returns `null`
- **THEN** the frontend contract accepts the response without inventing a precision value

### Requirement: Chart uses asset-specific price precision
The market chart SHALL configure KLineChart with the selected asset's loaded `pricePrecision`.

#### Scenario: XAU/USD uses two decimal places
- **WHEN** the loaded candle response identifies XAU/USD with `asset.pricePrecision` equal to `2`
- **THEN** the chart configures its price display with precision `2`

#### Scenario: Selected asset precision changes
- **WHEN** a newly loaded asset has a different `pricePrecision` from the previous asset
- **THEN** the existing chart instance updates its symbol configuration with the new precision

### Requirement: Missing precision preserves current behavior
The market chart SHALL use precision `4` only when loaded asset precision is `null` or absent.

#### Scenario: Legacy asset has no configured precision
- **WHEN** the selected asset has no usable `pricePrecision`
- **THEN** the chart continues rendering with precision `4`

### Requirement: Chart precision does not depend on watchlist metadata
The market chart SHALL be able to apply asset precision from candle metadata without requiring an `assetPricePrecision` field from the watchlist response.

#### Scenario: Watchlist item has no precision field
- **WHEN** a user selects a current watchlist asset and its candle response provides `asset.pricePrecision`
- **THEN** the chart uses the candle response precision successfully
