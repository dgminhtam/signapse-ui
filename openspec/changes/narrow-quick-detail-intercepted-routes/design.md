## Context

Signapse currently has a global `@quickDetail` parallel route under `(main)` with intercepted routes for `events` and `news-articles`. This lets a client-side navigation to canonical detail URLs render a drawer above the current workspace, while hard navigation still renders the full detail page.

That pattern was useful for Graph View, but it has become too broad for the admin app. Any soft navigation to `/events/{id}` or `/news-articles/{id}` from `(main)` can be intercepted, even when the caller only intended a normal detail page. Market Charts exposed the hidden cost: closing the event drawer calls `router.back()`, which can re-enter the chart route, re-run server/client load effects, and reset the chart.

The new direction is intentionally breaking: remove the global intercepted route pattern now and make quick detail an explicit local interaction owned by each analytical workspace.

## Goals / Non-Goals

**Goals:**

- Remove the global `@quickDetail` route slot and intercepted detail routes.
- Make quick detail opt-in and local to analytical workspaces such as Graph View and Market Charts.
- Prevent opening/closing quick detail from triggering route transitions or chart reloads.
- Keep canonical event and news article detail routes as normal full pages.
- Reuse focused event/news quick-detail content where practical, without preserving the old route-level drawer behavior.
- Remove stale source, docs, and guidance that suggest global intercepted quick detail is the default pattern.
- Add a repo convention so future quick-detail features do not silently reintroduce global intercepted routes.

**Non-Goals:**

- No backend API or DTO changes.
- No new UI primitive or external dependency.
- No compatibility path for the old global `@quickDetail` behavior.
- No requirement to preserve quick-detail URL shareability or browser Forward reopening the drawer.
- No redesign of full event/news article detail pages.
- No change to Market Charts candle fetching, lazy history loading, chart engine, or annotation marker rendering beyond the quick-detail entry flow.

## Decisions

### 1. Remove Global Route Interception Immediately

Delete the `(main)/@quickDetail` route tree and remove the `quickDetail` slot from `(main)/layout.tsx`.

Rationale: keeping the global slot but trying to selectively avoid it would preserve the hidden behavior. The cleanest model is that `/events/{id}` and `/news-articles/{id}` always mean full detail pages unless a workspace explicitly renders a local overlay.

Alternative considered: keep `@quickDetail` and add guards or return URLs. Rejected because the route would still be globally active and future links could accidentally opt into the drawer again.

### 2. Local Quick Detail Uses Explicit State, Not URL State

Graph View and Market Charts should open quick detail by setting local state such as selected entity type and id. Closing the drawer clears local state. The drawer close must not call `router.back()`.

Rationale: analytical workspaces have expensive client state: chart data, zoom/scroll, annotation popup state, graph layout, selected nodes, and lazy-loaded history. Quick detail is a reading layer over that state, not a navigation event.

Alternative considered: encode quick detail in query params such as `?eventId=123`. Rejected for this change because it still creates route transitions and can re-run server component data loading.

### 3. Canonical Links Escalate to Full Pages

Local drawers may include a full-page action linking to `/events/{id}` or `/news-articles/{id}`. That action intentionally leaves the workspace and renders the full detail page.

Rationale: the app still needs shareable, reload-safe canonical detail URLs. The change only removes the dual presentation behavior where the same soft navigation can unexpectedly become a drawer.

Alternative considered: keep canonical URL in the address bar while showing local drawer. Rejected because that is precisely the global intercepted route behavior we are removing.

### 4. Reuse Focused Detail Content Without Reusing Route Shells

Existing focused content components may be reused inside local drawers if they do not depend on route interception. Fetching detail should happen on demand when a local drawer opens, using existing server actions and permission-aware data paths.

Rationale: quick detail should not preload full event/article content for every graph node or chart annotation. It should also avoid rendering full page shells inside overlays.

Alternative considered: render the canonical detail page inside a drawer. Rejected because it duplicates page chrome, back buttons, broad panels, and mutation-heavy actions in a cramped overlay.

### 5. Market Charts Event Detail Is Event-Only and Local

Market Charts annotation titles should open a local event quick-detail drawer when a valid event id can be resolved. The chart popup can close when the local drawer opens, but the page URL and chart selection route must stay unchanged.

Rationale: chart annotations already map cleanly to events. Article evidence should remain inside event detail, keeping chart annotation UI lightweight.

Alternative considered: keep a `Link` to `/events/{id}` and add chart reload guards. Rejected because it still leaves the chart flow dependent on navigation behavior.

### 6. Graph View Keeps Quick Detail, But Not Through Global Routes

Graph View should continue to support quick detail for readable `event` and `news-article` nodes, but the detail action should open a local drawer rather than navigating to intercepted canonical routes.

Rationale: Graph View was the best fit for quick detail originally, but that does not require a global route slot. A local drawer better matches the existing graph inspector and selection lifecycle.

Alternative considered: remove Graph View quick detail entirely and navigate only to full detail pages. Rejected because Graph View benefits strongly from preserving graph context while reading details.

### 7. Update Repository Guidance

Update `AGENTS.md` and the quick-detail documentation to say that route interception is not the default solution for entity quick detail in this repo. Analytical quick detail should be local and explicit unless a future proposal justifies route interception with bounded scope.

Rationale: the previous global route pattern was easy to reuse accidentally. The convention needs to be visible in the repo-wide rules.

## Risks / Trade-offs

- [Risk] Losing URL shareability for an open quick-detail drawer. -> Mitigation: keep an explicit full-page action to the canonical route.
- [Risk] Graph View and Market Charts may duplicate some local drawer state/fetching logic. -> Mitigation: share focused content and small app-level drawer helpers, but keep open/close ownership local to each workspace.
- [Risk] Removing `@quickDetail` can reveal links that previously opened drawers but now go full page. -> Mitigation: this is an intended breaking change; update only the analytical surfaces that still require local quick detail.
- [Risk] Local drawers that call server actions from client code may need careful pending/error handling. -> Mitigation: mirror existing ActionResult patterns and keep loading/error state inside the drawer body.
- [Risk] Stale docs/specs may continue to recommend global interception. -> Mitigation: update docs, OpenSpec requirements, and `AGENTS.md` in the same change.

## Migration Plan

1. Remove global `@quickDetail` route files and the `quickDetail` layout slot.
2. Remove or refactor `EntityQuickDetailDrawer` if no remaining route-level usage exists.
3. Update Graph View quick-detail entry points to open a local drawer for event/news article nodes.
4. Update Market Charts annotation event titles to open a local event drawer without changing the route.
5. Keep full-detail links in local drawers for users who need the canonical page.
6. Update documentation, OpenSpec specs, and `AGENTS.md` to codify the local quick-detail rule.
7. Run typecheck, lint where feasible, OpenSpec validation, and static searches proving no active global `@quickDetail` references remain.

Rollback would require reintroducing the global route tree and layout slot, but this change intentionally does not preserve a compatibility path.

## Open Questions

- None blocking. The accepted direction is immediate narrowing with no backward compatibility for the global intercepted route behavior.
