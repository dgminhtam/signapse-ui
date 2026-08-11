## Context

The production dashboard resolves a readable active workspace, makes one authenticated `GET /dashboard/summary` request, validates the response with `dashboardSummaryResponseSchema`, and distributes individual metrics to route-local Server Components. `recentEvents` and `assetsInFocus` already follow this pattern. Backend has now added a required `marketNarratives` metric with at most three ranked items, but the current Zod object omits and therefore strips that field.

The reviewed `/dashboard-prototype` defines the accepted Market Narratives Card and Item hierarchy plus the seven-to-five relationship with Assets in Focus. Its records, scenario controls, relative-time strings, and dictionary namespace are route-local mock concerns and cannot be imported into production. `docs/api_mapping.json` is authoritative because BE may still make small contract adjustments; `docs/APIMAPPING.md` has already been synchronized to the current snapshot.

## Goals / Non-Goals

**Goals:**

- Preserve and validate the required `marketNarratives` metric at the existing dashboard API boundary with exact OpenAPI requiredness, nullability, enums, and maximum length.
- Render a live, localized, permission-aware Market Narratives section from the same summary response without additional aggregation or detail requests.
- Preserve backend ordering and canonical narrative, theme, asset, timestamp, state, and error-code content.
- Pair Assets in Focus and Market Narratives in the accepted seven-to-five desktop layout while keeping a readable stacked layout at narrow widths and 200% zoom.
- Provide truthful available, empty, denied, error, endpoint-failure, and loading states while keeping other successful dashboard modules usable.

**Non-Goals:**

- Changing the backend endpoint, permissions, ranking, time window, error codes, or response contents.
- Calling `/narratives`, Narrative detail, Graph View, Market Charts, watchlist, or asset endpoints to assemble the section.
- Adding a Narrative list/detail route, narrative lifecycle management, narrative quick detail, or item-level navigation.
- Inferring bullish, bearish, causal, predictive, or recommendation semantics from lifecycle status, confidence, theme, or related assets.
- Reusing prototype mock records, scenario modules, relative-time copy, dictionary content, or component implementations.
- Modifying shared shadcn wrappers or adding dependencies.

## Decisions

### Use the existing summary request as the only data source

The page will pass `summary.marketNarratives` from the existing `getDashboardSummary()` result into a production-local component. No request or frontend join will be added. This keeps the active workspace, shared `asOf`, seven-day eligibility window, permission resolution, and authoritative ranking owned by BE.

Alternative considered: call the existing `getNarratives(searchParams)` action and fetch detail for assets. Rejected because the list contract is not the dashboard ranking contract, detail fan-out creates N+1 work, and the resulting timestamps and permissions can diverge from the summary snapshot.

### Mirror the current OpenAPI contract exactly before rendering

Dashboard definitions will add schemas for `DashboardMarketNarrativeThemeResponse`, `DashboardMarketNarrativeItemResponse`, and `DashboardMarketNarrativesMetricResponse`, make `marketNarratives` required on the summary, restrict items to three, and keep `errorCode` as a required nullable open string. `title`, `thesis`, and `confidence` are required nullable fields. `primaryTheme` is a required object; only `themeTitle` is nullable while `themeId` and `themeSlug` are required. All asset fields are required and only `weight` is nullable.

Because the OpenAPI item reuses `NarrativeAssetSummaryResponse`, the corresponding reusable asset schema and inferred type belong in `app/lib/narratives/definitions.ts`; dashboard definitions will compose it instead of duplicating the relation contract.

Alternative considered: make `marketNarratives` optional for rollout tolerance or use `.nullish()` for historically loose narrative fields. Rejected because the published dashboard contract marks the metric and nested fields required, and BE is deployed before FE.

### Preserve backend order and represent nulls truthfully

The component will render every validated item and asset in the returned order without sorting, filtering, or slicing. It will use localized fallback copy when `title` or `thesis` is null or blank, omit confidence rather than display `0%` when confidence is null, omit the theme row when `primaryTheme.themeTitle` is null or blank, and omit the asset row when `assets` is empty. It will not use `themeSlug` as a human-facing fallback because the slug is canonical technical content rather than a localized title.

Alternative considered: re-rank items or fall back to theme slug. Rejected because order is authoritative and the UI must not promote technical identifiers into product copy.

### Adapt the prototype hierarchy into a production-local Server Component

A new route-local `market-narratives.tsx` Server Component will reuse existing `Card`, `CardHeader`, `CardAction`, `ItemGroup`, `Item`, `Badge`, `Empty`, `Button`, `Skeleton`, localization formatters, and `LocalizedLink`. It will expose the live component and a matching skeleton. A neutral narrative icon will be used rather than `TrendingUp` or `TrendingDown`, because the contract exposes lifecycle status, not market direction.

Alternative considered: export and parameterize the prototype component. Rejected because that would couple live DTOs and permissions to a mock-only review surface.

### Treat lifecycle status and direction as separate concepts

The lifecycle Badge mapping will remain `default` for `ACTIVE` and `secondary` for `EMERGING` and `WEAKENING`, matching the accepted dashboard design. Asset badges remain `outline`. Status text and neutral chrome communicate lifecycle only; icons and copy will not imply price direction or trade advice.

### Pair the two bottom modules at the page composition seam

`dashboard/page.tsx` will wrap Assets in Focus and Market Narratives in a twelve-column grid, placing wrapper elements at seven and five columns on large screens. The span remains outside each section component so both Cards stay reusable and keep their existing internal chrome. The loading fallback will use the identical wrappers and a three-row Market Narratives skeleton.

Alternative considered: add grid-span props or classes inside `AssetsInFocus` and Market Narratives. Rejected because layout ownership belongs to the route composition, as already demonstrated by Event Timeline and Latest News.

### Keep metric eligibility and destination permission independent

`AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` select the section body; endpoint-level failure continues through the existing summary error path. The frontend will not recompute metric eligibility from the current permission list. The Graph View header action will render only when available items exist and `canReadGraphView` is true. Raw `errorCode` values remain available for diagnostics but are not the primary user-facing label.

Alternative considered: gate the whole module with `canReadNarratives()` or show the Graph View action in every state. Rejected because BE metric state is authoritative and inaccessible or contextless actions are misleading.

## Risks / Trade-offs

- **[Risk] BE adjusts field names, nullability, or enums before apply** → Re-run the API mapping comparison at apply time and make `docs/api_mapping.json` authoritative over examples in these artifacts.
- **[Risk] Strict required validation causes the whole summary to fail against a partially deployed backend** → Deploy BE first, keep the existing explicit validation failure state, and do not weaken the schema with optional compatibility fields.
- **[Risk] Three dense narrative rows overflow the five-column Card** → Keep title and thesis as the primary scan path, allow footer metadata and asset badges to wrap, and verify narrow widths and 200% zoom without changing primitive chrome.
- **[Risk] Nullable content produces blank visual rows** → Trim nullable strings, use localized title/thesis fallbacks, and omit optional theme/confidence/asset metadata when unavailable.
- **[Risk] Lifecycle visuals are misread as price direction** → Use neutral icons, lifecycle labels, approved Badge variants, and no directional copy.
- **[Trade-off] Market Narratives has no item drill-down** → Keep the Graph View action at module scope until a canonical Narrative route exists instead of inventing a partial navigation model.

## Migration Plan

1. Re-check `docs/api_mapping.json` and resync `docs/APIMAPPING.md` if the BE contract changed after this proposal.
2. Extend reusable Narrative asset definitions and dashboard summary validation/types, then update the focused deterministic assertion.
3. Add production dictionary copy, the route-local Market Narratives component, explicit states, Graph View action, and matching skeleton.
4. Integrate the metric and seven-to-five bottom row into the successful dashboard and loading fallback without adding requests or changing the prototype.
5. Run the focused schema assertion, typecheck, lint, diff checks, strict OpenSpec validation, and targeted static review.

Rollback consists of reverting the frontend schema addition, section, layout wrappers, and dictionary keys. No data migration or backend rollback is required. Because `marketNarratives` is required by the deployed BE contract, rollback restores the previous FE behavior of stripping the field while other dashboard metrics continue to load.

## Open Questions

None. Minor contract drift discovered during apply is resolved by following the latest `docs/api_mapping.json` and documenting the resulting artifact adjustment.
