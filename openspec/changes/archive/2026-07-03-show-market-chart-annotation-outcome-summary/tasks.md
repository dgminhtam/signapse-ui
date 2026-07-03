## 1. Contract

- [x] 1.1 Add `summary?: string | null` to `MarketChartAnnotationOutcomeResponse`.

## 2. Popup Rendering

- [x] 2.1 Read and trim `outcome.summary` inside `MarketChartAnnotationReactionSection`.
- [x] 2.2 Render non-empty outcome summary text at the bottom of the existing reaction section.
- [x] 2.3 Include outcome summary in the reaction section visibility condition.

## 3. Verification

- [x] 3.1 Run `openspec validate show-market-chart-annotation-outcome-summary --strict`.
- [x] 3.2 Run `pnpm typecheck`.
