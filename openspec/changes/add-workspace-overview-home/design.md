## Context

The protected home page at `app/(main)/page.tsx` currently renders an empty fragment. Workspace context is resolved in the main layout for the header switcher, while the watchlist editor is reachable only from the workspace menu. API mapping already notes that the backend workspace contract has moved from `defaultWorkspace` and `/set-default` to `currentWorkspace` and `/set-current`, but the frontend code still uses the older names.

This change should make `/` a useful landing surface without turning workspace into a heavy settings module. The page should communicate the active workspace, expose the most relevant workspace-scoped data, and provide a clean entry point to the existing tracked-asset editor.

## Goals / Non-Goals

**Goals:**

- Replace the empty home page with a professional Vietnamese workspace overview.
- Make the current workspace the dominant user-facing context on the first screen.
- Align frontend workspace naming and active-workspace resolution with the backend `currentWorkspace` contract.
- Surface tracked assets as a workspace-scoped summary and reuse the existing editor for management.
- Keep the page compact, scannable, and consistent with the repo's Card shell, shadcn primitives, Empty states, and permission patterns.

**Non-Goals:**

- Adding new backend endpoints or changing backend workspace behavior.
- Adding grouped watchlists, named watchlist collections, or nested watchlist management.
- Adding member management, billing, destructive workspace deletion, or advanced workspace settings.
- Redesigning the whole app shell, sidebar primitive, theme system, or unrelated navigation pages.
- Editing files in `components/ui/`.

## Decisions

### 1. Use `/` as the workspace overview, not a generic dashboard

The page should be titled "Tổng quan không gian làm việc" and focus on the current workspace rather than system-wide metrics. This matches the user's selected option and avoids creating a broad dashboard that would need unrelated APIs.

Alternative considered:
- Build a full admin dashboard with cross-feature metrics.
- Rejected because the available backend contract only clearly supports workspace metadata and active workspace watchlist data.

### 2. Keep the overview server-led with a small client island for actions

`app/(main)/page.tsx` should remain a Server Component that fetches permissions, workspaces, and a small watchlist preview. A local Client Component can own interactive actions such as opening `WorkspaceWatchlistEditor`.

Why:
- Server-led rendering keeps the first screen stable and avoids duplicating permission checks in broad client state.
- The existing watchlist editor is already client-only and can be reused behind a focused action button.

Alternative considered:
- Make the full home page a Client Component.
- Rejected because the page mostly renders server data and should avoid unnecessary client hydration.

### 3. Align workspace naming before building on top of it

Implementation should rename frontend semantics from `defaultWorkspace` to `currentWorkspace`, and from `setDefaultWorkspace` to `setCurrentWorkspace`, while calling `/me/workspaces/{id}/set-current`.

Why:
- The overview must not introduce more product copy or code around a legacy "default" concept.
- Current workspace is a runtime scope, not a preference/default setting.

Alternative considered:
- Keep old frontend names and only adjust the homepage copy.
- Rejected because it would make the new overview depend on known API drift documented in `APIMAPPING.md`.

### 4. Present watchlist as a summary module, not a separate product area

The overview should show a tracked-asset count and a small preview when permissions allow. The edit action should launch the existing workspace watchlist editor and preserve the existing single-list model.

Why:
- Watchlist is workspace-scoped and directly helps users understand what the current workspace monitors.
- This keeps the UI simple while avoiding unsupported grouped watchlist concepts.

Alternative considered:
- Restore `/watchlists` as a standalone route.
- Rejected for this change because the selected direction is to make `/` the workspace overview, and a separate route would broaden scope.

### 5. Put core facts before technical metadata

The top area should show workspace name, current status, and short intent. Technical fields such as `id`, `slug`, `createdDate`, and `lastModifiedDate` should sit in lower-priority detail cards or rows.

Why:
- The workspace screen should help users orient quickly, not read a DTO dump.
- This follows the repo rule for simplified API screens: prioritize entity name, status, key timestamp, and primary action before technical fields.

## Risks / Trade-offs

- [Duplicate workspace fetch with layout] -> Keep the page fetch simple for now; avoid introducing shared global state unless performance becomes a measured issue.
- [Permission key for workspace switching may still be legacy] -> Verify the backend permission constant during implementation; preserve current permission behavior unless the contract confirms a new key.
- [Overview becomes too dense] -> Limit first version to current workspace identity, tracked assets, quick actions, and technical details.
- [Watchlist preview fails independently] -> Render the workspace overview even if watchlist preview fails, and show a localized blocked/error state only inside the watchlist module.
- [Existing header switcher change still references set-default] -> Update the header switcher naming and OpenSpec notes during implementation so both changes converge on `currentWorkspace`.

## Migration Plan

1. Align workspace DTO/action/resolver naming with `currentWorkspace` and `/set-current`.
2. Build the server-rendered workspace overview at `/`.
3. Add a small client action component that can open the existing watchlist editor from the overview.
4. Add loading/empty/blocked states that match the final layout.
5. Update APIMAPPING and any active workspace OpenSpec notes touched by the naming change.

Rollback strategy:
- Revert the homepage route back to an empty fragment and restore the old workspace action/resolver names if needed. No backend or persisted data rollback is required.
