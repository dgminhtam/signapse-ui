## Why

Backend has moved content APIs to the canonical `news-outlets` / `news-articles` domains and now exposes authoritative permission metadata through `x-signapse-auth` in `docs/api_mapping.json`. The frontend still contains legacy source/source-document code paths and at least one event operator permission gate that can hide valid actions from users who only have the new backend permissions.

## What Changes

- Align frontend permission checks for event enrichment and market reaction derivation with backend metadata by using canonical `news-article:analyze`, while optionally accepting legacy `source-document:analyze` during migration.
- Remove unused legacy source management implementation files that are no longer reachable because `/sources*` and `/news-sources*` route to `/news-outlets*`.
- Keep only lightweight legacy redirect pages for old deep links such as `/sources`, `/news-sources`, and `/source-documents`.
- Review and remove stale permission literals that are not present in backend metadata unless they are intentionally documented compatibility aliases.
- Update `docs/APIMAPPING.md` to document the cleanup and remaining intentional compatibility redirects.

## Capabilities

### New Capabilities

- `backend-permission-contract-alignment`: Frontend permission gates and legacy compatibility surfaces stay aligned with backend API metadata.

### Modified Capabilities

- None.

## Impact

- Affected frontend permission files: `app/lib/events/permissions.ts`, `app/lib/news-articles/permissions.ts`, `app/lib/market-query/permissions.ts`.
- Affected legacy code cleanup targets: `app/(main)/sources/source-list.tsx`, `app/(main)/sources/source-form.tsx`, `app/(main)/sources/source-search.tsx`, `app/api/sources/action.ts`, `app/lib/sources/definitions.ts`.
- Affected documentation: `docs/APIMAPPING.md`.
- No backend API change and no new dependency expected.
