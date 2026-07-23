## Context

Market chart timeframe support is centered on `MARKET_CHART_TIMEFRAMES`, which drives TypeScript types and Zod request/response validation. The chart workbench and adapter also maintain exhaustive timeframe maps for initial history, short labels, KLineCharts periods, older-history intervals, and quote-only live buckets. The backend now accepts `4h`; the frontend must add it consistently across these existing boundaries.

## Goals / Non-Goals

**Goals:**

- Make `4h` a valid market-chart selection from toolbar and URL through candle and live requests.
- Render four-hour candles with the existing KLineCharts instance and preserve existing asset/timeframe lifecycle behavior.
- Provide useful initial and older-history ranges without adding dynamic retry logic.
- Keep English and Vietnamese dictionary parity.

**Non-Goals:**

- No backend contract, endpoint, provider, or authentication changes.
- No new timeframe abstraction, UI component, dependency, or manual `from`/`to` control.
- No change to the default `1h` selection or to existing timeframe window values.

## Decisions

### Extend the existing central timeframe contract

Add `4h` immediately after `1h` in `MARKET_CHART_TIMEFRAMES`. Existing request/response Zod schemas, URL validation, toolbar iteration, API actions, and the local SSE proxy already consume this shared constant or its inferred type, so no parallel contract is needed.

Alternative considered: add a `4h` exception only in the toolbar or API action. Rejected because it would leave URL, response, and SSE validation inconsistent.

### Reuse the current exhaustive maps

Add the minimum entries required by the existing `Record<MarketChartTimeframe, ...>` maps:

- Toolbar short label: `4H`.
- Initial lookback: 30 days.
- Older-history lookback: 14 days.
- Fixed interval: four hours.
- KLineCharts period: `{ type: "hour", span: 4 }`.

The 30-day initial window yields a practical four-hour dataset across continuous and weekday markets, while the 14-day older window keeps lazy requests smaller. These values match the current `1h` policy and avoid a new window-calculation abstraction.

### Keep quote bucketing aligned to fixed UTC intervals

Use the existing epoch-based bucket calculation with `4 * HOUR_MS`. This produces UTC boundaries at `00:00`, `04:00`, `08:00`, and so on, and preserves the rule that quotes only update the latest REST candle when both share a bucket.

### Verify the cross-cutting mapping with one deterministic script

Add one dependency-free assertion script covering validation, chart period, older-history request boundaries, and same/new four-hour live buckets. Typecheck remains responsible for exhaustive map and dictionary shape coverage.

## Risks / Trade-offs

- Four-hour candles anchored differently by the backend would not match the frontend live bucket → verify the backend returns UTC four-hour boundaries; adjust the shared bucket rule only if that contract differs.
- Static day windows return different candle counts across market calendars → accept approximate coverage, consistent with existing timeframes.
- Adding `4h` to the central union makes every exhaustive timeframe map fail typecheck until updated → update all maps in the same change and use typecheck as the completeness gate.
