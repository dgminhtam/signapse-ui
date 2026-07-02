## Why

Market chart annotations now receive evaluated reaction outcome data from the backend, but the popup still only shows the event preview. Operators need a compact way to see whether the top reaction actually aligned with the later market move without leaving the chart.

## What Changes

- Map the nested `topMarketReaction.outcome` contract on market chart annotations.
- Render a concise outcome section below each annotation summary in the chart annotation popup when outcome data is present.
- Keep marker rendering, grouping, legends, and the full `marketReactions[]` list unchanged.
- Continue omitting unavailable optional outcome fields instead of showing placeholders.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `market-chart-annotation-popup-surface`: popup preview content will include a compact top-reaction outcome section below the annotation summary when available.

## Impact

- Affected frontend DTO/Zod mapping in `app/lib/market-charts/definitions.ts`.
- Affected popup rendering in `app/[lang]/(main)/market-charts/market-chart-workbench.tsx`.
- Affected localized labels in `app/lib/i18n/dictionaries/en.ts` and `app/lib/i18n/dictionaries/vi.ts`.
- No new dependencies, routes, API calls, chart marker behavior, or event detail behavior.
