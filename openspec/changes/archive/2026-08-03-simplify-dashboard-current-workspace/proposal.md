## Why

The production dashboard currently mixes the active workspace and tracked-asset context with a separate narrative preview, while the accepted dashboard prototype provides a clearer Current Workspace surface. Simplifying the dashboard to that single surface keeps the entry route focused on workspace scope and removes an unnecessary narrative request.

## What Changes

- Apply the dashboard prototype's Current Workspace presentation to the production dashboard using live workspace and tracked-asset data.
- Preserve the existing workspace permission gates, active-workspace resolution, watchlist API integration, management action, and localized error and empty states.
- Remove the narrative preview section and its dashboard-side data loading.
- Reduce the dashboard loading skeleton to the single Current Workspace surface.
- Keep the isolated dashboard prototype route and its mock review scenarios unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workspace-overview-surface`: Require the successful dashboard to render a single Current Workspace card using the accepted prototype hierarchy with live data and existing state handling.
- `workspace-overview-narrative-preview`: Remove the narrative preview and its narrative request from the root dashboard.
- `dashboard-ui-prototype`: Allow the production dashboard to adopt the prototype's Current Workspace presentation without importing prototype mock data or scenario controls.

## Impact

- Primary implementation scope: `app/[lang]/(main)/dashboard/page.tsx`.
- Existing workspace, watchlist, permission, localization, and watchlist-management contracts remain unchanged.
- The production dashboard stops requesting narrative summaries because it no longer renders narrative content.
- No backend API, DTO, dependency, shared component, or prototype-route changes are required.
