## Context

The market chart workbench receives backend SSE events through the frontend proxy and stores quote and partial candle events separately. The current rendered live candle prefers `liveState.candle` whenever it exists, so later quote ticks can be ignored for candle rendering even while the price marker moves.

The existing frontend already has quote-to-candle derivation helpers. The fix should reuse that path instead of changing the backend stream contract.

## Goals / Non-Goals

**Goals:**

- Keep the rightmost displayed candle aligned with the latest eligible live quote for the active timeframe.
- Preserve protection against stale quote or candle events regressing the chart.
- Keep the SSE proxy and backend event contract unchanged.

**Non-Goals:**

- Do not add a new chart engine, stream protocol, dependency, or backend aggregation requirement.
- Do not change historical candle fetching, annotation rendering, drawings, or lazy history loading.

## Decisions

- Derive the displayed live candle from the best available frontend live data, not from `liveState.candle` alone.
  - Prefer a real candle event as the base when it is current.
  - Allow a newer or same-bucket quote to update that live candle close/high/low.
  - Ignore quote events older than the displayed latest bucket.

- Keep quote-derived candles display-only.
  - They continue to flow through the existing `liveCandle` prop into klinecharts.
  - They do not mutate completed historical candle responses.

- Reuse existing helpers where possible.
  - Extend or adjust `deriveLiveCandleItemFromQuote` only if the current helper cannot use a live candle as its base.
  - Avoid introducing a new live candle store unless the helper approach cannot express the merge.

## Risks / Trade-offs

- A quote with provider time mapped to the wrong bucket could create or update the wrong partial candle -> keep existing bucket/time validation and stale checks.
- Quote volume may be missing or tick-level rather than candle-level -> keep volume optional unless finite volume is supplied.
- Real candle events may contain authoritative OHLC from the backend -> use them as the base, then only apply newer eligible quote movement for display freshness.
