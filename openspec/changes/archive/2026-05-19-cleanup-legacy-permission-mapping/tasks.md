## 1. Permission Alignment

- [x] 1.1 Update `app/lib/events/permissions.ts` so event enrich and market reaction derivation accept canonical `news-article:analyze` first, with `source-document:analyze` only as a documented compatibility alias if retained.
- [x] 1.2 Review `app/lib/news-articles/permissions.ts` and `app/lib/market-query/permissions.ts` to ensure any `source-document:*` aliases are canonical-second compatibility aliases, not the only active gate.
- [x] 1.3 Run a permission literal scan against `docs/api_mapping.json` and document any remaining FE-only permission keys as intentional compatibility or missing integration.

## 2. Legacy Code Cleanup

- [x] 2.1 Remove unused legacy source implementation files that are no longer reachable: `app/(main)/sources/source-list.tsx`, `app/(main)/sources/source-form.tsx`, and `app/(main)/sources/source-search.tsx`.
- [x] 2.2 Remove unused legacy source data layer files for removed `/sources` backend endpoints, including `app/api/sources/action.ts` and `app/lib/sources/definitions.ts`.
- [x] 2.3 Keep redirect-only compatibility pages for `/sources`, `/sources/create`, `/sources/[id]`, `/news-sources*`, and `/source-documents*`.
- [x] 2.4 Search for stale imports/usages of removed source files and stale `source:create`, `source:update`, or `source:delete` permission literals.

## 3. Documentation

- [x] 3.1 Update `docs/APIMAPPING.md` to state that legacy source implementation files were removed and only redirect compatibility remains.
- [x] 3.2 Update `docs/APIMAPPING.md` permission impact notes so event operators are documented as backend-gated by `news-article:analyze`, with any `source-document:analyze` support marked as temporary FE compatibility.

## 4. Verification

- [x] 4.1 Run `openspec status --change cleanup-legacy-permission-mapping` and ensure required artifacts are complete.
- [x] 4.2 Run `pnpm typecheck` or the repo `/typecheck` equivalent to catch stale imports after file removal.
- [x] 4.3 Run a targeted `rg` check for removed legacy source implementation references and stale permission-only gates.
