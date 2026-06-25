## Why

Live market chart price ticks can move ahead of the newest displayed candle after the stream has already emitted a partial candle. This leaves a visible gap between the live price marker and the rightmost candle even though the frontend already receives quote events.

## What Changes

- Update the market chart frontend live candle derivation so fresh quote events can update the displayed partial candle even after a prior candle event exists.
- Keep the backend SSE contract unchanged: `price`, `candle`, `snapshot`, `status`, and `error` events remain independent.
- Keep stale quote and stale candle protection so older stream data does not regress the chart.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-live-sse-stream`: clarify that quote events newer than or matching the displayed live candle bucket must remain eligible to update the displayed partial candle.

## Impact

- Affected code: market chart live state derivation and live candle helper logic under `app/[lang]/(main)/market-charts/`.
- APIs: no backend API or SSE event contract changes.
- Dependencies: none.
