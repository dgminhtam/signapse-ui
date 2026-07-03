## 1. Annotation Popup Rendering

- [x] 1.1 Add per-event localized date metadata above each annotation title.
- [x] 1.2 Add a predicted reaction section before the actual reaction section when `topMarketReaction.direction` is available.
- [x] 1.3 Update the actual reaction section to show anchor-to-evaluation price and time ranges while preserving realized return, actual direction, alignment, and evaluated-at details.
- [x] 1.4 Keep predicted and actual reaction sections omitted when their source data is unavailable.

## 2. Localization

- [x] 2.1 Add English and Vietnamese labels for predicted reaction, price change, and evaluation time range.
- [x] 2.2 Reuse existing direction and alignment dictionaries instead of rendering backend enum values directly.

## 3. Verification

- [x] 3.1 Run `openspec validate show-market-chart-annotation-predicted-reaction --strict`.
- [x] 3.2 Run `pnpm typecheck`.
