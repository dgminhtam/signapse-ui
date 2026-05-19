## Context

The backend exposes `GET /market-charts/candles` as an asset-first candle endpoint protected by `market-chart:read`. The latest OpenAPI snapshot changes the request identity from `symbol` to `assetId`, adds optional `includeAnnotations`, and can return provider metadata, resolved `asset`, normalized OHLCV candles, and `annotations[]`.

The frontend already has workspace watchlist APIs through `GET /watchlists`, where each item includes `assetId`, `assetName`, `assetSymbol`, and `assetType`. The chart workbench should use those watchlist assets as the only selectable market universe for the current workspace.

## Goals / Non-Goals

**Goals:**

- Add a standalone `/market-charts` workbench for authorized users to inspect latest candle data for assets in the current workspace watchlist.
- Render OHLCV candles with KLineChart inside a shadcn-composed shell.
- Let users choose a watchlist asset and timeframe, not type arbitrary provider symbols.
- Keep chart state shareable and restorable through URL query params `assetId` and `timeframe`.
- Hide manual time-window inputs. The UI should always request the latest chart window by computing `to = now` and `from = now - 7 days`.
- Send `assetId` to the backend candle endpoint and let backend own asset-to-provider-symbol resolution.
- Parse `asset` and `annotations[]` from the candle response, while keeping annotation rendering disabled for this MVP.
- Provide clear user feedback for first-run, watchlist loading, empty watchlist, invalid asset selection, candle loading, no-data, API error, and access-denied states.
- Leave a visible but honest path for event overlays and later older-history loading without requiring additional backend contracts in the MVP.

**Non-Goals:**

- Do not implement the planned `GET /market-charts/assets/{assetId}` endpoint in the frontend.
- Do not derive or maintain frontend provider-symbol mapping for candle requests.
- Do not expose manual `from` or `to` controls.
- Do not render chart event markers, annotation popups, or annotation side panels in this contract-sync revision.
- Do not implement lazy loading of older candles in the original MVP; the follow-up `add-market-chart-lazy-history-loading` change owns the actual older-history behavior.
- Do not add realtime streaming, indicators, drawing tools, trade recommendations, or alerting.
- Do not change global shadcn theme tokens or shared `components/ui` primitives.

## Decisions

### Use a standalone route backed by the current workspace watchlist

The workbench will live under `app/(main)/market-charts` and be added to navigation as `Biểu đồ giá`.

The page should require both `market-chart:read` and `watchlist:read`. If the user can read candles but cannot read the watchlist, the route cannot offer valid asset choices and should show access denied or an equivalent permission-aware state.

Rationale: the product intent is to chart assets the workspace tracks. This keeps the chart aligned with workspace context and avoids turning the screen into a provider-symbol testing console.

### Use watchlist asset selection instead of free symbol input

The workbench loads workspace watchlist assets with `getWorkspaceWatchlistAssets()` and displays them in a controlled `Select` or combobox. Each option should show at least `assetSymbol` and `assetName`, with `assetType` as supporting metadata when useful.

The selected asset should be represented in UI state by `assetId`. When requesting candles, the frontend sends the selected watchlist item's numeric `assetId` to the backend. The watchlist item's `assetSymbol` and `assetName` remain useful for selector labels and immediate UI continuity, but they are not the request contract.

Rationale: `assetId` is stable for URL, UI selection, permission checks, and backend provider-symbol resolution. This removes the frontend assumption that watchlist `assetSymbol` is provider-compatible.

### Sync to the new asset-based candle contract

The market chart action should serialize a flat query string with:

```text
assetId=<number>&timeframe=<value>&from=<ISO-8601>&to=<ISO-8601>&includeAnnotations=false
```

`includeAnnotations=false` is intentional for the current UI because the chart screen has just been simplified and does not yet render marker UX. The DTO/schema should still accept `annotations[]` with a default empty array so enabling marker rendering later is a product/UI change rather than another parsing change.

The response schema should parse:

- `asset`: internal chart asset `{ id, name, symbol, type }`.
- `provider`: optional provider metadata for low-priority stats/debug display.
- `candles[]`: existing OHLCV data.
- `annotations[]`: event marker payload, stored in typed data but not rendered yet.

If backend continues returning top-level `symbol` during migration, FE may parse it as optional compatibility metadata, but display should prefer `response.asset.symbol`.

### Keep URL state to asset and timeframe only

The route query should use:

```text
/market-charts?assetId=123&timeframe=1h
```

The URL should not include `symbol`, `from`, or `to`.

Rationale: links should reopen the latest chart for the same workspace asset/timeframe. A stale `to` timestamp would make shared chart links age poorly and conflict with the future lazy-load model.

### Compute the latest rolling window internally

For the MVP, every candle fetch computes:

```text
to = new Date().toISOString()
from = now - 7 days
```

The UI can describe this as `Dữ liệu 7 ngày gần nhất` and display the actual returned `from/to` metadata after a response. Refresh should recompute `to = now`, not reuse a previous timestamp.

Rationale: the chart should feel current by default. Manual date entry is unnecessary while the target design is drag or scroll based lazy loading.

### Keep lazy historical loading compatible with the route model

The initial implementation did not load more candles while panning. Keeping `from/to` out of the URL and form intentionally prepared the model for the follow-up `add-market-chart-lazy-history-loading` change, where the chart approaches the left edge and requests older windows internally.

Lazy-load shape:

```text
visible range nears oldest loaded candle
        |
        v
request older window ending before current oldest candle
        |
        v
prepend candles, preserve viewport
```

### Use KLineChart as the chart engine

The chart canvas will be isolated in a client component that creates and destroys a KLineChart instance, maps backend candles into candlestick data, and optionally renders volume as a secondary indicator layer.

Rationale: the backend returns OHLCV data, and KLineChart is specialized for financial time-series rendering while avoiding TradingView runtime branding. shadcn `Chart`/Recharts is a better fit for KPI and summary charts than primary candlestick rendering.

### Keep controls in a shadcn UI shell

The UI around the canvas will use shadcn primitives already present in the repo where possible: `Select`, `Button`, `Badge`, `Skeleton`, `Empty`, and related field components.

Rationale: the chart engine should not own product controls, page hierarchy, error handling, or copy. This keeps the feature consistent with Signapse admin surfaces.

### Simplify the chart workbench to a data-first surface

The market chart screen should remove descriptive copy that does not help the user read or operate the chart. Breadcrumb/header already provides page identity, so the body should not repeat a large `Biểu đồ giá` heading, decorative badges, or explanatory paragraphs about watchlists, OHLCV, or backend implementation.

Target structure:

```text
[Asset selector] [Timeframe selector] [Refresh]
                                      Updated at ...

[Chart canvas] [Compact stats rail]
```

The chart header should keep only scan-critical badges or inline metadata such as asset symbol, timeframe, and provider when they are not already visible in controls. The right rail should be a compact market stats rail, not a narrative card stack.

Remove from the main screen:

- Decorative badges like `Watchlist workspace`, `OHLCV mới nhất`, or `Candle bridge`.
- Repeated body heading and descriptive hero paragraph when breadcrumb/page header already names the route.
- Card descriptions such as `Snapshot 7 ngày gần nhất...` when the metric labels and values are self-explanatory.
- The future `Lớp sự kiện` panel. Until annotation data exists, expose future-event status only as small secondary metadata or omit it.
- Footer copy explaining the backend/provider unless it is needed for attribution compliance.

Rationale: this screen is an operational chart workspace. The dominant task is reading price movement, not reading product explanation. Extra copy competes with the chart and creates a demo-like feel.

### Handle chart vendor attribution without chart clutter

KLineChart is the active chart engine and does not require TradingView runtime attribution. If a future chart dependency requires attribution, the UI should place it in a low-clutter but user-visible location rather than adding explanatory copy to the primary chart surface.

Implementation must not keep stale attribution from a previous chart engine.

Rationale: license compliance matters, but stale vendor copy creates confusion after an engine migration.

### Build a flat market chart request serializer

The API action will continue serializing backend candle query params as flat keys rather than using the list `queryParamsToString()` helper or nesting a `request` object. The flat keys should now be `assetId`, `timeframe`, `from`, `to`, and optional `includeAnnotations`.

Rationale: the backend controller binds a `MarketChartCandleRequest` bean from flat query parameters, even though the OpenAPI snapshot describes the query as an object named `request`.

## Risks / Trade-offs

- [Contract drift during backend rollout] -> `docs/api_mapping.json` still describes a top-level `symbol` in response while the backend reference type centers `asset.symbol`. FE should treat top-level `symbol` as optional compatibility data and prefer `asset`.
- [Annotation payload without UI] -> Backend may return annotations by default, but the current UI intentionally does not render markers. Sending `includeAnnotations=false` keeps payload and expectations small until marker UX is proposed.
- [Empty watchlist] -> The route must offer a useful empty state and link/CTA back to workspace watchlist management rather than rendering an unusable chart shell.
- [Large candle windows] -> A fixed seven-day default is simple, but very small timeframes can produce many candles. If performance becomes an issue, add timeframe-specific default windows in a follow-up.
- [Client-only chart dependency] -> Isolate KLineChart in a `"use client"` component and avoid importing it from Server Components.
- [No annotations yet] -> Show an honest future-event panel or disabled overlay state, not fake markers.
- [Attribution requirement] -> Do not keep stale attribution from a previous chart engine; only render vendor attribution when the active dependency requires it.

## Migration Plan

1. Keep the existing market chart dependency, DTOs, route, and chart canvas.
2. Add watchlist loading and permission handling to the market chart route/workbench.
3. Replace the free symbol and date inputs with watchlist asset selection plus timeframe selection.
4. Change URL state to `assetId` and `timeframe`.
5. Compute the rolling latest candle window at fetch time and keep backend request serialization flat.
6. Update the market chart DTO/action to send `assetId` and parse `asset` plus `annotations[]`.
7. Verify with a logged-in workspace that has at least one watchlist asset whose backend `assetId` returns candles.

## Open Questions

- No blocking open questions for the proposal.
- The MVP will use a fixed seven-day latest window for every timeframe unless implementation reveals a clear performance issue.
- If the current watchlist has assets, the workbench may auto-select the first asset when no `assetId` exists in the URL; otherwise it should show a clear choose-asset or empty-watchlist state.
- The backend reference contract says `includeAnnotations` defaults to `true`; this proposal intentionally sends `false` until marker UX is scoped. If product wants marker preview immediately, create a separate annotation rendering proposal.
