## 1. Contract And Streaming Boundary

- [x] 1.1 Add market chart live response types and Zod schemas for `snapshot`, `price`, `candle`, `status`, and `error` payloads.
- [x] 1.2 Update candle request validation/query building so omitted `includeAnnotations` resolves to `true`.
- [x] 1.3 Add a same-origin Next SSE route proxy for `GET /market-charts/live` that validates `assetId` and `timeframe`, obtains a fresh Clerk token server-side, calls the backend stream, and forwards `text/event-stream`.
- [x] 1.4 Add a client-side market chart live stream helper that connects to the same-origin SSE route, dispatches named events to typed handlers, and exposes close/abort cleanup.

## 2. Workbench Runtime State

- [x] 2.1 Add market chart runtime state buckets for historical data, annotations, live quote, live partial candle, live status, and live error.
- [x] 2.2 Open exactly one live stream for the active selected watchlist `assetId` and timeframe.
- [x] 2.3 Abort or close the previous live stream when asset, timeframe, workspace context, or component lifecycle changes.
- [x] 2.4 Handle `snapshot`, `price`, `candle`, `status`, and `error` events without clearing historical candles or annotations.

## 3. Chart Data Application

- [x] 3.1 Derive displayed candles from historical candles plus the current live partial candle without mutating historical candles as final data.
- [x] 3.2 Implement the smallest safe KLineCharts update path for right-edge live candle changes without rebuilding the chart instance on every live tick.
- [x] 3.3 Ensure historical refresh and lazy-loaded completed candles replace overlapping live partial candle data by timestamp.
- [x] 3.4 Keep lazy older candle requests aligned with the `includeAnnotations=true` default and hide annotation UI when the annotation toggle is off.

## 4. UI And Copy

- [x] 4.1 Render compact Vietnamese live status feedback for connecting, live, stale, reconnecting, disconnected, unsubscribed, and error states.
- [x] 4.2 Keep the market chart visible during stale, reconnecting, disconnected, and error states.
- [x] 4.3 Add localized copy for live stream status, stream errors, and any SSE route validation errors.
- [x] 4.4 Update market chart skeleton/status rail only where needed so loading and live status placement remain stable.

## 5. Verification

- [x] 5.1 Run `openspec validate integrate-market-chart-live-sse --strict`.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm lint`.
- [x] 5.4 Run static search to confirm the frontend does not open a provider WebSocket, expose Twelve Data credentials, or add direct browser access to `API_BASE_URL`.
- [x] 5.5 Deterministically review stream lifecycle paths to confirm old streams are closed before new streams open.

User-owned manual QA note: verify against a live backend stream that events arrive incrementally through the proxy and that chart updates feel smooth under real provider timing.
