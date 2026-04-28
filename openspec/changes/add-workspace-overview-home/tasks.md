## 1. Align workspace contract and naming

- [x] 1.1 Confirm the current workspace response fields and switch endpoint from `docs/api_mapping.json` and `docs/APIMAPPING.md`.
- [x] 1.2 Update workspace definitions so `WorkspaceResponse` uses `currentWorkspace` and no longer depends on removed `defaultWorkspace`, `personal`, or `active` fields.
- [x] 1.3 Rename frontend workspace action semantics from `setDefaultWorkspace` to `setCurrentWorkspace` and call `/me/workspaces/{id}/set-current`.
- [x] 1.4 Update active workspace resolution to select `currentWorkspace` before falling back to the first workspace.
- [x] 1.5 Update layout and workspace switcher prop/action names to use current-workspace terminology while preserving the existing permission gate until the backend permission key is confirmed.

## 2. Build workspace overview data flow

- [x] 2.1 Replace the empty `app/(main)/page.tsx` with a server-rendered workspace overview page.
- [x] 2.2 Load workspace permissions, workspace list, and the resolved current workspace for the overview.
- [x] 2.3 Load a small tracked-asset preview from the existing watchlist API only when the active workspace and required read permissions are available.
- [x] 2.4 Keep the overview renderable if the watchlist preview fails by isolating the error to the tracked-assets module.

## 3. Implement professional overview UI

- [x] 3.1 Add a Card shell with `CardHeader`, `CardTitle`, `CardDescription`, and `Separator` for the home overview.
- [x] 3.2 Add a primary workspace summary area that highlights workspace name, current status, concise purpose copy, and primary actions before technical metadata.
- [x] 3.3 Add a tracked-assets summary module with count, compact asset preview, empty state, and permission-aware management action.
- [x] 3.4 Add a lower-priority technical details area for fields such as workspace id, slug, created date, and last modified date.
- [x] 3.5 Add blocked/empty states for no workspace read permission, no current workspace, and no tracked assets using professional Vietnamese copy.

## 4. Reuse watchlist editor safely

- [x] 4.1 Add a small client component for overview actions that opens the existing `WorkspaceWatchlistEditor`.
- [x] 4.2 Pass current workspace and watchlist permissions into the overview action component without making the entire page a Client Component.
- [x] 4.3 Preserve the existing single workspace tracked-asset list model and do not expose grouped watchlist concepts.
- [x] 4.4 Ensure buttons that trigger pending mutations show `Spinner` and are disabled while pending.

## 5. Loading, docs, and cleanup

- [x] 5.1 Add or update a loading skeleton for `/` that closely matches the final workspace overview layout.
- [x] 5.2 Update `docs/APIMAPPING.md` so workspace API integration reflects `currentWorkspace` and `/set-current` after implementation.
- [x] 5.3 Update relevant OpenSpec notes in `refactor-workspace-switcher-header` if implementation changes the old `set-default` wording still present there.
- [x] 5.4 Search touched workspace/home files for mojibake markers and legacy terms such as `defaultWorkspace`, `set-default`, and user-facing "default" copy.

## 6. Verification

- [x] 6.1 Run targeted lint for the touched home, workspace, and watchlist files.
- [x] 6.2 Run `pnpm typecheck`.
- [x] 6.3 Run `pnpm build` if typecheck passes.
- [x] 6.4 Smoke test `/` on desktop and narrow viewport when local auth/backend data allow it, including no-workspace and no-tracked-assets states where feasible.

Verification note: `pnpm lint -- "app/(main)/page.tsx" "app/(main)/workspace-overview-actions.tsx" "app/(main)/layout.tsx" "components/workspace-switcher.tsx" "components/workspace-watchlist-editor.tsx" "app/api/workspaces/action.ts" "app/lib/workspaces/active.ts" "app/lib/workspaces/current.ts" "app/lib/workspaces/definitions.ts"` passed. `pnpm typecheck` passed. `pnpm build` passed. Browser smoke test was not run because this environment does not currently provide an authenticated browser session with backend workspace data.
