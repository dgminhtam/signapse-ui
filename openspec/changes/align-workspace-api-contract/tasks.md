## 1. Audit current workspace contract drift

- [x] 1.1 Confirm `docs/api_mapping.json` workspace request/response schemas and `/me` response fields.
- [x] 1.2 Search workspace shell, action, and definitions code for `slug`, `workspace`, `currentWorkspace`, and `mainImage` usages.
- [x] 1.3 Identify any touched UI copy that contains mojibake or mixed Vietnamese/English while editing the workspace flow.

## 2. Align workspace definitions and actions

- [x] 2.1 Remove `slug` from `WorkspaceCreateRequest`, `WorkspaceUpdateRequest`, and `WorkspaceResponse`.
- [x] 2.2 Ensure `createWorkspace()` and `updateWorkspace()` callers can only pass the backend-supported `name` payload.
- [x] 2.3 Keep `setCurrentWorkspace()` on `PATCH /me/workspaces/{id}/set-current` and preserve layout revalidation behavior.

## 3. Remove obsolete slug UI from workspace surfaces

- [x] 3.1 Remove create and rename slug state, inputs, helper copy, reset logic, and payload composition from `components/workspace-switcher.tsx`.
- [x] 3.2 Update workspace menu item secondary text so it no longer reads `workspace.slug` and still communicates selected/current state clearly.
- [x] 3.3 Remove slug metrics and technical detail rows from `app/(main)/page.tsx` while preserving supported workspace facts and actions.
- [x] 3.4 Verify workspace create/rename dialog spacing and overview layout still look intentional after the shorter field set.

## 4. Align `/me` user definitions

- [x] 4.1 Rename the legacy `workspace` field in `BackendMeResponse` to `currentWorkspace`.
- [x] 4.2 Remove `slug` from `BackendWorkspaceSummary`.
- [x] 4.3 Type `mainImage` as the backend media object shape instead of a string, reusing an existing media response type where practical.
- [x] 4.4 Confirm `getCurrentPermissions()` remains focused on `permissions[]` and does not require unrelated profile fields.

## 5. Update API mapping ledger

- [x] 5.1 Update the workspace endpoint rows in `docs/APIMAPPING.md` after frontend code no longer reads or sends `slug`.
- [x] 5.2 Update the `/me` row and drift notes after user response definitions use `currentWorkspace` and media-object `mainImage`.
- [x] 5.3 Keep any unrelated documented drift intact, including non-workspace API changes still pending.

## 6. Verification

- [x] 6.1 Run targeted search to confirm workspace code no longer contains stale `workspace.slug`, slug inputs, or slug payload composition.
- [x] 6.2 Run targeted lint or `/lint` for touched workspace switcher, overview, action, and definition files.
- [x] 6.3 Run `/typecheck` or equivalent TypeScript verification.
- [x] 6.4 Smoke test workspace switch, create workspace, rename workspace, and workspace overview where local permissions/data allow it.

Verification note: Targeted search found no stale workspace `slug` field, slug input, or slug payload composition in the touched workspace files and APIMAPPING notes. `pnpm lint -- "app/(main)/page.tsx" "components/workspace-switcher.tsx" "app/api/workspaces/action.ts" "app/lib/workspaces/definitions.ts" "app/lib/users/definitions.ts"` passed. `pnpm typecheck` passed. Browser smoke testing was not run because this session does not have an authenticated local workspace/BE data setup to exercise create, rename, and switch flows.
