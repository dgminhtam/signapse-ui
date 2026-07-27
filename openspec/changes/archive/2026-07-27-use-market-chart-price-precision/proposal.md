## Why

Market charts currently hard-code four decimal places, so assets such as XAUUSD are displayed with more precision than the backend contract defines. The backend now exposes nullable `pricePrecision` metadata on asset and market-chart responses, allowing the chart to use the asset's configured precision.

## What Changes

- Add nullable `pricePrecision` to frontend asset and market-chart response contracts.
- Parse `asset.pricePrecision` from historical candle responses and live SSE snapshots through the shared market-chart asset schema.
- Pass the loaded asset precision to KLineChart instead of always using four decimal places.
- Preserve the current four-decimal behavior only as a fallback when the backend omits the nullable metadata.
- Keep candles as the chart's authoritative precision source; do not add the unconfirmed optional `assetPricePrecision` watchlist field.
- Update the API mapping ledger to reflect the backend contract and frontend integration status.

## Capabilities

### New Capabilities

- `market-chart-price-precision`: Display market-chart prices using backend-provided asset precision with a safe fallback for missing metadata.

### Modified Capabilities

None.

## Impact

- Frontend contracts: `app/lib/assets/definitions.ts`, `app/lib/market-charts/definitions.ts`.
- Market-chart data flow and rendering: `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`, `app/[lang]/(main)/market-charts/market-chart-canvas.tsx`.
- Documentation: `docs/APIMAPPING.md`.
- Backend endpoints consumed: `GET /assets`, `GET /assets/{id}`, `GET /market-charts/candles`, and the `/market-charts/live` SSE snapshot event.
- No new dependency, route, or watchlist contract is introduced.
