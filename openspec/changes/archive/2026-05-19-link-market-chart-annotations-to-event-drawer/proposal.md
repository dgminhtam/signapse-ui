## Why

Market chart annotation popups currently show event titles as static text, so users cannot quickly inspect the underlying event without leaving their chart context. Since the app already has a quick-detail drawer for events, the chart should link annotation event titles to that existing drawer instead of introducing article/source mapping at the chart layer.

## What Changes

- Render each market chart annotation event title as an internal link to the corresponding event detail route when an event mapping is available.
- Prefer `annotation.eventId` for event routing and use `annotation.links.eventDetail` only when it resolves to a safe internal event detail path.
- Reuse the existing intercepted `@quickDetail/(.)events/[id]` route and `EntityQuickDetailDrawer` behavior.
- Keep the chart popup lightweight: title, summary, direction/confidence/time badges remain in the popup, while deeper article/source content is opened from the event detail drawer.
- Close the chart annotation popup when navigating to the event detail drawer to avoid stale overlay state behind the drawer.
- Do not add news article, source document, or evidence-detail mapping to the chart popup in this change.
- Do not change backend APIs, annotation marker rendering, grouping, popup positioning, lazy history loading, or event detail drawer content.

## Capabilities

### New Capabilities

- `market-chart-event-drawer-linking`: Covers event-title linking from market chart annotation popups into the existing event quick-detail drawer.

### Modified Capabilities

- None.

## Impact

- Affected frontend files:
  - `app/(main)/market-charts/market-chart-workbench.tsx`
- Existing quick-detail drawer files should be reused, not rewritten:
  - `app/(main)/@quickDetail/(.)events/[id]/page.tsx`
  - `components/entity-quick-detail-drawer.tsx`
- No backend API, dependency, route contract, annotation DTO, event drawer content, or global theme changes are expected.
- Verification should include targeted market chart lint, typecheck, build, OpenSpec validation, and a browser smoke check that clicking an annotation title opens the event drawer when authenticated data is available.
