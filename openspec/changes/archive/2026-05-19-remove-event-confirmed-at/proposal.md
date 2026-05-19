## Why

Backend event-related contracts have been simplified again: event responses no longer expose `slug` or `confirmedAt`, evidence is now tied directly to news articles, and adjacent market chart / graph payloads use news-article naming. The frontend still reads several removed fields and the event detail action area needs to match the cleaner operator pattern already used on news article detail.

## What Changes

- Align Events DTOs and UI with the current backend snapshot by removing `slug` and `confirmedAt` from event list/detail handling.
- Rename event evidence fields from generic `artifact*` reads to `newsArticleId`, `newsArticleTitle`, and `newsArticleUrl`, preserving permission-aware links to news article detail and original URLs.
- Update event detail to remove the "Xác nhận lúc" item and remove "Mã sự kiện" plus "Slug" from the technical information section.
- Shorten the detail action labels for asset/theme enrichment and market reaction derivation.
- Group the two event operator actions into a compact action cluster aligned to the right of the detail title, matching the news article detail action pattern.
- Align event-adjacent contracts where the backend renamed source-document/artifact concepts to news articles: market chart annotation evidence `sourceDocumentId` becomes `newsArticleId`, and graph edge kind `source-artifact-event` becomes `news-article-event`.
- Update `docs/APIMAPPING.md` so the API ledger reports the current event evidence, market chart annotation evidence, and graph edge drift accurately.

## Capabilities

### New Capabilities

- `event-current-contract-detail-alignment`: Align Events list/detail and quick detail with the current backend event response shape and the refined detail action layout.
- `event-adjacent-news-article-contracts`: Align event-adjacent frontend contracts for market chart annotation evidence and graph view news article event edges.

### Modified Capabilities

- None.

## Impact

- Event types and presentation: `app/lib/events/definitions.ts`, `app/(main)/events/event-presentation.ts`
- Event list/detail/quick detail: `app/(main)/events/event-list.tsx`, `app/(main)/events/[id]/page.tsx`, `app/(main)/events/event-quick-detail-content.tsx`
- Event action components: `app/(main)/events/event-enrich-button.tsx`, `app/(main)/events/event-market-reaction-button.tsx`
- News article linked event types and display: `app/lib/news-articles/definitions.ts`, `app/(main)/news-articles/*`
- Market chart annotation evidence contract: `app/lib/market-charts/definitions.ts`, `app/(main)/market-charts/*`
- Graph view edge kind contract: `app/lib/graph-view/definitions.ts`, `app/(main)/graph-view/*`
- API integration ledger: `docs/APIMAPPING.md`
