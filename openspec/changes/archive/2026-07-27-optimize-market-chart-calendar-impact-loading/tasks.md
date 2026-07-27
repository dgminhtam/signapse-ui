## 1. Request Contract

- [x] 1.1 Extend the market chart economic calendar request type and Zod validation to require selected `HIGH`, `MEDIUM`, or `LOW` impact values.
- [x] 1.2 Serialize every selected impact as a repeated `impact` query parameter in the authenticated market chart action.

## 2. Impact-Driven Loading

- [x] 2.1 Default the workbench calendar impact selection to `HIGH` and pass current selections through initial, refresh, layer re-enable, asset/timeframe, and lazy-history requests.
- [x] 2.2 Fetch only a newly enabled impact for the current calendar range and merge its events by ID without replacing existing impact data.
- [x] 2.3 Keep impact deselection local, retain loaded events, and skip calendar requests when no impacts are selected.

## 3. Verification

- [x] 3.1 Run a deterministic request serialization check covering one and multiple repeated impact parameters and an event-merge check covering newly loaded impacts.
- [x] 3.2 Run scoped lint, `pnpm.cmd typecheck`, `git diff --check`, and `openspec validate optimize-market-chart-calendar-impact-loading --strict`.

Verification note: deterministic serialization and merge assertions, scoped lint, strict OpenSpec validation, and `git diff --check` passed. `pnpm.cmd typecheck` ran and reported only the pre-existing `market-chart-canvas.tsx:1196` KLineCharts layout typing error (`yAxis` is not a `LayoutChild[]` property).
