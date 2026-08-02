## Why

Backend commit `f4abd67` decouples durable news articles from mutable news outlet configuration and replaces article-facing `newsOutletId` / `newsOutletName` fields with the first-ingest `sourceName` snapshot. The frontend still reads and validates the removed fields, causing source attribution to disappear across article, event evidence, market query, and graph surfaces.

## What Changes

- **BREAKING** Replace frontend article contracts `newsOutletId` and `newsOutletName` with `sourceName`; do not retain compatibility aliases.
- Align event evidence, market-query evidence, and graph metadata contracts and renderers with the same `sourceName` field.
- Regenerate the checked-in OpenAPI snapshot from the updated backend before finalizing TypeScript optionality and nullability.
- Update API mapping documentation and current OpenSpec requirements to describe article-owned source attribution rather than a live outlet relationship.
- Preserve the existing list, detail, quick-detail, event, and graph layouts and their current missing-source fallback behavior.

## Capabilities

### New Capabilities

- `news-article-source-attribution-contract`: Defines the canonical `sourceName` contract across news article responses, event and market-query evidence, graph metadata, renderers, and frontend-facing API documentation.

### Modified Capabilities

- `news-article-detail-review-alignment`: Changes the detail provenance requirement from live outlet metadata to the article-owned source-name snapshot.
- `news-article-detail-review-ux`: Aligns the visible article provenance and response-field expectations with `sourceName`.
- `news-article-detail-technical-identifier-minimization`: Removes obsolete references to the deleted `newsOutletId` response field while retaining the reader-first metadata policy.

## Impact

- Contract definitions: `app/lib/news-articles`, `app/lib/events`, `app/lib/market-query`, and `app/lib/graph-view`.
- Renderers: news article list/detail/quick detail, event detail/quick detail, and graph inspector.
- Documentation and specs: `docs/api_mapping.json`, `docs/APIMAPPING.md`, and the listed OpenSpec capabilities.
- No API action, news outlet CRUD, layout, dependency, permission, or i18n-key changes are required.
