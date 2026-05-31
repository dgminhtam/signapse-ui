## Why

Backend now exposes a market chart live stream so the chart can stay current without requiring manual refresh or reloading the historical candle window. Integrating the SSE endpoint lets Signapse keep the existing watchlist-only chart workflow while updating last price, partial candles, and stream health in place.

## What Changes

- Add a frontend integration for `GET /market-charts/live` as an authenticated SSE stream scoped to the active watchlist asset and timeframe.
- Handle named SSE events: `snapshot`, `price`, `candle`, `status`, and `error`.
- Keep historical candles, annotations, and live runtime state separate so live partial candles do not become final persisted candles.
- Update the candle request default so `includeAnnotations` defaults to `true`, matching the backend reference contract, while the annotation toolbar toggle controls marker visibility.
- Show compact live stream status in the market chart workspace without clearing existing candles on stale, reconnecting, disconnected, or error states.
- Ensure changing asset, timeframe, workspace context, or unmounting the chart closes the previous stream before opening a new one.

## Capabilities

### New Capabilities

- `market-chart-live-sse-stream`: Adds authenticated market chart SSE streaming, live quote/partial candle state, stream lifecycle handling, and non-disruptive live status UI.

### Modified Capabilities

- `market-chart-candle-workbench`: Update the candle request default for `includeAnnotations` from `false` to `true` so frontend requests align with the backend reference contract.
- `market-chart-annotation-markers`: Clarify that the annotation toolbar toggle controls whether markers/details are displayed, not the default backend request contract for annotation payload availability.
- `market-chart-lazy-history-loading`: Keep lazy older candle requests aligned with the same `includeAnnotations=true` default while preserving marker visibility rules.

## Impact

- Affected API layer: `app/api/market-charts/action.ts` and `app/lib/market-charts/definitions.ts`.
- Affected UI/runtime: `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`, `market-chart-canvas.tsx`, market chart skeleton/status rail, and localized market chart dictionary copy.
- Should prefer a same-origin Next route streaming proxy for SSE so `API_BASE_URL` and Clerk bearer tokens stay server-side; add a fetch-based SSE dependency only if the proxy approach is not viable.
- Must keep `fetchAuthenticated()` for historical candle requests and use a fresh Clerk token at the SSE backend boundary for each stream open.
- Must not expose the Twelve Data provider key or open a provider WebSocket directly from frontend code.
