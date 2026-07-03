## 1. Request Window Mapping

- [x] 1.1 Replace the fixed 7-day latest candle window with an `INITIAL_WINDOW_DAYS` map for all supported market chart timeframes.
- [x] 1.2 Update older-history request construction to use the `OLDER_WINDOW_DAYS` map for all supported market chart timeframes.
- [x] 1.3 Remove or update obsolete constants that still imply a single fixed latest window.

## 2. Verification

- [x] 2.1 Run `pnpm.cmd typecheck`. (`pnpm.cmd` was blocked by ignored build-script approval; `node_modules\.bin\tsc.cmd --noEmit` passed.)
- [x] 2.2 Run `openspec.cmd validate map-market-chart-timeframe-windows`.
- [x] 2.3 Verify with local backend requests that `1w` and `1mo` return candles when using the new mapped windows. (Manual check completed.)
