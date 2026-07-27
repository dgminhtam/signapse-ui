## 1. Contract Alignment

- [x] 1.1 Add nullable optional `pricePrecision` to the shared asset list/detail frontend response types.
- [x] 1.2 Add nullable optional non-negative integer `pricePrecision` to `MarketChartAssetResponse` and its shared Zod schema so candle and SSE snapshot payloads preserve it.

## 2. Market Chart Integration

- [x] 2.1 Pass the loaded candle asset's `pricePrecision` through `ChartSurface` to `MarketChartCanvas`.
- [x] 2.2 Replace the fixed KLineChart symbol precision with `pricePrecision ?? 4` and rerun the existing symbol effect when precision changes.
- [x] 2.3 Update `docs/APIMAPPING.md` integration statuses after the frontend contract and chart wiring are complete.

## 3. Verification

- [x] 3.1 Run `pnpm typecheck`.
- [x] 3.2 Run `pnpm lint` (full repo reports unrelated existing errors; affected files pass with warnings only).
- [x] 3.3 Run a static search confirming the chart no longer uses an unconditional `pricePrecision: 4`.
- [x] 3.4 Run strict OpenSpec validation for `use-market-chart-price-precision`.
