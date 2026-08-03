## Context

The protected localized dashboard already loads the active workspace, watchlist preview, Trading Snapshot, and Event Timeline from the production route. The prototype contains a Latest News presentation, while the production news feature already exposes the authenticated `getNewsArticles` server action backed by `GET /news-articles`.

The agreed behavior is a global, workspace-independent list of the five most recent articles. The change must preserve the dashboard's existing workspace gate and must not turn news loading into a prerequisite for the other dashboard modules.

## Goals / Non-Goals

**Goals:**

- Add a production Latest News module beside Event Timeline.
- Request five articles with `page=0`, `size=5`, and `publishedAt` descending, without a workspace filter.
- Reuse existing news types, authenticated action, permission helper, shadcn primitives, and localization conventions.
- Keep loading, empty, error, and permission states local to the module.
- Match the prototype's compact hierarchy without importing prototype mock data.

**Non-Goals:**

- No new backend endpoint, query parameter, database change, or dependency.
- No workspace-specific filtering, article status management, event/calendar metadata, or row-level article navigation.
- No change to `GET /dashboard/summary` or to the dashboard prototype route.

## Decisions

### Load news in the existing dashboard server flow

Add the news request to the dashboard's existing post-workspace-gate loading path and run it in the same `Promise.all` as the watchlist and summary requests. Each result is represented independently so a news error can render inside Latest News while Trading Snapshot and Event Timeline remain available.

An additional dashboard aggregate endpoint was considered and rejected: the existing news action already provides the required list contract, and extending `dashboard/summary` would couple an optional module to unrelated summary data.

### Reuse the existing news action and query shape

Call `getNewsArticles` with the shared search-parameter structure: page zero, size five, and a descending `publishedAt` sort. Do not pass the active workspace ID or a workspace specification. The module consumes the existing `NewsArticleListResponse` fields and does not expose the response's internal derivation status.

A new client-side fetcher or direct browser request was considered and rejected because the server action already applies authenticated transport and the dashboard is a server-rendered route.

### Keep the UI route-local and compact

Create a small dashboard-local Latest News component using existing `Card`, `Item`, `Empty`, and `Skeleton` primitives. Its header links to the localized `/news-articles` list route. Article rows are presentation-only; they do not invent detail URLs or event relationships that the prototype and current requirement do not define.

Place the modules in a responsive twelve-column grid: Event Timeline spans eight columns and Latest News spans four columns at the large breakpoint. When Latest News is hidden because the user lacks the existing news read permission, Event Timeline spans the full available width.

### Use existing permission and localization boundaries

Gate the module with `canReadNewsArticles`, which already accepts either supported news read permission. Add only dashboard-specific English and Vietnamese copy; reuse existing news-list fallbacks and common not-available copy where their meaning matches.

The prototype's hardcoded dictionary items are not reused because the production module must be backed by live data and the prototype is explicitly isolated from production data flow.

## Risks / Trade-offs

- **[API eligibility semantics]** `NewsArticleListResponse` contains internal processing statuses and optional publication metadata. → The UI will not display statuses and will use localized fallbacks for missing optional fields. Confirm during implementation QA that the endpoint's default list semantics are appropriate for “latest news”; adding an unconfirmed status filter is outside this change.
- **[Independent error handling]** A single server-side `Promise.all` can make error modeling easy to regress. → Preserve the existing successful result types and catch/normalize the news request separately so the module owns its failure state.
- **[Permission-aware layout]** Hiding a sibling changes the grid width. → Apply the width classes to the rendered wrappers and use a full-width Event Timeline wrapper when news is not eligible.
- **[Responsive density]** Five rows may be tight at narrow widths. → Keep descriptions line-clamped and use the existing compact Item hierarchy rather than adding pagination or a carousel.

## Migration Plan

No data or backend migration is required. Deploy the route-local component, dashboard composition changes, and dictionary entries together. Rollback is limited to removing the Latest News loading/rendering path and its dashboard copy; existing news-list behavior is unaffected.

## Open Questions

- None block implementation. During authenticated QA, verify that `GET /news-articles` returns the intended user-visible latest articles when sorted by `publishedAt`; if not, raise a separate API-contract change instead of broadening this frontend change.
