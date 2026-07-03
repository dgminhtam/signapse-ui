## Context

The backend now exposes market chart candles and annotations as separate read endpoints. `GET /market-charts/candles` accepts `assetId`, `timeframe`, `from`, and `to`, and returns candle metadata plus `candles[]`. `GET /market-charts/annotations` accepts `assetId`, `from`, and `to`, and returns `MarketChartAnnotationResponse[]`.

The frontend still treats annotations as part of the candle response and still serializes `includeAnnotations`. That drift affects initial chart load, lazy older-history load, response validation, and `docs/APIMAPPING.md`.

## Goals / Non-Goals

**Goals:**
- Align frontend request/response types and actions with the split backend contract.
- Keep existing annotation grouping, marker rendering, popup, and detail behavior.
- Fetch annotations for the same loaded candle windows when the annotation layer is enabled.
- Keep API mapping docs and OpenSpec requirements aligned with `docs/api_mapping.json`.

**Non-Goals:**
- No backend changes.
- No annotation cache, persistence layer, pagination abstraction, or service layer.
- No new chart controls or manual `from` / `to` UI.
- No changes to annotation derivation logic.

## Decisions

1. Keep candle and annotation actions separate.
   - `getMarketChartCandles()` remains responsible only for `/market-charts/candles`.
   - Add `getMarketChartAnnotations()` for `/market-charts/annotations`.
   - Alternative considered: one combined frontend action that fetches both. Rejected because the backend contract is split and the existing chart already has a local view-model boundary.

2. Compose data in the workbench/canvas boundary.
   - The UI can keep a local chart data shape containing `candles` and `annotations`, but the API DTOs should mirror backend responses exactly.
   - This keeps rendering helpers unchanged while preventing API schema validation from accepting stale fields.

3. Use the candle window as the annotation window.
   - Initial load fetches annotations using the initial candle `from` / `to`.
   - Lazy older-history load fetches annotations using the older candle `from` / `to`.
   - The annotations endpoint does not accept `timeframe`; marker placement remains the existing nearest-candle grouping behavior.

4. Treat annotation visibility as UI state, not a candle endpoint flag.
   - Disabling annotations hides markers and annotation copy.
   - Enabling annotations fetches annotation data for the loaded candle range if the data is not already available.

## Risks / Trade-offs

- [Risk] Two requests can partially fail. -> Mitigation: candle failure keeps the chart in error; annotation failure keeps candles visible and shows existing concise annotation/load feedback where available.
- [Risk] Annotation fetch can duplicate older-window data. -> Mitigation: reuse the existing annotation merge-by-id helper.
- [Risk] Active window-mapping work also edits candle request requirements. -> Mitigation: preserve whatever candle window calculation is current and limit this change to endpoint/field ownership.
