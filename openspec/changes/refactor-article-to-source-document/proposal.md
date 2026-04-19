## Why

The frontend still treats backend content ingestion as two legacy domains, `articles` and `economic-calendar`, while the current backend contract has consolidated that data under `source-documents`. This mismatch now creates broken API mappings, stale navigation, and redundant legacy surfaces even though the backend has moved to source-document identifiers.

This change is needed now because the repo already has frontend surfaces that no longer map to the current API snapshot. Refactoring the domain model at the proposal stage lets us realign content management, wiki integration, and source configuration before more frontend behavior is built on the legacy contract.

## What Changes

- Refactor the frontend content domain from `article`-centric DTOs and routes to `source-document`-centric DTOs and routes.
- Introduce frontend actions, types, and management screens for `/source-documents`, including list, detail, analyze, delete, and feature-image aligned behavior.
- Rework the current article management UX to either migrate into or be replaced by source-document management.
- Reframe the current economic calendar experience around source documents with `documentType = ECONOMIC_CALENDAR` instead of a separate backend domain.
- **BREAKING** Retire or redirect frontend routes, copy, and navigation that assume `/articles` and `/economic-calendar` remain first-class backend domains.
- Align source configuration forms and DTO mappings so frontend `sources` screens match the current backend schema and ingest-status metadata.

## Capabilities

### New Capabilities
- `source-document-management`: Manage ingested content as source documents across list, detail, analysis, filtering, and document-type-specific presentation.
- `source-configuration-management`: Configure source type, provider, crawl behavior, and ingest metadata using the current backend `sources` schema.

### Modified Capabilities
- None.

## Impact

- Affected frontend content code under `app/api/articles`, `app/lib/articles`, and `app/(main)/articles`, which will be migrated or retired in favor of `source-documents`.
- Affected frontend economic calendar code under `app/api/economic-calendar`, `app/lib/economic-calendar`, and `app/(main)/economic-calendar`, which will need to be retired or rebuilt on top of `source-documents`.
- Affected source management code in `app/api/sources`, `app/lib/sources`, and `app/(main)/sources` because `SourceRequest` and `SourceResponse` no longer match the full backend schema.
- Affected navigation and permission-gated entry points such as `config/site.ts` and any route-level UX that still exposes legacy content domains.
