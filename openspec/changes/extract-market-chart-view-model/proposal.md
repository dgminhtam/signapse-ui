## Why

`market-chart-canvas.tsx` is 1449 lines and mixes pure logic (candle normalization, lazy-history request computation, theme palettes, period mapping, overlay styles) with KLineChart lifecycle code. This makes the canvas adapter hard to test, hard to onboard, and fragile when klinecharts beta APIs change. The vnbrokerchart research confirmed the right pattern: push domain logic out of the adapter into deterministic, testable view-model modules that import zero chart-vendor types.

## What Changes

- **Extract** candle helpers (`normalizeCandleItems`, `mergeCandleItems`, `mergeLiveCandleItem`, `createKLineData`, validation) into a new `market-chart-candle-helpers.ts` module
- **Extract** lazy-history helpers (`createOlderHistoryRequest`, `getOldestLoadedTimestamp`, `getNewOlderCandles`, interval/target constants) into a new `market-chart-history-helpers.ts` module
- **Extract** chart theme helpers (`MARKET_CHART_THEME_PALETTES`, `getMarketChartThemePalette`, `createChartStyles`, `createDrawingOverlayStyles`, `resolveChartThemeMode`) into a new `market-chart-theme.ts` module
- **Extract** period helpers (`createKLinePeriod`, `TIMEFRAME_INTERVAL_MS`, `LAZY_HISTORY_BAR_TARGET`, locale helpers) into a new `market-chart-period.ts` module
- **Remove** duplicate `getAnnotationMarkerColorClassNames` from `market-chart-canvas.tsx` (already exported from `market-chart-annotations.ts`)
- **Add** deterministic unit tests for every extracted module under `__tests__/`
- Canvas adapter imports from new modules; no behavior change; canvas drops from ~1449 to ~750 lines

## Capabilities

### New Capabilities
- `market-chart-deterministic-helpers`: Pure domain functions for candle normalization/merge, lazy-history request computation, chart theme palettes/styles, and timeframe-to-period mapping, each fully unit-testable without a browser or chart engine. These functions expose no klinecharts vendor types.

### Modified Capabilities
None. This change reorganizes code without altering any requirement-level behavior. Existing specs for `market-chart-klinechart-engine`, `market-chart-annotation-markers`, `market-chart-lazy-history-loading`, and related capabilities remain unchanged.

## Impact

- **Affected code**: `app/[lang]/(main)/market-charts/market-chart-canvas.tsx` (refactor imports only), `market-chart-annotations.ts` (already clean), `market-chart-drawing.ts` (already clean), `market-chart-workbench.tsx` (no change)
- **New files**: 4 view-model modules + 5 test files under `app/[lang]/(main)/market-charts/`
- **No dependency changes**, no API changes, no backend contract changes, no UI changes
- **Vendor boundary**: klinecharts types (`Chart`, `KLineData`, `Period`, `Styles`, `DeepPartial`, `OverlayStyle`) remain confined to `market-chart-canvas.tsx` only
