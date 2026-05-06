## Why

The backend exposes a protected market chart candle bridge, but the frontend still needs a product-shaped surface that lets users inspect OHLCV price data for assets they actually track in the current workspace. The chart should feel like a workspace watchlist timeline, not a free-form provider symbol query tool.

This revised proposal keeps the chart workbench MVP, but changes the control model: users choose a watchlist asset and timeframe, while the frontend computes the latest rolling candle window internally. The latest backend chart contract now also makes `assetId` the request identity and can return `asset` plus `annotations[]`, so the frontend must stop sending provider symbols directly.

## What Changes

- Add a market chart candle workbench that renders OHLCV candles from `GET /market-charts/candles` for assets already configured in the current workspace watchlist.
- Use KLineChart as the financial chart engine and keep the surrounding controls, states, and panels in a shadcn UI shell.
- Add frontend market chart DTOs, request/response validation, permissions, authenticated API action, route, navigation, and breadcrumb copy.
- Load workspace watchlist assets and require users to choose from those assets instead of typing arbitrary symbols.
- Keep chart state shareable through URL query params for `assetId` and `timeframe` only.
- Hide manual `from` and `to` inputs in the UI. The frontend sends a rolling latest window to the backend with `to = now` and `from = now - 7 days` as an implementation detail.
- Send backend candle requests with `assetId`, `timeframe`, `from`, `to`, and `includeAnnotations=false` for the MVP instead of sending `symbol`.
- Parse the new response shape with `asset` and `annotations[]`, but do not render event markers or popups until marker UX is explicitly scoped.
- Render clear loading, empty-watchlist, no-data, invalid-selection, provider-error, and access-denied states in professional Vietnamese.
- Prepare the UI shape for future event markers, lazy historical loading, and annotation details, but do not implement annotation data before backend support exists.
- Simplify the chart screen so the chart, asset selector, timeframe selector, and core market stats are the primary UI. Remove explanatory hero copy, decorative badges, redundant card descriptions, and future-event panels from the main workspace.
- Keep vendor attribution out of the primary chart surface unless a selected chart engine requires it.
- Do not implement `GET /market-charts/assets/{assetId}`, explicit provider-symbol mapping, realtime updates, technical indicators, drawing tools, or trading recommendations in this change.

## Capabilities

### New Capabilities

- `market-chart-candle-workbench`: Provides an authorized frontend workbench for selecting a current workspace watchlist asset, rendering its latest market candles, and inspecting the backend candle bridge output.

### Modified Capabilities

- None.

## Impact

- Adds dependency: `klinecharts`.
- Affected frontend areas: `app/api/market-charts`, `app/lib/market-charts`, `app/(main)/market-charts`, `app/api/watchlists`, `app/lib/watchlists`, `config/site.ts`, `components/app-breadcrumbs.tsx`, `AGENTS.md`, and related loading/error UI.
- Uses existing backend endpoint `GET /market-charts/candles`, workspace watchlist endpoint `GET /watchlists`, and permission keys `market-chart:read` plus `watchlist:read`.
- Backend now owns asset-to-provider symbol resolution through `assetId`; frontend should not derive provider symbols from watchlist `assetSymbol` for candle requests.
- Requires `docs/APIMAPPING.md` to stay aligned with the new `assetId` request, `includeAnnotations`, `asset`, and `annotations[]` contract.
- Does not require backend changes, database changes, or global theme token changes.
