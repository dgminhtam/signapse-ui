## Context

The backend live SSE stream emits `snapshot`, `price`, `candle`, `status`, and `error` events. In practice, `price` events can arrive while `snapshot.candle` is `null` and no `candle` event has arrived yet. The frontend currently stores quote events but only passes live candle data into `MarketChartCanvas`, so the chart does not visually update on quote-only streams.

The backend also emits `MARKET_CLOSED`, while the frontend live status contract does not accept that state.

## Goals / Non-Goals

**Goals:**

- Accept the backend `MARKET_CLOSED` live status without treating it as an invalid payload.
- Let incoming quote events update the displayed latest candle for the active asset and timeframe.
- Keep the chart canvas candle-oriented and reuse the existing live candle update path.

**Non-Goals:**

- Do not change backend SSE events or add a backend-generated synthetic candle.
- Do not add a quote-specific rendering path to `MarketChartCanvas`.
- Do not change auth, workspace, or watchlist behavior.

## Decisions

1. Add `MARKET_CLOSED` to the frontend live stream state union and schema.

   Alternative considered: map unknown backend states to `STALE`. Rejected because it hides a real backend contract value and keeps the parser fragile.

2. Derive a display-only live candle from quote events in frontend market chart code.

   The derivation should use the latest known candle and active timeframe:
   - same bucket: update `close`, raise `high` if quote price is higher, lower `low` if quote price is lower, keep `open` from the bucket
   - newer bucket: create a partial candle with `open/high/low/close` equal to quote price
   - stale quote bucket: ignore for chart rendering

   Alternative considered: change the backend to emit candle events for every quote. Rejected because the frontend already has chart context and this would expand the backend contract for a display-only concern.

3. Keep `MarketChartCanvas` unchanged.

   The canvas already consumes live partial candles through `subscribeBar`; feeding it a derived candle keeps the adapter boundary small.

## Risks / Trade-offs

- Quote-derived candles may not include provider volume -> keep volume absent instead of synthesizing zero.
- Bucket calculation must match timeframe semantics -> use one shared helper and verify fixed examples for hourly and daily buckets.
- A real candle event may arrive after derived quote data -> real candle data should replace the derived candle through the existing live candle state path.
