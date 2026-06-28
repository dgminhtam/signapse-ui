## Context

The market chart workbench currently builds its latest candle request with a fixed 7-day lookback. That works for intraday charts but returns too few or zero candles for `1w` and `1mo`, even though the backend supports those timeframe values.

Lazy history already has a timeframe-aware target concept. This change keeps the same simple local mapping style and applies explicit day windows for first load and older-history load.

## Goals / Non-Goals

**Goals:**
- Load roughly 100 candles on first chart load for every supported timeframe.
- Load a smaller older-history window after the initial load.
- Keep backend timeframe values unchanged.

**Non-Goals:**
- No backend API changes.
- No retry loop to request until the frontend reaches an exact candle count.
- No new UI controls for manual `from` / `to`.

## Decisions

- Use static day-window maps keyed by `MarketChartTimeframe`.
  - Initial windows: `1m=1`, `5m=1`, `15m=2`, `30m=4`, `1h=7`, `1d=150`, `1w=770`, `1mo=3650`.
  - Older windows: `1m=1`, `5m=1`, `15m=1`, `30m=2`, `1h=4`, `1d=75`, `1w=385`, `1mo=1825`.
- Keep values as day counts because existing request builders already use `Date` arithmetic and backend accepts `from` / `to` timestamps.
- Do not align requests to week/month boundaries in frontend; backend remains responsible for candle bucketing.

## Risks / Trade-offs

- Monthly initial requests cover about ten years, which is wider than intraday requests -> Acceptable because monthly candle volume is small.
- Exact returned candle count can differ from 100 due to market calendars and backend boundary rules -> Use "approximately 100" instead of dynamic retries.
