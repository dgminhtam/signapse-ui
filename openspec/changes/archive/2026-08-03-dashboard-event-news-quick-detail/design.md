## Context

The dashboard renders Event Timeline and Latest News as independent server components. Event rows already use an anchor-backed shadcn `Item` and point to canonical event routes; news rows are display-only. The existing `LocalEntityQuickDetailDrawer` already loads event and news-article details on demand and is owned locally by Graph View and Market Charts.

The dashboard needs one local owner for both sections so that either row can open the same drawer without duplicating fetch, permission, loading, error, focus, or close behavior. The dashboard page and data-fetching sections should remain server-rendered.

## Goals / Non-Goals

**Goals:**

- Reuse `LocalEntityQuickDetailDrawer` for both dashboard sections.
- Give Event Timeline and Latest News identical row interaction and anchor semantics.
- Open quick detail on ordinary primary activation while preserving canonical `href` behavior for modifier clicks, context menus, middle-clicks, and full-page escalation.
- Keep one drawer state owner scoped to the dashboard surface.
- Preserve keyboard access, visible focus, Escape-to-close, focus return, and contained drawer scrolling from the existing drawer.
- Keep API requests and detail loading on demand through the existing drawer actions.

**Non-Goals:**

- Do not create another drawer or change the shared drawer content.
- Do not convert the dashboard page, Event Timeline, or Latest News to client components.
- Do not add route interception, parallel routes, URL state, or a new dependency.
- Do not change dashboard summary/news list API contracts or canonical detail pages.
- Do not add linked-event or internal derivation metadata to Latest News.

## Decisions

### 1. Add a route-local dashboard quick-detail boundary

Create one small client component in the dashboard feature that provides local context/state and renders exactly one existing `LocalEntityQuickDetailDrawer`. Place it around the Event Timeline/Latest News content in `dashboard/page.tsx`, including the permission-gated layout branch.

Server-rendered section output can contain the client trigger component, so only interaction code crosses the client boundary. A single owner prevents two sections from drifting or rendering duplicate overlays.

**Alternative considered:** Make `dashboard/page.tsx` a client component. Rejected because it would clientify data-fetching/layout code without needing client state.

**Alternative considered:** Mount one drawer per section. Rejected because it duplicates state and overlay behavior.

### 2. Share one anchor-backed quick-detail link component

Add a client `DashboardQuickDetailLink` that renders `LocalizedLink` and accepts a `LocalQuickDetailEntity`. On a normal primary click, it prevents navigation and opens the provider state. It leaves modified clicks and non-primary buttons untouched so browser link behavior remains available. It spreads normal link props, children, and accessibility attributes so `Item asChild` receives an actual anchor.

Both sections will use the same shape:

```tsx
<Item asChild>
  <DashboardQuickDetailLink href="..." entity={{ id, kind }} aria-haspopup="dialog">
    ...
  </DashboardQuickDetailLink>
</Item>
```

**Alternative considered:** Use a button as the row trigger. Rejected because the existing Item content contains block-level descendants and the anchor preserves context-menu, copy-link, and open-in-new-tab behavior.

### 3. Keep canonical routes as the escalation path

Event rows retain `/events/{id}` and news rows use `/news-articles/{id}` as real localized `href` values. The drawer's existing footer remains the explicit full-page action. A normal click reads locally; a modified or direct link activation navigates to the canonical page.

This follows the repository's local quick-detail overlay contract and avoids global route interception.

### 4. Keep section data and copy localized

Event and news labels/accessible names continue to come from dictionaries. Add a Latest News article-open label if the existing dictionary hierarchy does not provide a suitable module-local key. Backend titles remain dynamic content.

### 5. Update capability contracts before implementation

Create a new shared dashboard quick-detail capability spec and delta specs for `dashboard-event-timeline` and `dashboard-latest-news`. The deltas will describe ordinary-click drawer behavior, preserved canonical links, synchronized `Item` structure, and accessibility requirements; API/data requirements remain unchanged.

## Risks / Trade-offs

- [A client trigger is nested inside server-rendered section output] → Keep the boundary limited to the provider/link components and verify build/typecheck plus hydration behavior.
- [A click handler could break open-in-new-tab or context-menu behavior] → Guard on `event.button` and modifier keys, and retain a real `LocalizedLink` `href`.
- [Focus restoration could regress] → Reuse the existing Drawer unchanged, use actual focused anchors as triggers, and verify keyboard open/close behavior.
- [News and event detail permissions may differ] → Pass the existing `kind` union unchanged so the shared drawer keeps its current per-entity permission checks.
- [A future row caller could render outside the provider] → Keep the wrapper colocated with the dashboard surface and treat provider context as an internal implementation contract.

## Migration Plan

No data or dependency migration is required. Implement the provider/link boundary, update both row renderers and localized labels, then run the repository's typecheck/lint/OpenSpec validation. Rollback is a localized revert of the dashboard wrapper and row trigger usage; canonical links and the shared drawer remain available throughout.

## Open Questions

None blocking. The implementation can use a module-local `latestNews.openArticle` dictionary key and the existing shared drawer footer for full-page escalation.
