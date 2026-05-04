## Context

`docs/api_mapping.json` is the backend contract source for endpoint permissions through `x-signapse-auth`. The current frontend has mostly migrated from legacy source/source-document naming to canonical news-outlet/news-article naming, but some legacy code remains:

- `/sources*` and `/news-sources*` are redirect compatibility routes, yet unused source list/form/search components and `/sources` API actions still remain.
- Event enrichment and market reaction derivation are still gated by `source-document:analyze`, while backend metadata now gates these event operators with `news-article:analyze`.
- News article and market query modules intentionally keep some `source-document:*` aliases for backward compatibility.

## Goals / Non-Goals

**Goals:**

- Make permission checks follow backend metadata by default, especially event operator permissions.
- Remove unreachable legacy source implementation code so future changes do not accidentally revive stale `source:*` permissions or `/sources` endpoints.
- Keep old deep links safe through redirect-only pages.
- Document intentional legacy compatibility aliases so stale permission literals are not mistaken for active contract keys.

**Non-Goals:**

- Do not add new UI surfaces.
- Do not change backend permission names or role catalog behavior.
- Do not remove redirect compatibility for existing bookmarks.
- Do not redesign news outlet, news article, event, or market query screens.

## Decisions

1. Use backend metadata as the canonical permission source.

   Event operator constants should use `news-article:analyze` first because that is what backend enforces for the relevant event POST endpoints. If compatibility with existing roles is needed, retain `source-document:analyze` as a secondary accepted alias in the same constant, mirroring the news article permission pattern.

   Alternative considered: switch directly to only `news-article:analyze`. This is cleaner but can break users whose roles still carry legacy permissions during migration.

2. Delete unreachable source implementation, keep redirect pages.

   `/sources/page.tsx`, `/sources/create/page.tsx`, and `/sources/[id]/page.tsx` already redirect to `/news-outlets*`, so the source list/form/search components and `app/api/sources/action.ts` are no longer reachable through normal routing. Removing those files reduces accidental reuse of stale `source:*` permissions while preserving deep-link behavior.

   Alternative considered: remap legacy components to `news-outlet:*`. This keeps dead code alive and duplicates the canonical news outlet implementation, so it increases maintenance risk.

3. Treat legacy `source-document:*` aliases as temporary compatibility only.

   News article and market query modules may keep legacy aliases when they are used to avoid role migration breakage, but canonical `news-article:*` keys must appear first and docs must call out the compatibility intent.

   Alternative considered: remove all `source-document:*` immediately. This gives a cleaner literal scan but may prematurely lock out users before role data is fully migrated.

## Risks / Trade-offs

- Legacy role users may lose event operator buttons if only canonical `news-article:analyze` is accepted. Mitigation: keep dual-key compatibility for event operators during this cleanup unless backend role catalog migration is confirmed complete.
- Removing files can expose stale imports. Mitigation: run `rg` for `app/api/sources`, `app/lib/sources`, and `source:*`, then run typecheck.
- Documentation can drift again when BE updates `api_mapping.json`. Mitigation: update `docs/APIMAPPING.md` and use the `api-mapping-sync` skill for future backend contract changes.
