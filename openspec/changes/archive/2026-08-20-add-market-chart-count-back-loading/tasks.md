## 1. Count-back contract and deterministic policy

- [x] 1.1 Replace the frontend candle request contract and runtime validation with count-back fields bounded to 1 through 1000, require an explicit historical candle array, retain optional historical candle partial flags, and keep range-based request contracts separate for annotations and calendar events.
- [x] 1.2 Extend the vendor-free market-chart history helpers with the agreed initial and older per-timeframe count policy, UTC end-boundary construction for every timeframe (including ISO Monday weekly boundaries), and exact older anchors.
- [x] 1.3 Add deterministic helpers to derive a displayed candle interval from normalized candles and classify page outcomes: short non-empty pages remain pageable, only an exact empty response at the request anchor exhausts history, and failures or paging-contract violations remain retryable.
- [x] 1.4 Update authenticated candle transport to serialize `assetId`, `timeframe`, `to`, and `countBack`, omitting legacy candle `from` and `includeAnnotations` parameters.

## 2. Chart loading and metadata behavior

- [x] 2.1 Route initial load and refresh through the count-back policy with a fresh UTC end-boundary anchor, preserving selected asset/timeframe and the existing stale-load protection.
- [x] 2.2 Route lazy older-history loading through exclusive count-back pages, preserve stable prepend and timestamp de-duplication, keep short pages pageable, and reset exhaustion only for a new chart identity or refresh.
- [x] 2.3 Load annotations and economic-calendar data only after a non-empty candle result produces a displayed candle interval; retain layer gates, selected impacts, and backend-safe calendar range chunking.
- [x] 2.4 Render the localized no-data state with retry only for an exact empty successful count-back result, without synthetic candles or ancillary metadata fetches; render API/provider failures as retryable errors instead.
- [x] 2.5 Preserve current live SSE replace/append behavior without immediate historical trimming or a chart-wide reset.

## 3. Regression coverage and fixtures

- [x] 3.1 Extend deterministic market-chart helper tests for every initial/older count, UTC end-boundary rule (including exact-boundary, four-hour, ISO-week, and month cases), exclusive anchors, 1-through-1000 bounds, partial displayed intervals, short non-terminal pages, explicit exact-empty exhaustion, retryable failures, paging-contract violations, and duplicate handling.
- [x] 3.2 Add authenticated request-boundary coverage proving `countBack` serialization and omission of legacy candle range parameters.
- [x] 3.3 Add focused workbench behavior coverage for sparse initial history, a rendered partial candle, empty-state retry, short older-page continuation, and retryable older-history failures.
- [x] 3.4 Update deterministic candle fixtures to model sparse available candles, an older gap, a short non-terminal page followed by an exact empty terminal response, a partial candle, an empty history, and an older-page failure.

## 4. Documentation and verification

- [x] 4.1 Update the API mapping ledger from count-back drift to integrated behavior, including 1-through-1000 bounds, UTC aligned exclusive anchors, exact-empty exhaustion, partial-candle preservation, and displayed-interval metadata ownership.
- [x] 4.2 Run `openspec validate add-market-chart-count-back-loading --strict`.
- [x] 4.3 Run targeted market-chart tests with `pnpm test -- tests/market-chart/market-chart-helpers.test.ts` and any added market-chart test files.
- [x] 4.4 Run `pnpm lint` and `pnpm typecheck`.
