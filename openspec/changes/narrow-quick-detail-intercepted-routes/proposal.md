## Why

The current global `@quickDetail` intercepted route makes every soft navigation to `/events/{id}` or `/news-articles/{id}` inside `(main)` eligible to render as a drawer, even when the caller expected a normal detail page. This hidden routing behavior is now causing expensive analytical surfaces such as Market Charts to reload when the drawer closes, so the quick-detail pattern should be narrowed immediately instead of preserved as a global compatibility path.

## What Changes

- **BREAKING**: Remove the global `(main)/@quickDetail` parallel route slot and intercepted event/news article routes.
- **BREAKING**: Stop relying on canonical `/events/{id}` and `/news-articles/{id}` links to open quick-detail drawers through route interception.
- Convert quick detail into an explicit, workspace-owned interaction for analytical surfaces that need to preserve context.
- Update Market Charts annotation event reading to use local drawer state instead of navigating to the intercepted event route.
- Update Graph View readable entity quick detail to use explicit local drawer state or otherwise fall back to full detail navigation, without depending on global intercepted routes.
- Keep canonical `/events/{id}` and `/news-articles/{id}` as normal full detail pages for list/detail CRUD, direct navigation, copied links, reloads, and full-page escalation actions.
- Update documentation/specs so future features do not introduce global intercepted quick-detail routes by default.

## Capabilities

### New Capabilities
- `workspace-local-quick-detail-overlays`: Defines explicit, workspace-owned quick-detail overlays for analytical surfaces without global intercepted route behavior.

### Modified Capabilities
- `entity-quick-detail-overlay-documentation`: Replace global intercepted-route guidance with explicit local workspace overlay guidance.
- `graph-view-quick-detail-overlay`: Change Graph View quick detail from canonical soft-navigation interception to explicit local overlay behavior.
- `graph-view-quick-detail-drawer-refinement`: Remove the requirement that quick-detail drawer close through `router.back()` and preserve drawer behavior through local state instead.
- `market-chart-event-drawer-linking`: Change Market Charts annotation event reading from intercepted event drawer navigation to local event quick-detail drawer behavior.

## Impact

- Affected routes/components:
  - `app/[lang]/(main)/layout.tsx`
  - `app/[lang]/(main)/@quickDetail/**`
  - `components/entity-quick-detail-drawer.tsx`
  - `app/[lang]/(main)/graph-view/**`
  - `app/[lang]/(main)/market-charts/**`
  - event/news article quick-detail content components reused by local drawers
- Affected docs/specs:
  - `docs/pdp-quick-view-drawer-nextjs-shadcn.md`
  - OpenSpec quick-detail, graph-view, and market-chart quick-detail specs
- No backend API changes are required.
- No new UI library or chart dependency is required.
