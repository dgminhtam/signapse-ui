## 1. API Contract Types And Actions

- [x] 1.1 Remove `includeAnnotations` from `MarketChartCandleRequest` and its Zod request schema.
- [x] 1.2 Remove `annotations[]` from `MarketChartCandleResponse` and its Zod response schema.
- [x] 1.3 Add `MarketChartAnnotationRequest` typing and validation for `assetId`, `from`, and `to`.
- [x] 1.4 Add `getMarketChartAnnotations(request)` in the market chart action using `fetchAuthenticated()` and the existing annotation response schema.

## 2. Market Chart Data Loading

- [x] 2.1 Update latest candle request construction so it sends only `assetId`, `timeframe`, `from`, and `to`.
- [x] 2.2 Update initial workbench load to fetch annotations from `/market-charts/annotations` for the same candle window when the annotation layer is enabled.
- [x] 2.3 Keep a local chart view model that combines candle data with separately fetched annotations for existing marker rendering.
- [x] 2.4 Update annotation toggle behavior so disabling hides markers without sending candle annotation flags, and enabling fetches missing annotation data for the loaded window.

## 3. Lazy History Loading

- [x] 3.1 Update older-history request construction to remove `includeAnnotations`.
- [x] 3.2 Update the canvas/workbench lazy-load callback contract so older candles and older annotations are fetched and merged separately.
- [x] 3.3 Reuse existing candle and annotation merge helpers so overlapping lazy windows do not duplicate candles or annotations.
- [x] 3.4 Keep annotation markers, legend, controls, and empty-state copy hidden while the annotation layer is disabled.

## 4. Documentation And Specs

- [x] 4.1 Update `docs/APIMAPPING.md` so market chart candles are documented as candles-only and `/market-charts/annotations` is documented with `getAnnotations`.
- [x] 4.2 Run a static search for stale `includeAnnotations` and candle-response `annotations[]` references in `app`, `docs`, and `openspec`.

## 5. Verification

- [x] 5.1 Run `pnpm.cmd typecheck`.
- [x] 5.2 Run `pnpm.cmd lint`.
- [x] 5.3 Run `openspec.cmd validate sync-market-chart-annotation-endpoint-contract --strict`.
