## 1. Contracts And Dependencies

- [x] 1.1 Add the selected financial chart dependency to the frontend dependencies.
- [x] 1.2 Create `app/lib/market-charts/definitions.ts` with candle request/response types, supported timeframe constants, labels, and Zod schemas.
- [x] 1.3 Create `app/lib/market-charts/permissions.ts` with `MARKET_CHART_READ_PERMISSIONS`, navigation permissions, and helper predicates.
- [x] 1.4 Create `app/api/market-charts/action.ts` that validates requests, serializes flat query params, calls `fetchAuthenticated()`, validates responses, and returns typed action results.

## 2. Route And Navigation

- [x] 2.1 Add `app/(main)/market-charts/page.tsx` with server-side permission guard, `AccessDenied`, and a Suspense fallback that mirrors the final workbench shell.
- [x] 2.2 Add `app/(main)/market-charts/error.tsx` with Vietnamese error copy and recovery action.
- [x] 2.3 Add `Biểu đồ giá` to app navigation using the market chart read permission.
- [x] 2.4 Add `market-charts` to breadcrumb friendly segment names.

## 3. Workbench Shell And Controls

- [x] 3.1 Build the market chart workbench shell with shadcn-composed controls, chart surface, metadata summary, and future overlay side panel.
- [x] 3.2 Implement controlled inputs for provider symbol, timeframe, `from`, and `to` with explicit submit and field-level Vietnamese validation.
- [x] 3.3 Persist submitted chart state to URL query params and hydrate the workbench from those query params on load.
- [x] 3.4 Add first-run, invalid-input, pending, no-data, and provider-error states that preserve user context.

## 4. Financial Chart Canvas

- [x] 4.1 Implement a client-only chart canvas component that creates, resizes, and disposes the chart engine instance safely.
- [x] 4.2 Map backend candles into candlestick data using engine-safe candle times.
- [x] 4.3 Render volume as a secondary layer or compact summary when volume data is available.
- [x] 4.4 Apply a local chart palette derived from semantic/theme tokens without changing global theme variables.
- [x] 4.5 Keep vendor attribution out of the primary chart surface unless the selected chart engine requires it.

## 5. Future Overlay Boundary

- [x] 5.1 Render a contextual side panel that explains event markers are not available until the future annotation contract exists.
- [x] 5.2 Ensure the MVP does not render fake markers, event popups, asset-watchlist chart selection, or trade recommendations.

## 6. Documentation And Verification

- [x] 6.1 Update `docs/APIMAPPING.md` to mark market chart frontend integration and list the new action/definitions/route files.
- [x] 6.2 Run `pnpm lint` and `pnpm typecheck`.
- [x] 6.3 Run a production build or equivalent project verification if dependency installation succeeds.
- [ ] 6.4 Smoke test `/market-charts` with at least one successful candle response, one empty/no-data response if available, and one invalid request.
  - Blocked locally: shell HTTP smoke reaches `/market-charts`, but only validates the protected/access-denied route state because the shell request has no authenticated Clerk session with `market-chart:read`. Successful, empty, and invalid chart states still need a logged-in browser session plus a backend/provider response.

## 7. Watchlist-Driven Latest Chart Revision

- [x] 7.1 Update market chart permissions and page guard so the workbench requires both `market-chart:read` and `watchlist:read`.
- [x] 7.2 Load current workspace watchlist assets for the workbench and add loading, error, and empty-watchlist states.
- [x] 7.3 Replace the free provider-symbol input with a controlled watchlist asset selector that stores selection by `assetId`.
- [x] 7.4 Remove editable `from` and `to` controls from the workbench UI and skeleton.
- [x] 7.5 Change URL state to `assetId` and `timeframe` only, including hydration and invalid `assetId` handling.
- [x] 7.6 Build backend candle requests from the selected watchlist asset for the initial symbol-based backend contract by sending `symbol = assetSymbol`, `to = now`, and `from = now - 7 days`.
- [x] 7.7 Update validation, copy, empty states, retry behavior, and metadata summary to describe latest seven-day chart data instead of user-entered time windows.
- [x] 7.8 Update `docs/APIMAPPING.md` and smoke checklist to reflect watchlist-driven chart selection and hidden backend-only time params.
- [x] 7.9 Run `pnpm typecheck`, `pnpm build`, and the most targeted lint verification available for changed market chart files; document any unrelated existing lint blockers.
  - Verification: targeted `pnpm lint -- "app/(main)/market-charts" "app/lib/market-charts" "app/api/market-charts/action.ts"` passed, `pnpm typecheck` passed, and `pnpm build` passed. Full `pnpm lint` still fails on unrelated existing files outside this change, including `ai-provider-configs`, `blogs`, `cronjobs`, `roles`, `developer-token`, `app/api/blogs`, `app/api/cronjobs`, `app/lib/ai-provider-configs`, and `scratch/list_endpoints.cjs`.

## 8. Minimal Chart Workbench Revision

- [x] 8.1 Remove decorative top badges and redundant body heading/hero description from the market chart workbench body.
- [x] 8.2 Compact the top controls into a data-first toolbar with asset selector, timeframe selector, refresh action, and concise freshness metadata only.
- [x] 8.3 Convert the right summary area into a compact market stats rail without redundant `CardDescription` copy.
- [x] 8.4 Remove the standalone future event panel from the main workspace until annotation data exists.
- [x] 8.5 Remove implementation-detail copy about backend `from/to`, provider bridge internals, and chart engine internals from the primary chart surface.
- [x] 8.6 Keep chart vendor attribution/copy out of the primary chart surface unless required by the active dependency.
- [x] 8.7 Add a repo-wide `AGENTS.md` rule for minimal screen copy and non-duplicative page hierarchy so future screens avoid explanatory clutter.
- [x] 8.8 Update skeleton/empty/error states to mirror the simplified layout and keep only necessary guidance.
- [x] 8.9 Run targeted market chart lint, `pnpm typecheck`, and `pnpm build`; document existing unrelated full-lint blockers if still present.
  - Verification: targeted `pnpm lint -- "app/(main)/market-charts" "app/lib/market-charts" "app/api/market-charts/action.ts"` passed, `pnpm typecheck` passed, and `pnpm build` passed. Full `pnpm lint` still fails on unrelated existing files outside this change, including `ai-provider-configs`, `blogs`, `cronjobs`, `developer-token`, `news-articles`, `roles`, `system-prompts`, `topics`, `app/api/auth`, `app/api/blogs`, `app/api/cronjobs`, `app/lib/ai-provider-configs`, `app/lib/utils`, and `scratch/list_endpoints.cjs`.

## 9. Asset-Based Chart Contract Sync

- [x] 9.1 Update `app/lib/market-charts/definitions.ts` so `MarketChartCandleRequest` uses numeric `assetId`, `timeframe`, `from`, `to`, and optional `includeAnnotations`, and so response types/schema parse `asset`, optional compatibility `symbol`, `candles[]`, and `annotations[]`.
- [x] 9.2 Update `app/api/market-charts/action.ts` to serialize flat query params `assetId`, `timeframe`, `from`, `to`, and `includeAnnotations=false`; remove direct `symbol` serialization.
- [x] 9.3 Update `app/(main)/market-charts/market-chart-workbench.tsx` so candle requests use the selected watchlist `assetId`, remove the symbol-missing request blocker, and prefer `response.asset` for summary/no-data display when present.
- [x] 9.4 Keep annotation payload parsing non-crashing but do not render markers, popups, or annotation panels in this MVP.
- [x] 9.5 Update `docs/APIMAPPING.md` to mark the frontend chart action as aligned with the backend `assetId` request contract and note that annotation rendering remains future scope.
- [x] 9.6 Run targeted market chart lint, `pnpm typecheck`, and `pnpm build`; document any remaining full-lint blockers outside this change.
  - Verification: targeted `pnpm lint -- "app/(main)/market-charts" "app/lib/market-charts" "app/api/market-charts/action.ts"` passed, `pnpm typecheck` passed, and `pnpm build` passed. Full `pnpm lint` still fails on unrelated existing files outside this change, including `ai-provider-configs`, `blogs`, `cronjobs`, `developer-token`, `news-articles`, `roles`, `system-prompts`, `topics`, `app/api/auth`, `app/api/blogs`, `app/api/cronjobs`, `app/lib/ai-provider-configs`, `app/lib/utils`, and `scratch/list_endpoints.cjs`.
