## 1. Contracts And Dependencies

- [x] 1.1 Add `lightweight-charts` to the frontend dependencies.
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

## 4. Lightweight Charts Canvas

- [x] 4.1 Implement a client-only chart canvas component that creates, resizes, and disposes the Lightweight Charts instance safely.
- [x] 4.2 Map backend candles into candlestick series data using UTC-safe candle times.
- [x] 4.3 Render volume as a secondary layer or compact summary when volume data is available.
- [x] 4.4 Apply a local chart palette derived from semantic/theme tokens without changing global theme variables.
- [x] 4.5 Include the required TradingView attribution treatment in or near the chart surface.

## 5. Future Overlay Boundary

- [x] 5.1 Render a contextual side panel that explains event markers are not available until the future annotation contract exists.
- [x] 5.2 Ensure the MVP does not render fake markers, event popups, asset-watchlist chart selection, or trade recommendations.

## 6. Documentation And Verification

- [x] 6.1 Update `docs/APIMAPPING.md` to mark market chart frontend integration and list the new action/definitions/route files.
- [x] 6.2 Run `pnpm lint` and `pnpm typecheck`.
- [x] 6.3 Run a production build or equivalent project verification if dependency installation succeeds.
- [ ] 6.4 Smoke test `/market-charts` with at least one successful candle response, one empty/no-data response if available, and one invalid request.
  - Blocked locally: shell HTTP smoke reaches `/market-charts`, but only validates the protected/access-denied route state because the shell request has no authenticated Clerk session with `market-chart:read`. Successful, empty, and invalid chart states still need a logged-in browser session plus a backend/provider response.
