## 1. Contract Mapping

- [x] 1.1 Add `MarketChartAnnotationOutcomeResponse` with `anchorTime`, `anchorPrice`, `evaluationTime`, `evaluationPrice`, `realizedReturn`, `actualDirection`, `alignment`, and `evaluatedAt`.
- [x] 1.2 Add nullable optional `outcome` to `MarketChartAnnotationReactionResponse` and its Zod schema.
- [x] 1.3 Keep primary outcome access limited to `annotation.topMarketReaction?.outcome`; do not fall back to `marketReactions[0]`.

## 2. Popup Outcome Section

- [x] 2.1 Add localized labels for the compact outcome section in English and Vietnamese dictionaries.
- [x] 2.2 Render the outcome section below each annotation summary in `MarketChartAnnotationDetail` when `topMarketReaction.outcome` exists.
- [x] 2.3 Prioritize realized return, alignment, actual direction, and evaluation price/time; omit missing optional fields without placeholder copy.
- [x] 2.4 Preserve existing popup metadata, title, summary, grouping, scrolling, marker colors, and event open behavior.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate show-market-chart-annotation-outcome --strict`.
- [x] 3.2 Run `pnpm.cmd typecheck`.
- [x] 3.3 Run `pnpm.cmd lint`.
- [x] 3.4 Run a static search confirming no chart popup reads legacy `reaction` or renders full `marketReactions[]` in the outcome section.
