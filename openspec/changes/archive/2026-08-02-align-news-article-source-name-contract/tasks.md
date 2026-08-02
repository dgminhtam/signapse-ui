## 1. Refresh Backend Contract Snapshot

- [x] 1.1 Regenerate `docs/api_mapping.json` from the backend version containing commit `f4abd67` instead of manually patching the minified snapshot.
- [x] 1.2 Inspect the four published affected schemas in the refreshed snapshot, record their exact `sourceName` requiredness and nullability, and confirm `MarketQueryEvidenceResponse.sourceName` from backend DTO source because that type is not published as an OpenAPI component.

## 2. Align Frontend Contracts

- [x] 2.1 Replace `newsOutletId` and `newsOutletName` with snapshot-aligned `sourceName` typing in `app/lib/news-articles/definitions.ts` without compatibility aliases.
- [x] 2.2 Replace evidence publisher typing with `sourceName` in event definitions and in both the market-query interface and Zod response schema.
- [x] 2.3 Replace graph publisher metadata with `sourceName` in both the graph-view interface and Zod metadata schema.

## 3. Align Existing Renderers

- [x] 3.1 Update the news article list, full detail, and quick-detail renderers to read `sourceName` while preserving their current layout and missing-source fallback.
- [x] 3.2 Update event detail and event quick-detail evidence renderers to read `sourceName` without changing evidence composition.
- [x] 3.3 Update the graph node inspector to read parsed `metadata.sourceName`, including renaming its local variable where useful, without changing the graph layout.

## 4. Synchronize Documentation

- [x] 4.1 Update the news article, event evidence, market-query evidence, graph metadata, and final drift-summary sections in `docs/APIMAPPING.md` to describe the refreshed `sourceName` contract and completed frontend integration.
- [x] 4.2 Remove stale current-documentation claims that `docs/api_mapping.json` still exposes the old outlet-linked article contract; leave archived OpenSpec history unchanged.

## 5. Verify The Migration

- [x] 5.1 Run a static search confirming runtime frontend code and the regenerated OpenAPI snapshot no longer declare or read `newsOutletId` or `newsOutletName` for article source attribution.
- [x] 5.2 Run `pnpm typecheck` and `pnpm lint`, resolving any errors introduced by the contract rename.
- [x] 5.3 Run strict OpenSpec validation for `align-news-article-source-name-contract`.
