## Context

Market Charts currently treats candle history as a calendar-time range. That assumption fails for sparse provider history: a requested range can be empty although older available candles exist. The backend now confirms a count-back contract: it returns up to N available candles immediately before an exclusive, timeframe-aligned `to` anchor and ignores provider gaps. A short non-empty page is valid for sparse or discontinuous history and does not prove that older candles are unavailable; only the contract's exact empty response does.

The chart has separate historical candle, annotation, economic-calendar, and live SSE flows. Candle loading is the source of the displayed candle interval; annotation and calendar APIs remain range-based. The route intentionally exposes only asset and timeframe, and all user-facing recovery copy must remain localized.

## Goals / Non-Goals

**Goals:**

- Make sparse assets load the configured number of available candles whenever that history exists.
- Use one bounded, typed count-back request policy for initial, refresh, and older-history loading.
- Generate deterministic UTC end-boundary anchors for every supported timeframe.
- Preserve stable chart prepend, live updates, retry behavior, and route state.
- Keep annotations and calendar events aligned with the actual displayed candle interval.
- Cover sparse-history behavior with deterministic tests and fixtures.

**Non-Goals:**

- Change backend count-back semantics, add backend response fields, or introduce a compatibility API version.
- Repair provider history, synthesize candles, or alter live SSE protocol behavior.
- Redesign the chart, change indicators/drawings, or replace the chart engine.
- Retain the old time-range candle request as a fallback or feature-flagged path.
- Automatically probe another page after a short response, empty response, or API failure.

## Decisions

### Count-back is the only frontend candle request mode

The frontend candle request will contain `assetId`, `timeframe`, exclusive `to`, and `countBack`; it will omit `from`. For initial and refresh loading, `to` is the UTC end boundary of the candle bucket containing the current request time. This permits a forming current candle to be returned as `partial=true`. For an older page, `to` is exactly the oldest loaded candle timestamp; the frontend does not subtract an interval or re-round it.

UTC boundary rules are deterministic: minute buckets align to UTC minute zeroes and their 5/15/30-minute multiples; hourly buckets align to UTC hour zeroes and four-hour buckets begin at 00:00, 04:00, 08:00, 12:00, 16:00, or 20:00; daily buckets begin at 00:00Z; weekly buckets begin at ISO Monday 00:00Z; and monthly buckets begin on day 1 at 00:00Z. If the request time is exactly a boundary, it belongs to the new bucket, so the initial anchor is that new bucket's end boundary.

This removes ambiguous precedence between a calendar range and a count. Keeping `from` as a guard would reintroduce the sparse-range failure mode; retaining a fallback would hide backend-contract regressions rather than surface them.

### Page sizes preserve current chart density

Initial and older pages use the agreed per-timeframe counts, with a frontend bound of 1 through 1000:

| Timeframe | Initial | Older |
| --- | ---: | ---: |
| 1m | 1000 | 1000 |
| 5m | 288 | 288 |
| 15m | 192 | 96 |
| 30m | 192 | 96 |
| 1h | 720 | 336 |
| 4h | 180 | 84 |
| 1d | 150 | 75 |
| 1w | 110 | 55 |
| 1mo | 120 | 60 |

These counts preserve the existing visual density where it fits the backend limit; the one-minute policy is capped at 1000 by that limit. A single uniform count was rejected because it would materially change the current reading density across timeframes. An unbounded count was rejected for payload and provider-cost risk.

### Only the exact empty response exhausts history

A successful older page with one or more valid candles remains pageable even when it contains fewer candles than its requested count. The next user-triggered older request uses the timestamp of that page's oldest candle as its exclusive anchor. The frontend does not automatically request another page merely because a page is short.

The active chart identity is exhausted only when a successful older response explicitly has `candles=[]` and its `from` and `to` both equal the request anchor. The response schema does not coerce a missing or malformed candle array into this outcome. API/provider failures remain retryable and do not change exhaustion state. A non-empty response that yields no strictly older candle after normalization and de-duplication violates the paging contract; the frontend treats it as a retryable response error rather than silently marking history exhausted. Asset, timeframe, workspace, and refresh identity changes reset exhaustion; toggling an ancillary layer does not.

### Partial candles are preserved and rendered

The frontend response type and runtime schema retain optional `partial` on historical candles. A partial candle is valid price data: it is rendered, may be merged with live updates, and is never filtered or forward-filled merely because it is still forming.

### Displayed candle interval is derived locally

The frontend derives the displayed candle interval from normalized available candles, rather than trusting the previous request's calendar range. Its start is the earliest displayed candle; its exclusive end is the end of the latest displayed candle bucket, clamped to the count-back anchor when the latest candle is partial. The preserved `partial` flag makes this clamp deterministic.

This interval is the only range passed to annotations and economic-calendar loading. An empty candle result has no displayed interval and therefore triggers no ancillary metadata request. This avoids a new backend response field and prevents markers from describing provider gaps outside the rendered price context.

### Ancillary loading follows the candle result

Initial, refresh, and older loading fetch candles first. When a non-empty result creates a displayed candle interval, enabled annotation and calendar layers fetch their data for that interval. Calendar requests retain existing impact selection and backend-safe range chunking; they no longer extend into future calendar time merely because the chart request anchor is current time.

### Live updates do not rebalance historical count

Count-back controls historical page loads only. A live SSE candle can replace the latest bucket or append a newer bucket without a chart-wide reset, immediate historical trim, or refetch. A later initial load or refresh restores the configured historical target.

### Testing centers on deterministic loading policy

The existing vendor-free market-chart history helper seam will own count-back request construction, UTC-boundary calculation, displayed-interval derivation, and page-outcome classification. This permits deterministic coverage without a browser or chart engine. A small authenticated request-boundary test verifies transport serialization, while focused component behavior tests cover short-page continuation, exact-empty exhaustion, partial rendering, and retry feedback.

## Risks / Trade-offs

- [Sparse N candles can span a long calendar interval] → Ancillary calls use the derived displayed interval, existing maximum range chunking, layer-enable gates, and selected impacts; no arbitrary hidden date cutoff is introduced.
- [Backend/frontend disagree about the count bound or exclusive anchor] → Validate `countBack` locally, use one UTC-boundary helper, document the contract in the mapping ledger, and verify every timeframe with tests.
- [Sparse short page is mistaken for terminal history] → Keep short non-empty pages pageable and set exhaustion only from the exact empty-response invariant.
- [A stale request resolves after asset or timeframe changes] → Retain the existing chart identity/load-id guard so stale history cannot merge into the new chart.
- [Duplicate or malformed provider candles] → Normalize and filter before interval derivation and prepend; treat a non-empty response with no strictly older candle as retryable rather than terminal.
- [No historical candle exists] → Render a localized no-data state with retry and do not manufacture price data from a live quote.

## Migration Plan

1. Implement the typed count-back request, partial-candle mapping, and deterministic UTC-boundary policy after the backend contract is deployed.
2. Switch initial, refresh, and older-history callers together; do not leave a mixed `from`/`countBack` path.
3. Route enabled annotation and calendar loading through the derived displayed candle interval.
4. Add fixtures and tests, then update the API mapping ledger to show frontend integration.
5. If a critical backend regression occurs, roll back the frontend release; no data migration or persisted-state rollback is needed.

## Open Questions

None. Count-back semantics, request shape, bounds, paging behavior, metadata scope, live behavior, rollout policy, and acceptance cases were confirmed during exploration.
