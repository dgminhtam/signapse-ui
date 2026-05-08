## Why

The market chart currently loads only the latest rolling window, so users cannot inspect older price history without a manual time-window UI that the product has intentionally removed. KLineChart already exposes a data-loader boundary for historical bars, making this the right moment to add scroll-based history loading while preserving the clean watchlist-only chart workflow.

## What Changes

- Add lazy historical loading to `/market-charts` so panning toward the oldest loaded candles requests an older candle window from `GET /market-charts/candles`.
- Keep the route state limited to `assetId` and `timeframe`; do not add `from`, `to`, `symbol`, or cursor params to the URL.
- Keep manual `from` and `to` controls hidden. The frontend computes both the initial latest window and later older windows internally.
- Use the selected watchlist asset `assetId`, current timeframe, and annotation toggle state for every lazy-load request.
- Prepend older candles into the active KLineChart data stream without resetting the chart viewport or rebuilding the whole workbench.
- Merge lazy-loaded annotations when the event layer is enabled, de-duplicate them, and keep annotation markers, popup selection, and accessible annotation controls consistent with the expanded data range.
- Add lightweight in-chart feedback for older-history loading and failures without replacing the existing chart with a full skeleton.
- Stop requesting older windows when the backend indicates no older data is available or returns an empty older range.
- Reset loaded history state when asset, timeframe, annotation toggle, refresh, invalid selection, or watchlist context changes.
- Do not add realtime streaming, forward/future loading, indicators, drawing tools, toolbar redesign, or backend API changes in this change.

## Capabilities

### New Capabilities

- `market-chart-lazy-history-loading`: Covers scroll-based loading of older market chart candles and annotations while preserving the existing watchlist-only chart state model.

### Modified Capabilities

- None.

## Impact

- Affected frontend areas: `app/(main)/market-charts/market-chart-workbench.tsx`, `app/(main)/market-charts/market-chart-canvas.tsx`, `app/(main)/market-charts/market-chart-annotations.ts`, `app/api/market-charts/action.ts` if request helpers need extension, `app/lib/market-charts/definitions.ts` if lazy-load metadata helpers are added, and the market chart skeleton/error states.
- Uses the existing backend endpoint `GET /market-charts/candles` with `assetId`, `timeframe`, `from`, `to`, and `includeAnnotations`.
- No new dependencies, route params, backend endpoints, permissions, database changes, or global theme token changes are required.
- Requires `docs/APIMAPPING.md` and active OpenSpec chart notes to state that lazy historical loading is now implemented for older candles only.
