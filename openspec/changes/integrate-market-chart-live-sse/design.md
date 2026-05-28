## Context

Market chart currently loads historical candles through `GET /market-charts/candles`, renders them with KLineCharts, supports lazy older history, and optionally displays backend annotations as chart markers. Backend now documents a second runtime flow: `GET /market-charts/live` emits named SSE events for the selected `assetId` and `timeframe`.

The backend reference explicitly keeps Twelve Data credentials and provider WebSocket handling server-side. Frontend consumes the Signapse SSE endpoint only. Because Signapse API calls use Clerk bearer tokens and `API_BASE_URL` is currently a server-only environment variable, the browser should not directly construct authenticated backend URLs unless a public API base URL is intentionally introduced.

## Goals / Non-Goals

**Goals:**

- Add a single authenticated live stream per active market chart asset/timeframe.
- Keep historical candles visible while live stream status changes.
- Apply live quote and current partial candle updates without resetting the chart workspace.
- Keep annotation payload requests defaulted to `true` while letting the annotation toolbar toggle control whether markers/details are displayed.
- Keep stream status compact and aligned with the existing market chart status rail/workbench chrome.

**Non-Goals:**

- Do not open WebSocket connections from frontend to Twelve Data or any provider.
- Do not persist live partial candles as final historical candles in frontend state.
- Do not add manual `from`/`to` controls, live range controls, or new URL params.
- Do not implement trade recommendations, provider configuration UI, or chart engine migration.
- Do not implement offline caching or cross-tab stream sharing.

## Decisions

### Prefer a same-origin Next SSE proxy

Add a narrow Next route handler for the market chart live stream when implementing the SSE boundary. The browser connects to the same-origin route with normal Clerk/session context, while the route handler obtains a fresh Clerk token server-side, calls backend `GET /market-charts/live`, and proxies the `text/event-stream` response body to the client.

This keeps `API_BASE_URL` and bearer tokens server-side and may allow the browser to use native `EventSource` without a new dependency. If the route proxy cannot preserve streaming semantics reliably, the fallback is a fetch-based SSE client such as `@microsoft/fetch-event-source` plus an explicitly approved public API base URL and token acquisition path.

Alternative considered: direct native `EventSource` to the backend. This cannot attach bearer `Authorization` headers and would require backend cookie/session auth plus a browser-visible backend URL.

### Keep live stream ownership in the market chart workbench

The workbench should own stream lifecycle because it owns selected asset, timeframe, annotation visibility, loading phase, and quick detail state. It should open exactly one stream for the active `{ assetId, timeframe }` pair, abort it before opening another, and abort on unmount.

Alternative considered: open the stream inside the canvas adapter. That would couple auth/network lifecycle to KLineChart rendering and make it easier to accidentally create duplicate streams during canvas remounts.

### Keep history and live runtime state separate

Represent runtime state with separate buckets for historical candles, annotations, live quote, live partial candle, live status, and live error. The displayed candle series can merge history plus live partial candle as a derived view, but the source state should not overwrite historical candles until a candle response refreshes that time bucket.

This preserves the BE rule that `candle` stream events are partial and prevents stale live data from being treated as persisted history.

### Use upsert rules for live partial candles

When a `candle` event arrives:

- If its `time` equals the latest displayed candle time, overlay/update that candle in the rendered series.
- If its `time` is newer than the latest displayed candle time, append it as a partial candle.
- If its `time` is older than the latest displayed candle time, ignore it unless the chart adapter can safely update that visible bucket without disrupting lazy history.

When a historical refresh or lazy load returns completed candles, those completed candles replace overlapping live partial data in the derived view.

### Treat annotation fetching and annotation visibility as separate concerns

Default candle requests should include annotations (`includeAnnotations=true`) to match the backend reference contract. The annotation toolbar toggle should control whether markers, popup/detail surfaces, and annotation status text are displayed. If a future performance issue requires not downloading annotations while hidden, that should be a separate optimization proposal because it changes the data availability contract.

### Show stream health without disrupting chart state

Live stream states should be rendered as compact operational metadata, not as a blocking page state. `CONNECTING` and `RECONNECTING` can show pending live feedback; `CONNECTED` and `SUBSCRIBED` can show live feedback; `STALE`, `DISCONNECTED`, `UNSUBSCRIBED`, and `ERROR` should keep historical candles visible and show concise Vietnamese status/error copy.

## Risks / Trade-offs

- [Risk] A Next route proxy can accidentally buffer the stream instead of forwarding events promptly. → Mitigation: implement the route as a streaming response, preserve `text/event-stream`, and verify that events arrive incrementally during development.
- [Risk] Reconnect attempts can reuse stale Clerk tokens. → Mitigation: resolve a fresh token at the server-side SSE boundary before each backend stream open and abort the old controller first.
- [Risk] KLineCharts data loader is currently optimized for initial load and older-history prepend, not live right-edge updates. → Mitigation: add a narrow canvas adapter path for derived candle data/live partial updates and avoid chart remounts unless asset/timeframe identity changes.
- [Risk] Live partial candles and lazy historical prepends can overlap. → Mitigation: de-duplicate by timestamp and let completed historical candle responses win over live partial data.
- [Risk] Defaulting annotations to true increases payload size when markers are hidden. → Mitigation: keep UI visibility separate now for contract consistency; revisit with a measured performance optimization if annotation payload size becomes a problem.

## Migration Plan

1. Add live DTO/schema and an authenticated SSE boundary.
2. Update candle request defaults so omitted `includeAnnotations` resolves to `true`.
3. Add workbench-owned live runtime state and stream lifecycle.
4. Extend the chart data view-model/canvas adapter to apply live quote and partial candle updates without remounting the chart.
5. Add compact stream status UI and localized copy.
6. Validate with typecheck, lint, OpenSpec validation, static search for direct provider WebSocket usage, and deterministic review of stream cleanup paths.

Rollback is straightforward: remove the stream hook/helper usage from the workbench and keep historical candle loading as the source of chart data.

## Open Questions

- Whether the backend supports cookie/session auth for SSE is not required for this design, but if confirmed later it could remove the need for a fetch-based SSE dependency.
- KLineCharts v10 exposes `setDataLoader` and `getDataList`, but no obvious public `updateData` API in the installed typings; implementation should spike the smallest safe right-edge update path before changing chart lifecycle code.
