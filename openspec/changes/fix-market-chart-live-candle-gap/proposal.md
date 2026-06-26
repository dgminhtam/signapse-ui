## Why

Live market chart price ticks can move ahead of the newest displayed candle, but using SSE candle payloads to replace the rightmost candle can overwrite authoritative REST OHLC data. The chart should keep the REST-loaded candle shape and use live quotes only to update the displayed close price.

## What Changes

- Update the market chart frontend live candle derivation so fresh quote events patch only the close value of the latest REST-loaded candle.
- Stop using SSE `candle` payloads, including `snapshot.candle`, to render or replace chart candles.
- Ignore quote events that fall into a newer timeframe bucket until the next REST refresh supplies that candle.
- Keep the backend SSE contract unchanged: `price`, `candle`, `snapshot`, `status`, and `error` events remain independent.
- Keep stale quote protection so older stream data does not regress the displayed close.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-live-sse-stream`: clarify that live quotes update only the displayed close of the latest REST-loaded candle, while SSE candle payloads and newer-bucket quotes are ignored for rendering.

## Impact

- Affected code: market chart live state derivation and live candle helper logic under `app/[lang]/(main)/market-charts/`.
- APIs: no backend API or SSE event contract changes.
- Dependencies: none.
