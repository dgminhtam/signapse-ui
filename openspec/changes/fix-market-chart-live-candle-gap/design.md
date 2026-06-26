## Context

The market chart workbench receives backend SSE events through the frontend proxy and currently stores quote and partial candle events separately. Rendering an SSE candle as the rightmost candle can replace REST-loaded OHLC values, which is too much authority for the live stream path.

The frontend should treat REST candle data as authoritative for candle shape. SSE quotes may update the displayed latest close price, but SSE candle payloads should not create or replace candles.

## Goals / Non-Goals

**Goals:**

- Keep the rightmost displayed candle close aligned with the latest eligible live quote for the active timeframe bucket.
- Preserve REST-loaded open, high, low, time, and volume for the rightmost candle.
- Preserve protection against stale quote events regressing the displayed close.
- Keep the SSE proxy and backend event contract unchanged.

**Non-Goals:**

- Do not add a new chart engine, stream protocol, dependency, or backend aggregation requirement.
- Do not change historical candle fetching, annotation rendering, drawings, or lazy history loading.
- Do not synthesize new candle buckets from live quotes.

## Decisions

- Derive the displayed live candle from REST-loaded candles plus the latest eligible quote.
  - Use the latest REST-loaded candle as the only candle base.
  - If the quote maps to the same timeframe bucket as that candle, copy the candle and update only `close`.
  - Ignore quote events older than or newer than the latest REST-loaded bucket.

- Ignore SSE candle payloads for rendering.
  - The stream handler may keep accepting `candle` events to preserve the backend contract, but workbench render state should not use them as `liveCandle`.
  - `snapshot.candle` follows the same rule; only `snapshot.quote` and status matter for this behavior.

- Reuse existing helpers where possible.
  - Adjust the current quote derivation helper or replace it with the smallest close-only helper.
  - Keep the existing `liveCandle` prop into klinecharts so canvas wiring stays narrow.

## Risks / Trade-offs

- A quote with provider time mapped to the wrong bucket could update the wrong candle -> require same-bucket matching against the latest REST-loaded candle.
- The chart may not display a brand-new bucket until REST refresh returns it -> accepted trade-off to avoid synthesizing frontend OHLC.
- Backend candle events may contain fresher OHLC than REST -> ignored by design until REST refresh makes them authoritative.
