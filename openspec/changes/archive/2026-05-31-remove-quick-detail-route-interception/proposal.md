## Why

Global quick-detail route interception gives canonical entity URLs two meanings: a soft navigation inside `(main)` can render a drawer, while direct navigation renders a full detail page. That hidden behavior is too broad for analytical workspaces because opening or closing quick detail can trigger route transitions, reload expensive chart/graph state, and leave stale interceptor code paths that are hard to reason about.

## What Changes

- **BREAKING**: Remove the global `(main)/@quickDetail` parallel route slot and all intercepted event/news article quick-detail routes.
- **BREAKING**: Remove route-level quick-detail compatibility behavior; canonical `/events/{id}` and `/news-articles/{id}` links always render full detail pages.
- Replace quick detail entry points in analytical workspaces with explicit local state that opens a workspace-owned drawer without changing the URL.
- Keep the current drawer-based quick-detail reading experience for Graph View and Market Charts, but detach it from `router.back()`, intercepted routes, and canonical soft navigation.
- Delete stale route-level drawer components, imports, documentation, specs, and placeholders instead of leaving inactive compatibility code.
- Keep full-page escalation actions inside local drawers so users can intentionally leave the workspace for the canonical detail route.

## Capabilities

### New Capabilities
- `workspace-local-quick-detail-overlays`: Defines local, explicit quick-detail overlays for analytical workspaces and requires removal of global route interception leftovers.

### Modified Capabilities
- `entity-quick-detail-overlay-documentation`: Replace intercepted-route documentation with local workspace overlay guidance and cleanup verification.
- `graph-view-quick-detail-overlay`: Change Graph View quick detail from canonical route interception to local drawer state.
- `graph-view-quick-detail-drawer-refinement`: Change drawer close/open behavior from router history to local state while keeping the bottom Drawer surface.
- `market-chart-event-drawer-linking`: Change Market Charts annotation event detail from route navigation to a local event drawer action.

## Impact

- Affected routes/components:
  - `app/[lang]/(main)/layout.tsx`
  - `app/[lang]/(main)/@quickDetail/**`
  - route-level quick-detail drawer components and imports
  - `app/[lang]/(main)/graph-view/**`
  - `app/[lang]/(main)/market-charts/**`
  - focused event/news article quick-detail content used by local drawers
- Affected docs/rules:
  - `docs/pdp-quick-view-drawer-nextjs-shadcn.md`
  - `AGENTS.md`
  - `AGENTS.vi.md`
  - OpenSpec quick-detail, Graph View, and Market Charts specs
- No backend API, DTO, auth, or database changes are required.
- No new UI primitive, chart engine, or external dependency is required.
