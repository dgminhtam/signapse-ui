## Why

The backend split market chart annotations out of the candle endpoint: candles now return candles only, while annotations are fetched from `GET /market-charts/annotations`. The frontend still sends `includeAnnotations` and validates `annotations[]` on candle responses, so the current chart path can reject the new backend payload before rendering.

## What Changes

- **BREAKING** Remove `includeAnnotations` from frontend candle requests.
- **BREAKING** Stop parsing `annotations[]` from `GET /market-charts/candles`.
- Add an authenticated frontend action for `GET /market-charts/annotations` using `assetId`, `from`, and `to`.
- Keep the existing annotation grouping/rendering helpers and feed them with annotation endpoint data.
- Update latest-load and lazy-history flows so annotation fetching follows the currently loaded candle window when the annotation layer is enabled.
- Update the API mapping ledger and OpenSpec requirements to describe the split contract.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `market-chart-candle-workbench`: Candle requests and response parsing must match the candles-only backend contract.
- `market-chart-annotation-markers`: Annotation marker data must come from the dedicated annotations endpoint instead of the candle response.
- `market-chart-lazy-history-loading`: Older-history loading must fetch older annotations separately when annotation markers are enabled.
- `api-mapping-ledger`: The frontend API ledger must document `/market-charts/annotations` and remove stale candle annotation notes.

## Impact

- Affects market chart API types/schemas and actions in `app/lib/market-charts/definitions.ts` and `app/api/market-charts/action.ts`.
- Affects market chart data loading in `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`, `market-chart-canvas.tsx`, and `market-chart-history-helpers.ts`.
- Affects `docs/APIMAPPING.md` and related OpenSpec specs.
- No new dependencies, UI controls, persistence layer, or backend changes.
