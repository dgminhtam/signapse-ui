## Why

The market chart live SSE endpoint can stream `price` quote events while the frontend chart only renders `candle` events, so the UI can appear stale even though live prices are arriving. The frontend live stream contract also rejects the backend `MARKET_CLOSED` status state.

## What Changes

- Accept backend live stream status `MARKET_CLOSED` in the frontend live status type and Zod schema.
- Treat `MARKET_CLOSED` as a non-crashing, non-blocking live status while preserving historical chart data.
- Derive a display-only live partial candle from incoming quote events when no candle event is available for the active bucket.
- Keep KLineChart and the backend SSE contract candle-oriented; do not add a separate quote rendering path inside the chart canvas.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `market-chart-live-sse-stream`: live quote events must be able to update the displayed latest candle, and backend `MARKET_CLOSED` status must be accepted.

## Impact

- Affected frontend files:
  - `app/lib/market-charts/definitions.ts`
  - `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`
  - `app/[lang]/(main)/market-charts/market-chart-candle-helpers.ts`
  - market chart localization dictionaries if a dedicated market-closed label is added
- No backend API contract change.
- No new dependency.
