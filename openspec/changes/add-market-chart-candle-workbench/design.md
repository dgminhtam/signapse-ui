## Context

The backend exposes `GET /market-charts/candles` as an interim candle bridge protected by `market-chart:read`. The current response contains provider metadata, requested symbol/timeframe/window, and normalized OHLCV candles only. The target asset-level chart endpoint and event annotations remain planned, so the frontend must avoid presenting unsupported asset mapping, watchlist chart routing, or marker explanations as complete product behavior.

The frontend currently has asset and watchlist APIs, but no market chart module, no route, no chart dependency, and no candlestick-capable chart component. The repo uses Next.js App Router, Clerk-backed `fetchAuthenticated()`, shadcn UI primitives, Tailwind v4 neutral tokens, and professional Vietnamese copy.

## Goals / Non-Goals

**Goals:**

- Add a standalone `/market-charts` workbench for authorized users to request and inspect backend candle data.
- Render OHLCV candles with Lightweight Charts inside a shadcn-composed shell.
- Keep chart state shareable and restorable through URL query params.
- Provide clear user feedback for first-run, loading, no-data, invalid-input, API error, and access-denied states.
- Leave a visible but honest path for future event overlays without requiring annotation data now.

**Non-Goals:**

- Do not implement the planned `GET /market-charts/assets/{assetId}` endpoint in the frontend.
- Do not infer provider symbols from internal asset symbols beyond user-supplied `symbol`.
- Do not add workspace watchlist-driven chart selection in this change.
- Do not add realtime streaming, indicators, drawing tools, trade recommendations, or alerting.
- Do not change global shadcn theme tokens or shared `components/ui` primitives.

## Decisions

### Use a standalone market chart route first

The workbench will live under `app/(main)/market-charts` and be added to navigation as `Biểu đồ giá`.

Rationale: the current backend endpoint accepts provider-symbol input, not internal `assetId`. A standalone workbench lets operators validate provider coverage without implying that workspace watchlist assets already have stable provider-symbol mapping.

Alternative considered: embed the chart directly in workspace overview. Rejected for this phase because watchlist-driven chart selection is a later target and would force fragile symbol assumptions.

### Use Lightweight Charts as the chart engine

The chart canvas will be isolated in a client component that creates and destroys a Lightweight Charts instance, maps backend candles into candlestick data, and optionally renders volume as a histogram series.

Rationale: the backend returns OHLCV data, and Lightweight Charts is specialized for financial time-series rendering. shadcn `Chart`/Recharts is a better fit for KPI and summary charts than primary candlestick rendering.

Alternative considered: Apache ECharts. It supports candlestick charts and richer dashboard features, but is heavier and less focused for the MVP trading-style canvas.

### Keep controls in a shadcn UI shell

The UI around the canvas will use shadcn primitives already present in the repo where possible: `Input`, `Select`, `Button`, `Badge`, `Skeleton`, `Empty`, and `Sheet` for future detail surfaces. If a segmented timeframe control is preferred during implementation, add shadcn `toggle-group` as a small focused component addition.

Rationale: the chart engine should not own product controls, page hierarchy, error handling, or copy. This keeps the feature consistent with Signapse admin surfaces.

### Use explicit submit and URL state

The workbench will validate `symbol`, `timeframe`, `from`, and `to`, then update URL query params and fetch chart data. It will not live-fetch on each input change.

Rationale: provider-backed candle requests are more expensive than local filtering, and the user is choosing a chart window rather than typing a list search. URL state makes chart windows shareable and supports server/client reload.

### Build a flat market chart request serializer

The API action will serialize query params as `symbol`, `timeframe`, `from`, and `to` rather than using the list `queryParamsToString()` helper or nesting a `request` object.

Rationale: the backend controller binds a `MarketChartCandleRequest` bean from flat query parameters, even though the OpenAPI snapshot describes the query as an object named `request`.

## Risks / Trade-offs

- [Provider symbol ambiguity] → The UI will label the field as provider symbol and use examples/helper copy. Internal asset picker integration remains out of scope until provider-symbol mapping exists.
- [Client-only chart dependency] → Isolate Lightweight Charts in a `"use client"` component and avoid importing it from Server Components.
- [Large candle windows hurting performance] → Validate windows through sensible presets and avoid unbounded default ranges. If needed, add later guardrails for maximum range per timeframe.
- [No annotations yet] → Show an honest future-event panel or disabled overlay state, not fake markers.
- [Attribution requirement] → Include the required TradingView attribution treatment in the chart surface or nearby legal/help copy during implementation.

## Migration Plan

1. Add the dependency and market chart frontend module.
2. Add route, navigation, breadcrumb, permission guard, and shell states.
3. Implement the chart client component and candle mapping.
4. Verify with a local backend request using provider symbols known to return data.
5. Roll back by removing the route/nav entry and dependency if the provider bridge proves unavailable.

## Open Questions

- No blocking open questions for implementation.
- The first implementation will use `Select` for timeframe to avoid adding a shadcn component beyond the chart dependency.
- The first-run view will not auto-fetch. It may prefill sensible form defaults, but the user submits explicitly before the backend is called.
- Symbol examples are helper copy only and must not imply provider coverage until verified locally.
