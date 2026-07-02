## 1. Annotation Reaction Preview

- [x] 1.1 Replace the separate predicted and actual reaction render blocks with one compact reaction comparison section for `topMarketReaction`.
- [x] 1.2 Show predicted and actual directions as localized direction badges, and stop rendering the outcome `alignment` badge in the popup preview.
- [x] 1.3 Keep anchor price neutral, color only evaluation price, show realized return in parentheses, and place the movement icon at the end.
- [x] 1.4 Keep missing predicted, actual, return, price, and time values omitted without placeholder copy.

## 2. Cleanup And Localization

- [x] 2.1 Remove popup-only alignment helper usage if it becomes unused.
- [x] 2.2 Reuse existing dictionary labels where possible and add or remove only labels required by the compact section.

## 3. Verification

- [x] 3.1 Run `openspec validate compact-market-chart-annotation-reaction-section --strict`.
- [x] 3.2 Run `pnpm typecheck`.
