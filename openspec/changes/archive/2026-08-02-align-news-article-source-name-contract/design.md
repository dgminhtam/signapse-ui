## Context

Backend commit `f4abd67` makes `NewsArticle.sourceName` the durable first-ingest publisher snapshot and removes the persisted relation to `NewsOutlet`. The breaking public OpenAPI change affects `NewsArticleListResponse`, `NewsArticleResponse`, `EventEvidenceSummaryResponse`, and `GraphNodeMetadata`; the backend-only `MarketQueryEvidenceResponse` DTO changes in source but is not published as an OpenAPI component.

The frontend currently has direct TypeScript contracts for article and event responses plus Zod parsing at the market-query and graph-view boundaries. Renderers still read the old publisher field, while `docs/api_mapping.json` predates the backend commit. The migration must preserve the current UI composition and missing-source fallbacks without adding a compatibility layer.

## Goals / Non-Goals

**Goals:**

- Make `sourceName` the single frontend field for news article publisher attribution.
- Preserve source attribution through direct fetch types and Zod-parsed response paths.
- Keep article, event, and graph displays behaviorally unchanged apart from reading the canonical field.
- Align the checked-in OpenAPI snapshot, API mapping ledger, and current OpenSpec requirements.

**Non-Goals:**

- Changing news outlet CRUD, article ingestion, backend data migration, API actions, permissions, routes, or layout.
- Retaining aliases, fallback reads, dual-field DTOs, or response adapters for the removed contract.
- Renaming existing i18n keys or changing visible source/outlet copy unless the regenerated contract reveals a separate product requirement.
- Cleaning unrelated API drift such as the removed crawl-full-content endpoint.

## Decisions

### Refresh the OpenAPI snapshot before finalizing frontend types

Regenerate `docs/api_mapping.json` from the backend version containing commit `f4abd67`, then use the four published schemas to decide TypeScript optionality and nullability. Use the matching backend DTO source for `MarketQueryEvidenceResponse`, which is not reachable from the generated OpenAPI component graph.

Manually patching only the minified schema fragments was rejected because it can miss related generated changes and makes the snapshot appear authoritative without actually regenerating it.

### Rename at existing contract boundaries without an adapter

Replace the removed fields directly in the four existing definition modules. Update both the interface and Zod property in market query and graph view so parsing preserves `sourceName`. Do not introduce a mapper, shared publisher type, or compatibility alias: the backend change is intentionally breaking and each current contract has only one field to rename.

### Update renderers in place

Article list, article detail, article quick detail, event detail, event quick detail, and the graph inspector will read `sourceName` in their existing locations. Existing layout, fallback text, links, and formatting remain intact. The graph inspector's local variable may be renamed for clarity, but no component extraction or visual redesign is needed.

### Treat source attribution as one cross-surface invariant

The new `news-article-source-attribution-contract` capability owns the shared requirement that article, evidence, market-query, and graph payloads expose `sourceName` without legacy aliases. Existing reader-first detail capabilities receive narrow delta updates only where their provenance or removed-field wording changes.

### Update current docs, not historical archives

Regenerated OpenAPI and `docs/APIMAPPING.md` will describe the integrated contract across article, event, market-query, and graph sections. Main specs and this active change are updated; existing archived OpenSpec changes remain immutable history.

## Risks / Trade-offs

- [Frontend types are updated against a stale generated schema] -> Regenerate and inspect the five affected schemas before editing TypeScript.
- [A missed Zod property silently strips source attribution] -> Update interface and schema together, then statically search all runtime code for removed field names.
- [Graph secondary labels mask stale inspector metadata] -> Verify the inspector reads parsed `metadata.sourceName` directly.
- [Frontend and backend deploy out of order] -> Deploy the frontend with the matching backend contract; rollback by restoring the previous matching frontend/backend pair rather than adding aliases.

## Migration Plan

1. Refresh and inspect the backend OpenAPI snapshot.
2. Update frontend contracts and Zod schemas in one change.
3. Update all known renderers in the same change so no surface temporarily loses attribution.
4. Sync API mapping documentation and OpenSpec requirements.
5. Run static contract searches, OpenSpec validation, typecheck, and lint before deployment.

## Open Questions

None.
