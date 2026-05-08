## Why

The latest backend workspace snapshot removed `slug` from workspace create, update, response, and `/me` summary contracts, while the frontend still types, sends, and displays that field. This can make workspace create/rename submit unsupported payloads and leaves the shell showing metadata the backend no longer provides.

## What Changes

- Align workspace request and response definitions with the backend contract: `WorkspaceResponse` keeps `id`, `name`, `currentWorkspace`, `createdDate`, and `lastModifiedDate`; create/update requests only carry `name`.
- Remove `slug` from workspace create and rename dialog state, validation, copy, request payloads, and visible menu subtitles.
- Remove workspace `slug` metrics and technical details from the workspace overview layout.
- Align `/me` user definitions with `currentWorkspace` and the current `mainImage` media object shape enough for frontend consumers to stay type-safe.
- Preserve existing workspace endpoints, permissions, active workspace resolution, `set-current` behavior, watchlist management entry point, and header/sidebar placement.

## Capabilities

### New Capabilities
- `workspace-contract-alignment`: Covers frontend layout, action, and definition alignment for the simplified workspace backend contract.

### Modified Capabilities

## Impact

- Affected frontend code:
  - `app/lib/workspaces/definitions.ts`
  - `app/api/workspaces/action.ts`
  - `components/workspace-switcher.tsx`
  - `app/(main)/page.tsx`
  - `app/lib/users/definitions.ts`
- Affected documentation:
  - `docs/APIMAPPING.md`
- No backend endpoint, permission, route, dependency, or database changes are required.
