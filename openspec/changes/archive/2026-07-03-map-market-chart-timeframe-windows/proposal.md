## Why

The market chart workbench currently requests the same 7-day initial candle window for every timeframe. Weekly and monthly charts can return no candles, so the chart opens blank even though the backend supports `1w` and `1mo`.

## What Changes

- Replace the fixed initial candle lookback with a timeframe-to-day-window mapping that targets roughly 100 candles on first load.
- Use a smaller timeframe-to-day-window mapping for older-history lazy loads.
- Keep existing backend timeframe values unchanged: `1m`, `5m`, `15m`, `30m`, `1h`, `1d`, `1w`, `1mo`.
- Do not add retry loops, dynamic pagination, or backend API changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-candle-workbench`: Initial candle loading must use timeframe-specific windows so every supported timeframe opens with enough chart data.
- `market-chart-lazy-history-loading`: Older-history loading must use smaller timeframe-specific windows after the initial load.

## Impact

- Affects market chart request-window calculation in `app/[lang]/(main)/market-charts/`.
- No backend contract, dependency, route, or UI control changes.
