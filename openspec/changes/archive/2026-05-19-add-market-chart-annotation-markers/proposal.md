## Why

The backend candle contract now includes `includeAnnotations` and returns `annotations[]`, but the market chart UI still hides that layer. Users need a visual way to connect price movement with relevant events without turning the chart into a dense text surface.

This change enables annotation markers as a focused follow-up to the candle workbench: the chart remains data-first, while event context becomes available on demand from the backend response.

## What Changes

- Add an annotation visibility control to the market chart workbench so users can enable or disable event markers.
- Request candle data with `includeAnnotations=true` when annotation markers are enabled.
- Render backend `annotations[]` as chart notification markers anchored to the matching candle time.
- Map annotation `direction` to clear visual marker treatments for `BULLISH`, `BEARISH`, `MIXED`, and `NEUTRAL`.
- Group or de-duplicate annotations that share the same chart time so markers do not visually stack into noise.
- Add a selected annotation detail surface that shows title, time, direction, severity, confidence, summary, reaction context, evidence, and event detail link when provided.
- Keep the chart accessible by providing a keyboard-readable annotation list or detail control outside the canvas, not only canvas hover.
- Keep the screen minimal: no hero copy, placeholder future panels, trading recommendations, or always-visible long annotation text over the chart.
- Update API mapping and verification notes to reflect that annotation fetching and rendering are now implemented when the user enables the layer.

## Capabilities

### New Capabilities

- `market-chart-annotation-markers`: Provides optional event annotation markers and annotation detail inspection on the market chart workbench.

### Modified Capabilities

- None.

## Impact

- Affected frontend areas: `app/(main)/market-charts`, `app/api/market-charts/action.ts`, `app/lib/market-charts/definitions.ts`, and `docs/APIMAPPING.md`.
- Uses existing backend endpoint `GET /market-charts/candles` with request fields `assetId`, `timeframe`, `from`, `to`, and `includeAnnotations`.
- Uses existing response fields `annotations[]`, `reaction`, `evidence[]`, and `links.eventDetail`; no backend changes are required.
- Uses the active chart engine dependency and shadcn UI primitives already available in the project where possible.
- Does not add realtime updates, lazy historical loading, technical indicators, drawing tools, separate annotation endpoints, or trade recommendations.
