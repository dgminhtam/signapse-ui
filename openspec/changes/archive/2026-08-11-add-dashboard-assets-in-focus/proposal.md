## Why

Backend now returns a workspace-scoped `assetsInFocus` metric from the existing `GET /dashboard/summary` contract, but the production dashboard validation boundary strips the field and the reviewed Assets in Focus presentation remains available only in the mock prototype. Integrating the metric now gives users ranked asset context and direct investigation paths without adding frontend aggregation or per-asset requests.

## What Changes

- Extend the production dashboard summary validation and types to preserve the required `assetsInFocus` metric and the backend contract's required-versus-nullable semantics.
- Add a production-local, localized Assets in Focus section that adapts the reviewed `/dashboard-prototype` card and item composition to live backend data.
- Render at most six assets in the backend-provided order with asset identity, neutral asset-type category, context title, optional context summary, observed time, and a permission-aware Market Charts deep link.
- Provide explicit `AVAILABLE`, `EMPTY`, `DENIED`, `ERROR`, endpoint-failure, and loading presentations without mock or stale fallback data.
- Gate the module-wide Graph View action and per-item Market Charts actions with their existing destination permissions.
- Keep Current Workspace as the single owner of tracked-asset management and keep `/dashboard-prototype` isolated and unchanged.

## Capabilities

### New Capabilities

- `dashboard-assets-in-focus`: Defines consumption, validation, presentation, states, navigation, localization, accessibility, and prototype-isolation behavior for the live Assets in Focus section.

### Modified Capabilities

- `dashboard-trading-snapshot`: Updates the shared dashboard summary contract from five to six required metrics and includes Assets in Focus among the modules populated by the one authenticated summary request.
- `workspace-overview-surface`: Adds Assets in Focus to the successful production overview and loading composition while preserving Current Workspace as the only tracked-asset management surface.

## Impact

- Affected API boundary: `app/lib/dashboard/definitions.ts`; the existing `app/api/dashboard/action.ts` transport remains unchanged.
- Affected production UI: `app/[lang]/(main)/dashboard/page.tsx` plus a new route-local Assets in Focus component and skeleton.
- Affected localization: Vietnamese and English `workspaceOverview` dictionaries.
- Existing Graph View and Market Charts permission helpers and localized routes are reused; no new endpoint, dependency, backend change, or N+1 request is introduced.
- `docs/api_mapping.json` remains the backend source of truth and `/dashboard-prototype` remains an isolated review surface.
