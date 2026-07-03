## Why

The backend annotation contract removed the legacy `reaction` field and now sends the primary reaction as `topMarketReaction`. The frontend still reads the old field, so annotation popup confidence can disappear even when the backend returns a primary reaction.

## What Changes

- **BREAKING** Stop reading the legacy `reaction` field for market chart annotation popup data.
- Map `topMarketReaction` on `MarketChartAnnotationResponse`.
- Use `topMarketReaction` directly for annotation popup reaction confidence.
- Do not fall back to `marketReactions[0]`; when `topMarketReaction` is null or absent, the popup omits reaction-derived confidence.
- Do not add outcome display in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-annotation-markers`: annotation detail inspection must read primary reaction context from `topMarketReaction` instead of legacy `reaction`.

## Impact

- Affects market chart annotation DTO and Zod response mapping in `app/lib/market-charts/definitions.ts`.
- Affects annotation popup confidence rendering in `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`.
- No new dependencies, helpers, UI sections, i18n labels, outcome rendering, or backend changes.
