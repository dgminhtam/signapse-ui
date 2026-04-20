## Why

The first `market-query` workbench pass is functional, but the current UI still behaves more like a feature demo than an operator-focused analysis surface. It repeats guidance in multiple places, keeps stale results visible while a new query is running, and gives premium layout space to metadata that operators are less likely to value than the answer and evidence. It also leaves important usability decisions under-specified around active-query context, failed resubmissions, and how result-state changes stay legible on long or narrow layouts.

## What Changes

- Refine the `market-query` workbench so the page emphasizes the latest query result, evidence quality, and operator confidence over explanatory chrome.
- Remove or consolidate duplicated instructional copy across the route header, hero panel, side panel, and empty states so the first action is clearer and faster.
- Make the submission flow unambiguous by clearing or masking stale results as soon as a new query starts, and tie pending feedback to the new question being executed.
- Keep the active question visible across running, success, and error states so operators can always tell which query the page is responding to.
- Define how failed resubmissions behave when a previous successful result already exists, so the UI preserves useful context without mislabeling the last good briefing as the current answer.
- Rebalance the result information hierarchy so the answer, confidence, limitations, and evidence remain primary, while static guidance and low-value metadata move to compact secondary treatments.
- Simplify permission-aware traceability affordances so users who lack related entity read permissions still retain analytical context without seeing repetitive disabled controls on every evidence row.
- Improve result readability by demoting raw fallback metadata that feels internal or debug-oriented when richer labels are unavailable.
- Improve completion and error visibility with stronger in-page state communication, not only toast feedback, and keep the primary reading path coherent on narrower screens.
- Keep the route stateless and non-conversational in v1; this change does not add history, threads, exports, or streaming.

## Capabilities

### New Capabilities
- `market-query-workbench-usability`: Refine the market-query workbench information architecture, pending-state behavior, active-query clarity, and evidence-first operator experience.

### Modified Capabilities
- None.

## Impact

- Affected route shell and client UI under `app/(main)/market-query/*`.
- Affected traceability affordances and result presentation logic in `app/(main)/market-query/market-query-workbench.tsx`.
- Affected in-page state communication, focus handling, and responsive ordering for market-query result states.
- Possible small adjustments to market-query display helpers in `app/lib/market-query/*`.
- No backend API contract changes; `POST /query` remains request/response and stateless.
