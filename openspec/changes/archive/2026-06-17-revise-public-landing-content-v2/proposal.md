## Why

The public landing copy has been updated to a more product-specific V2 positioning. The current landing page still reads like a broad feature overview; it should now lead with the three memorable product surfaces: Chart Annotation, Market Query, and Knowledge Graph.

## What Changes

- Revise landing hero copy to the V2 promise: understanding market moves through events, reactions, and narratives.
- Rework the hero product mock to emphasize a product-accurate workspace:
  - watchlist rail
  - XAU/USD chart with event annotation marker and popup
  - market query answer with evidence and limitations
  - mini knowledge graph
- Replace the current feature-card section with three primary product pillars:
  - Chart Annotation
  - Market Query
  - Knowledge Graph
- Add a data pipeline section explaining how raw signals become structured knowledge and personalized market intelligence.
- Add a workspace personalization section explaining `Knowledge = shared, experience = personal`.
- Shorten the trust/disclaimer section to the V2 "Analysis, not prediction" message.
- Preserve existing public route, dashboard route, auth CTA behavior, request-access fallback, shadcn wrappers, theme tokens, and backend contracts.

## Capabilities

### New Capabilities
- `public-landing-page`: Adds V2 product-story and visual-composition requirements for the public landing page.

### Modified Capabilities
- `product-localization`: Landing V2 copy must remain dictionary-backed and parity-safe for English and Vietnamese.

## Impact

- Affected UI: public landing page at `/{lang}`.
- Affected i18n: English and Vietnamese landing dictionary keys.
- Affected OpenSpec: V2 requirements and implementation tasks for the landing page revision.
- No backend API changes.
- No route changes.
- No new dependencies.
