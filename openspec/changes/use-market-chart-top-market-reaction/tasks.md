## 1. Annotation Contract Mapping

- [x] 1.1 Add `topMarketReaction` to `MarketChartAnnotationResponse`.
- [x] 1.2 Add `marketReactions[]` to `MarketChartAnnotationResponse` only as mapped response data.
- [x] 1.3 Update `marketChartAnnotationResponseSchema` to parse `topMarketReaction` and `marketReactions[]`.
- [x] 1.4 Remove legacy `reaction` from the market chart annotation response type and schema.

## 2. Annotation Popup Consumption

- [x] 2.1 Update annotation popup confidence to read `firstAnnotation?.topMarketReaction?.confidence`.
- [x] 2.2 Do not add a primary-reaction helper or fallback to `marketReactions[0]`.
- [x] 2.3 Keep outcome fields unmapped and hidden in this change.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate use-market-chart-top-market-reaction --strict`.
- [x] 3.2 Run `pnpm.cmd typecheck`.
- [x] 3.3 Run `pnpm.cmd lint`.
