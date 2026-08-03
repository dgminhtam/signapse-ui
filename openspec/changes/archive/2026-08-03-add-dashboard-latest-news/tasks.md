## 1. Dashboard data flow

- [x] 1.1 Add the dashboard Latest News query using the existing `getNewsArticles` action with page `0`, size `5`, and `publishedAt` descending, without workspace scope.
- [x] 1.2 Add permission-aware news loading and normalize loading, empty, and error results independently from the existing watchlist, Trading Snapshot, and Event Timeline results.

## 2. Latest News module

- [x] 2.1 Create the route-local Latest News component using existing `Card`, `Item`, `Empty`, `Skeleton`, and localized navigation patterns.
- [x] 2.2 Render title, description, source, and publication time with localized fallbacks; keep internal status, event/calendar metadata, and row-level detail links out of the module.
- [x] 2.3 Compose Latest News beside Event Timeline in the responsive dashboard grid, hiding the module without permission and allowing Event Timeline to use the full width.
- [x] 2.4 Add the required English and Vietnamese dashboard dictionary keys and reuse existing news-list/common fallback copy where applicable.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate add-dashboard-latest-news --type change --strict`.
- [x] 3.2 Run `pnpm lint`.
- [x] 3.3 Run `pnpm typecheck`.
- [x] 3.4 Verify statically that the production module does not import prototype mock data and that the request remains global, limited to five articles, and sorted by `publishedAt` descending.

User-owned manual QA: authenticated data, responsive/light-dark rendering, and 200% zoom should be checked during implementation review.

Verification notes:

- Repo-wide `pnpm.cmd lint` still reports 16 pre-existing errors outside this change; targeted lint for the changed dashboard and dictionary files passes.
- `pnpm.cmd typecheck` passes.
