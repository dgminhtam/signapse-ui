## 1. Shared Contract and Localization

- [x] 1.1 Add `4h` after `1h` in the shared market-chart timeframe constant so inferred types, Zod schemas, URL validation, API actions, and the local SSE proxy accept it.
- [x] 1.2 Add matching `4 giờ` and `4 hours` timeframe entries to the Vietnamese and English market-chart dictionaries.

## 2. Market Chart Integration

- [x] 2.1 Add the `4H` toolbar label and 30-day initial request window to the existing workbench timeframe maps.
- [x] 2.2 Map `4h` to the stable KLineCharts `{ type: "hour", span: 4 }` period.
- [x] 2.3 Add the four-hour interval and 14-day older-history window to the lazy-history maps.
- [x] 2.4 Add the four-hour interval to quote-only live candle bucketing without changing existing candle update rules.

## 3. Verification

- [x] 3.1 Add one dependency-free assertion script covering `4h` validation, KLineCharts period mapping, older-history boundaries, and same/new live quote buckets.
- [x] 3.2 Run the `4h` assertion script, TypeScript typecheck, and scoped lint for all changed application and assertion files.
- [x] 3.3 Run the production build and strict OpenSpec validation for `add-market-chart-4h-timeframe`.

User-owned manual QA: select `4H`, reload and copy a `timeframe=4h` URL, switch to and from other timeframes, pan into older history, and verify live updates against backend four-hour candle boundaries.
