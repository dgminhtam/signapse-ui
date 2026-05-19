## Why

The market chart annotation popup can be clipped by the chart surface when the selected event sits near an edge, and the current popup shows too many badges/cards for a quick chart-context preview. This makes the event detail feel noisy and occasionally unreadable exactly when the user is trying to inspect a price-event point.

## What Changes

- Prevent annotation popups from being clipped by the chart canvas/surface overflow.
- Keep the popup anchored to the selected chart event on desktop, with collision-aware placement near chart edges.
- Keep the mobile/below-chart fallback behavior.
- Simplify popup content to a quick preview: direction, confidence, time, optional grouped count, event title, and event summary.
- Remove the event severity badge such as `MEDIUM` from the popup.
- Move confidence into the same metadata row as direction instead of rendering it inside each event body.
- Remove the nested bordered card wrapper around annotation detail content because the popup already provides the containing surface.
- Remove reaction reasoning, evidence cards, and event-detail button from the popup body unless a future richer detail surface is explicitly proposed.
- Do not change backend annotation contract, marker grouping, KLineChart engine integration, or annotation layer toggle behavior.

## Capabilities

### New Capabilities

- `market-chart-annotation-popup-surface`: Covers floating placement and simplified preview content for market chart annotation popups.

### Modified Capabilities

- None.

## Impact

- Affected frontend area: `app/(main)/market-charts/market-chart-workbench.tsx`.
- No backend/API changes.
- No new dependencies.
- Verification should include popup clipping near chart edges, simplified content hierarchy, responsive fallback, targeted lint, typecheck, build, and OpenSpec validation.
