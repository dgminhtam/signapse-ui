## Context

Signapse previously explored quick detail through a global `@quickDetail` parallel route under `(main)`. That pattern allowed client-side navigation to canonical event/news article detail URLs to render a drawer above the current workspace, while direct navigation rendered the full page.

The behavior is too implicit for this admin dashboard. Analytical workspaces such as Graph View and Market Charts hold expensive local state: chart instance lifecycle, loaded candles, lazy history, graph layout, selected nodes, annotation popups, and live-stream runtime state. Quick detail in those surfaces is a reading layer over the workspace, not a navigation event. The route interceptor should be removed cleanly rather than narrowed or kept as a compatibility path.

## Goals / Non-Goals

**Goals:**

- Remove global intercepted quick-detail routes and the `quickDetail` layout slot.
- Keep quick detail as an explicit workspace-owned Drawer opened by local state.
- Ensure opening and closing quick detail does not call `router.back()`, `router.push()`, or `router.replace()`.
- Keep canonical `/events/{id}` and `/news-articles/{id}` as normal full detail pages for direct navigation, reloads, copied links, list/detail CRUD, and explicit full-page escalation.
- Delete stale route-level drawer code, placeholders, imports, docs, and OpenSpec guidance instead of preserving unused compatibility layers.
- Keep `AGENTS.md` and `AGENTS.vi.md` synchronized if repo guidance changes.

**Non-Goals:**

- No backward compatibility for the old global `@quickDetail` intercepted route behavior.
- No query-param based quick-detail state for this change.
- No route interception with narrower guards for this change.
- No redesign of event/news article full detail pages.
- No backend API, DTO, auth, permission, or database change.
- No replacement of the shadcn Drawer primitive currently used for quick detail.

## Decisions

### 1. Delete the Global Interceptor Instead of Guarding It

The implementation should delete the `@quickDetail` route tree and remove the parallel route slot from `(main)/layout.tsx`.

Rationale: keeping the route slot with guards still leaves two presentation modes for the same canonical URL and invites future accidental reuse.

Alternative considered: keep the slot and add caller-specific route guards. Rejected because it preserves the hidden behavior and stale compatibility surface.

### 2. Local Quick Detail Is Owned by the Workspace

Graph View and Market Charts should hold selected quick-detail entity state locally and render a local drawer from that state.

Rationale: workspace-owned state makes open/close behavior explicit and avoids resetting graph/chart state through route transitions.

Alternative considered: encode quick detail in URL query params. Rejected because it still performs route updates and can re-run server component or client loading paths.

### 3. Canonical Detail Links Are Full Page Only

The canonical `/events/{id}` and `/news-articles/{id}` paths should always mean full detail pages outside local drawer state. Local drawers can include an explicit full-page action that intentionally navigates to the canonical route.

Rationale: this restores a single, predictable meaning for canonical entity URLs while preserving shareable detail pages.

Alternative considered: preserve soft-navigation overlay behavior for compatibility. Rejected because the user explicitly wants no backward compatibility path.

### 4. Cleanup Is Part of the Contract

Removal is incomplete if unused route files, route-level drawer wrappers, placeholder defaults/errors, stale imports, stale docs, or stale OpenSpec references remain.

Rationale: leftover route-interception artifacts make future work ambiguous and increase the chance of accidentally reintroducing the global pattern.

Alternative considered: leave unused files for rollback. Rejected because rollback is not a goal and the change is intentionally breaking.

### 5. Keep the Drawer, Not the Interceptor

The quick-detail UI should continue to use the current bottom Drawer pattern for broad reading content in analytical workspaces.

Rationale: the Drawer is the right surface for focused, temporary reading over chart/graph workspaces. The problem is route ownership, not the overlay primitive.

Alternative considered: migrate quick detail to a right-side Sheet. Rejected for this change because it expands scope and is not required to remove route interception.

## Risks / Trade-offs

- [Risk] Open quick-detail drawer state is no longer URL-shareable. -> Mitigation: keep explicit full-page actions to canonical detail routes.
- [Risk] Some callers that previously depended on intercepted soft navigation will now open full detail pages. -> Mitigation: update only the analytical surfaces that need local quick detail; normal links intentionally become full page.
- [Risk] Stale docs or specs can continue to recommend global interception. -> Mitigation: update docs, OpenSpec deltas, `AGENTS.md`, and `AGENTS.vi.md` in the same implementation.
- [Risk] Local drawer loading may duplicate small pieces of fetch/error handling. -> Mitigation: share focused content or small local helpers only when they are actively used; do not keep route-level wrappers.

## Migration Plan

1. Remove the global `@quickDetail` route tree and `quickDetail` layout slot.
2. Remove route-level quick-detail drawer components and imports that have no local usage.
3. Wire Graph View event/news article detail actions to local drawer state.
4. Wire Market Charts annotation event actions to local event drawer state.
5. Keep full-page escalation links in the local drawer.
6. Update documentation, OpenSpec specs, `AGENTS.md`, and `AGENTS.vi.md`.
7. Verify with OpenSpec validation, static searches for route-interception leftovers, typecheck, and lint.

Rollback would require a separate proposal that intentionally reintroduces bounded route interception. This change does not keep rollback code in the app.

## Open Questions

- None blocking. The desired direction is clean removal with no placeholders and no backward compatibility path.
