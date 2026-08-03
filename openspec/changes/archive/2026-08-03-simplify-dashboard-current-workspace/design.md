## Context

The production dashboard is a server-rendered route that already resolves permissions, loads the user's workspaces, selects the active workspace, and fetches a capped tracked-asset preview. It currently renders that data in a custom bordered panel and separately loads and renders a narrative preview. The dashboard prototype contains an accepted Current Workspace card hierarchy, but it is intentionally coupled to route-local mock data and scenario controls.

The implementation must preserve the production data path and state handling, follow the repository's Financial Command Surface conventions, and leave the prototype route isolated.

## Goals / Non-Goals

**Goals:**

- Render the production dashboard's successful state as one Current Workspace surface.
- Apply the prototype's `Card` and `Item` hierarchy to live workspace and tracked-asset data.
- Preserve the existing workspace/watchlist permissions, API calls, management workflow, localization, and failure states.
- Stop loading narratives from the dashboard and remove the narrative UI and matching skeleton content.

**Non-Goals:**

- Changing backend APIs, DTOs, permissions, search parameters, or watchlist synchronization.
- Reusing prototype mock data, scenario controls, or prototype dictionary content in production.
- Removing or redesigning `/dashboard-prototype`.
- Extracting a shared abstraction solely for the two routes.

## Decisions

### Refactor the existing production panel in place

`WorkspaceOverviewPanel` will retain ownership of production data and permission states while adopting the prototype's `Card`, `CardHeader`, `CardAction`, `CardContent`, `ItemGroup`, and `Item` composition. This keeps the change within the dashboard route and avoids coupling production code to a mock-only prototype component.

Alternative considered: export and parameterize the prototype `CurrentWorkspace` component. Rejected because it would expand a route-local mock component with production DTOs, permission behavior, and mutation actions.

### Preserve production behavior inside the adopted hierarchy

The active workspace name, localized description, last-modified timestamp, tracked-asset count, asset name, symbol, type, and existing `WorkspaceOverviewActions` control will populate the new card. Existing localized `Empty` states remain authoritative for missing permissions, load failures, and empty data instead of copying the prototype's simplified placeholder text.

Alternative considered: copy the prototype section verbatim. Rejected because its timestamp and assets are constants, and its Manage Assets link points back to the dashboard rather than opening the production editor.

### Remove the narrative branch at its dashboard entry point

The dashboard will remove the narrative permission check, `getNarratives` request, preview state, rendering helpers, and narrative skeleton. The underlying narrative action and shared narrative contracts remain unchanged because they are outside the dashboard presentation scope.

Alternative considered: keep the request but hide the section. Rejected because the result would be unused and would add latency and backend work.

### Keep one route-local skeleton

The Suspense fallback will mirror only the Current Workspace card, including its header/action footprint and responsive asset-item grid. No new loading abstraction is needed for a single route.

## Risks / Trade-offs

- [The dashboard no longer surfaces narrative summaries] → Narrative functionality remains available through its existing APIs and routes; this change intentionally narrows the dashboard contract.
- [Prototype and production markup can drift later] → Treat the prototype as the accepted visual reference for this migration, while keeping production behavior local rather than introducing premature sharing.
- [Removing narrative loading changes request traffic] → Verify statically that only the dashboard call is removed and that narrative API/action files are untouched.
- [Skeleton can diverge from the final card] → Update and review the fallback in the same route change and verify responsive grid classes match.

## Migration Plan

1. Refactor the production workspace panel to the accepted card/item hierarchy.
2. Remove the dashboard narrative branch and unused imports/types/helpers.
3. Reduce the Suspense skeleton to the single card.
4. Run lint, typecheck, OpenSpec validation, and targeted static searches.

Rollback is a single-file revert of the dashboard route; there is no data migration or backend rollout dependency.

## Open Questions

None.
