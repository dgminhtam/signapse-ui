## 1. Extract theme module

- [x] 1.1 Create `market-chart-theme.ts` with `MARKET_CHART_THEME_PALETTES`, `getMarketChartThemePalette`, `createChartStyles`, `createDrawingOverlayStyles`, `resolveChartThemeMode`, `MarketChartThemePalette` type, and `ChartThemeMode` type
- [x] 1.2 Import from `market-chart-theme.ts` in `market-chart-canvas.tsx`, remove inline definitions, verify `pnpm typecheck` + `pnpm lint` pass
- [x] 1.3 Verify theme module has zero `from 'klinecharts'` imports via static search

## 2. Extract period module

- [x] 2.1 Create `market-chart-period.ts` with `createKLinePeriod`, `ensureKLineChartLocales`, `resolveKLineChartLocale`, `KLINE_CHART_VI_LOCALE`, `kLineChartLocalesRegistered` (module-level flag)
- [x] 2.2 Import from `market-chart-period.ts` in `market-chart-canvas.tsx`, remove inline definitions, verify `pnpm typecheck` + `pnpm lint` pass
- [x] 2.3 Verify period module has zero `from 'klinecharts'` imports via static search

## 3. Extract candle helpers module

- [x] 3.1 Create `market-chart-candle-helpers.ts` with `normalizeCandleItems`, `mergeCandleItems`, `mergeLiveCandleItem`, `createKLineData`, `isValidMarketChartCandle`, `getCandleTimestamp`, `getFiniteVolume`, `hasUsableVolume`, `hasUsableVolumeData`, `isRecord`
- [x] 3.2 Import from `market-chart-candle-helpers.ts` in `market-chart-canvas.tsx`, remove inline definitions, verify `pnpm typecheck` + `pnpm lint` pass
- [x] 3.3 Verify candle helpers module has zero `from 'klinecharts'` imports via static search

## 4. Extract history helpers module

- [x] 4.1 Create `market-chart-history-helpers.ts` with `createOlderHistoryRequest`, `getOldestLoadedTimestamp`, `getNewOlderCandles`, `TIMEFRAME_INTERVAL_MS`, `LAZY_HISTORY_BAR_TARGET`
- [x] 4.2 Import from `market-chart-history-helpers.ts` in `market-chart-canvas.tsx`, remove inline definitions, verify `pnpm typecheck` + `pnpm lint` pass
- [x] 4.3 Verify history helpers module has zero `from 'klinecharts'` imports via static search

## 5. Remove duplicate annotation color function

- [x] 5.1 Remove private `getAnnotationMarkerColorClassNames` function and private `AnnotationMarkerColorClassNames` type from `market-chart-canvas.tsx`
- [x] 5.2 Replace with import of `getMarketChartAnnotationColorClassNames` from `./market-chart-annotations`, verify `pnpm typecheck` + `pnpm lint` pass

## 6. Add unit tests for candle helpers

- [x] 6.1 Create `__tests__/market-chart-candle-helpers.test.ts` with tests covering: normalize with duplicate timestamps, merge with overlapping candles, merge live candle (replace / append / older-ignore), invalid candle filtering, KLineData conversion with missing volume, empty array inputs

## 7. Add unit tests for history helpers

- [x] 7.1 Create `__tests__/market-chart-history-helpers.test.ts` with tests covering: older history request with valid timestamps, null return for invalid range, new older candle filter (duplicate timestamp exclusion, non-older exclusion), empty incoming array, exhausted state detection

## 8. Add unit tests for annotation helpers

- [x] 8.1 Create `__tests__/market-chart-annotations.test.ts` with tests covering: single annotation grouped to nearest candle, multiple annotations at same time grouped together, annotation outside candle range excluded, MIXED direction when annotations disagree, single direction when all agree, priority high for multi-annotation or high-severity groups, empty annotation array, empty candle array

## 9. Add unit tests for theme module

- [x] 9.1 Create `__tests__/market-chart-theme.test.ts` with tests covering: light and dark palette resolution, chart styles include all expected keys, drawing overlay styles include stroke_fill for circle/rect/polygon, unknown mode falls back to light

## 10. Add unit tests for period module

- [x] 10.1 Create `__tests__/market-chart-period.test.ts` with tests covering: every `MARKET_CHART_TIMEFRAMES` value maps to correct `{ type, span }`, idempotent locale registration, locale resolution for supported and unsupported locales

## 11. Add unit tests for drawing helpers

- [x] 11.1 Create `__tests__/market-chart-drawing.test.ts` with tests covering: `createMarketChartDrawingGroupId` format, `isMarketChartDrawingTool` for valid/invalid tools, `getMarketChartDrawingToolPalette` mapping, `MARKET_CHART_DRAWING_TOOL_OVERLAYS` completeness (every tool has an overlay name)

## 12. Final verification

- [x] 12.1 Run `pnpm typecheck` — zero errors
- [x] 12.2 Run `pnpm lint` — zero errors
- [x] 12.3 Run `pnpm test` (or equivalent) — skipped: no test runner installed (vitest/jest not in package.json). Test files written in Vitest-compatible format for when one is added.
- [x] 12.4 Static search confirms zero `from 'klinecharts'` in view-model modules: `market-chart-candle-helpers.ts`, `market-chart-history-helpers.ts`, `market-chart-theme.ts`, `market-chart-period.ts`, `market-chart-annotations.ts`, `market-chart-drawing.ts`
- [x] 12.5 Static search confirms `getAnnotationMarkerColorClassNames` (private, lowercase 'a' in 'Annotation') no longer exists in `market-chart-canvas.tsx`
