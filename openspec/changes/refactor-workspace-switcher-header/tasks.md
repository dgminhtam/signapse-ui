## 1. Audit workspace shell state

- [x] 1.1 Confirm current workspace data flow from `app/(main)/layout.tsx` through `AppSidebar` into `WorkspaceSwitcherV2`.
- [x] 1.2 Search for all imports/usages of `WorkspaceSwitcher`, `WorkspaceSwitcherV2`, `WorkspaceWatchlistEditor`, and sidebar `TeamSwitcher`.
- [x] 1.3 Search touched workspace/header/sidebar files for mojibake, English UI copy, sidebar-only switcher dependencies, and unused imports.

## 2. Move workspace context to the top header

- [x] 2.1 Resolve the active workspace and workspace permissions in `app/(main)/layout.tsx` for use by the top header.
- [x] 2.2 Render the canonical workspace selector beside the breadcrumb/header controls when workspace read permission is available.
- [x] 2.3 Adjust the header layout so the sidebar trigger and breadcrumb stay readable while workspace selector and mode toggle remain discoverable on desktop and narrow viewports.

## 3. Restore sidebar brand ownership

- [x] 3.1 Remove workspace selector rendering and workspace-specific props from `AppSidebar` unless another sidebar feature still requires them.
- [x] 3.2 Add a dedicated Signapse brand/logo row in `SidebarHeader` that works in expanded and collapsed sidebar states.
- [x] 3.3 Remove unused sidebar demo code such as `TeamSwitcher` and any imports needed only by that dead path.

## 4. Consolidate workspace switcher components

- [x] 4.1 Refactor the active workspace selector into one canonical component named `WorkspaceSwitcher` or an equally clear single export.
- [x] 4.2 Remove `WorkspaceSwitcherV2` usage and delete or replace the duplicate legacy switcher implementation so only one active selector remains.
- [x] 4.3 Make the canonical switcher layout-neutral by avoiding sidebar-only primitives such as `SidebarMenuButton` and `useSidebar`.
- [x] 4.4 Preserve workspace switch, create, rename, set-default, pending feedback, disabled duplicate submission, refresh behavior, and permission-gated menu actions.

## 5. Preserve tracked-asset watchlist entry point

- [x] 5.1 Keep the tracked-asset editor action available from the workspace menu only when active workspace, asset, and watchlist permissions allow it.
- [x] 5.2 Keep `WorkspaceWatchlistEditor` as a separate component and pass the selected workspace plus permissions from the canonical selector.
- [x] 5.3 Verify the watchlist editor still follows the existing workspace-watchlist-management spec and does not expose grouped watchlist concepts.

## 6. Clean workspace and shell copy

- [x] 6.1 Replace mojibake and mixed-language strings in the canonical workspace selector dialogs, menu labels, toasts, and empty states.
- [x] 6.2 Replace mojibake and mixed-language strings in `WorkspaceWatchlistEditor` that remain reachable from the selector.
- [x] 6.3 Clean directly touched sidebar and breadcrumb labels so the header/sidebar shell remains professional Vietnamese.

## 7. Verification

- [x] 7.1 Run targeted search to confirm no touched workspace/header/sidebar files contain mojibake markers such as `Ã`, `Ä`, `Æ`, `áº`, or `á»`.
- [x] 7.2 Run targeted lint for touched layout, sidebar, workspace switcher, watchlist editor, and breadcrumb files.
- [x] 7.3 Run `pnpm typecheck`.
- [ ] 7.4 Smoke test desktop and narrow viewport header behavior, sidebar expanded/collapsed brand behavior, workspace switch, create, rename, and tracked-asset editor launch where local permissions/data allow it.

Verification note: Targeted Node search found no mojibake markers or legacy `WorkspaceSwitcherV2`/`TeamSwitcher` references in the touched shell/workspace files. `pnpm lint -- "app/(main)/layout.tsx" "components/app-sidebar.tsx" "components/workspace-switcher.tsx" "components/workspace-watchlist-editor.tsx" "components/app-breadcrumbs.tsx" "app/api/workspaces/action.ts" "app/api/watchlists/action.ts"` passed. `pnpm typecheck` passed. `git diff --check` passed for the same scoped files. Browser smoke test was not run in this session.
