## Why

The backend now exposes a protected market chart candle bridge, but the frontend has no DTO, action, route, or surface that lets users inspect OHLCV price data. Adding a focused candle workbench gives Signapse a practical first step toward the target market chart event overlay without waiting for asset-level chart annotations or candle persistence.

## What Changes

- Add a market chart candle workbench that renders provider-symbol OHLCV candles from `GET /market-charts/candles`.
- Use Lightweight Charts as the financial chart engine and keep the surrounding controls, states, and panels in a shadcn UI shell.
- Add frontend market chart DTOs, request/response validation, permissions, authenticated API action, route, navigation, and breadcrumb copy.
- Keep chart state shareable through URL query params for `symbol`, `timeframe`, `from`, and `to`.
- Render clear loading, empty, no-data, invalid-input, provider-error, and access-denied states in professional Vietnamese.
- Prepare the UI shape for future event markers and annotation details, but do not implement annotation data before backend support exists.
- Do not implement `GET /market-charts/assets/{assetId}`, provider-symbol mapping, workspace watchlist chart selection, realtime updates, technical indicators, drawing tools, or trading recommendations in this change.

## Capabilities

### New Capabilities

- `market-chart-candle-workbench`: Provides an authorized frontend workbench for requesting, rendering, and inspecting market candle data from the backend candle bridge.

### Modified Capabilities

- None.

## Impact

- Adds dependency: `lightweight-charts`.
- Affected frontend areas: `app/api/market-charts`, `app/lib/market-charts`, `app/(main)/market-charts`, `config/site.ts`, `components/app-breadcrumbs.tsx`, and related loading/error UI.
- Uses existing backend endpoint `GET /market-charts/candles` and permission key `market-chart:read`.
- Does not require backend changes, database changes, or global theme token changes.
