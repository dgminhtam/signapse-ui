# news-article-source-attribution-contract Specification

## Purpose

Define the canonical article-owned source snapshot used across frontend API contracts and source renderers.

## Requirements

### Requirement: News article responses use the article-owned source snapshot
The frontend SHALL model `sourceName` as the canonical publisher attribution on news article list and detail responses and SHALL NOT retain `newsOutletId` or `newsOutletName` compatibility fields.

#### Scenario: News article list response is consumed
- **WHEN** the backend returns a news article list item with `sourceName`
- **THEN** the frontend preserves and displays that source snapshot in the existing source column

#### Scenario: News article detail response is consumed
- **WHEN** the backend returns a news article detail response with `sourceName`
- **THEN** the full detail and quick-detail surfaces display the same source snapshot in their provenance content

#### Scenario: Removed article fields are reviewed
- **WHEN** frontend news article contracts are inspected
- **THEN** they do not declare or read `newsOutletId` or `newsOutletName`

### Requirement: Evidence contracts preserve source attribution
The frontend SHALL model event evidence and market-query evidence publisher attribution with `sourceName`.

#### Scenario: Event evidence is displayed
- **WHEN** event detail or event quick detail receives news evidence with `sourceName`
- **THEN** the existing evidence source display uses that value

#### Scenario: Market-query evidence is parsed
- **WHEN** the market-query response parser receives evidence with `sourceName`
- **THEN** validation preserves the field for downstream consumers

### Requirement: Graph article metadata uses sourceName
The frontend SHALL validate and inspect news article graph metadata through `sourceName` rather than a live outlet field.

#### Scenario: Graph response is parsed
- **WHEN** a graph node contains `metadata.sourceName`
- **THEN** graph response validation preserves the value

#### Scenario: Graph node is inspected
- **WHEN** a user selects a news article node with parsed source metadata
- **THEN** the inspector shows `sourceName` in its existing publisher/source row

### Requirement: Frontend API documentation reflects the source snapshot contract
The checked-in OpenAPI snapshot SHALL describe `sourceName` consistently across its published article, event-evidence, and graph schemas, and the frontend API mapping ledger SHALL also record the source-aligned backend market-query DTO.

#### Scenario: OpenAPI snapshot is refreshed
- **WHEN** `docs/api_mapping.json` is regenerated from the backend version containing the source snapshot change
- **THEN** the four published affected schemas expose `sourceName` with generated requiredness and nullability

#### Scenario: API mapping is reviewed after integration
- **WHEN** `docs/APIMAPPING.md` describes article, event evidence, market-query evidence, or graph metadata
- **THEN** it records the `sourceName` contract, notes that the market-query DTO is backend-source-backed rather than an OpenAPI component, and records the matching frontend integration status
