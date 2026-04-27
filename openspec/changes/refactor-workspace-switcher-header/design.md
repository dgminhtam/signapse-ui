## Context

The current application shell loads workspaces in `app/(main)/layout.tsx`, passes them into `AppSidebar`, and renders `WorkspaceSwitcherV2` inside `SidebarHeader`. That makes the sidebar header responsible for both application identity and workspace context. It also leaves `workspace-switcher.tsx` and `workspace-switcher-v2.tsx` side by side, even though only the V2 path is actively used.

Workspace watchlist management is still a required capability. This change should move the switcher placement and clean component ownership without changing the existing backend workspace or watchlist APIs.

## Goals / Non-Goals

**Goals:**

- Put workspace context near the breadcrumb in the top header.
- Restore a stable Signapse brand/logo row in the sidebar header.
- Collapse the two switcher implementations into one canonical workspace selector component.
- Preserve workspace switch, create, rename, set-default, and tracked-asset list entry points.
- Keep `WorkspaceWatchlistEditor` as a separate focused editor launched from the workspace menu.
- Remove unused workspace/sidebar demo code and clean mojibake or mixed-language copy in the touched shell/workspace files.
- Keep responsive behavior usable when the sidebar is collapsed or the viewport is narrow.

**Non-Goals:**

- Changing backend workspace, watchlist, asset, or permission APIs.
- Redesigning the entire app shell, sidebar primitive, breadcrumb primitive, or theme system.
- Adding workspace search, workspace avatars, multi-select workspace operations, or grouped watchlists.
- Editing files in `components/ui/`.
- Reworking unrelated sidebar navigation items beyond copy directly touched by this shell cleanup.

## Decisions

### 1. Header owns workspace context

Render the canonical workspace switcher in the top header next to the breadcrumb group. The sidebar should no longer use the workspace selector as its header.

Why:
- Workspace is global page context, similar to breadcrumb location.
- The sidebar header should be free to establish app identity.
- The selector remains visible while navigating pages and no longer competes with the app logo.

Alternative considered:
- Keep selector in sidebar and add a separate brand mark above it.
- Rejected because the left rail remains visually crowded and workspace context still feels like navigation chrome instead of page context.

### 2. Sidebar owns brand and navigation only

`AppSidebar` should render a dedicated Signapse brand row in `SidebarHeader`, followed by navigation and user controls. It should not need `workspaces` or `resolveActiveWorkspace` unless another sidebar-only feature requires them.

Why:
- This separates identity, navigation, and workspace context into clearer zones.
- It reduces sidebar prop surface and removes the awkward logo-as-workspace-avatar treatment.

Alternative considered:
- Keep passing workspace data through `AppSidebar` and render a header child from there.
- Rejected because it keeps workspace concerns coupled to sidebar composition.

### 3. One canonical workspace switcher component

Use a single exported component for workspace selection, preferably `WorkspaceSwitcher`, and remove `WorkspaceSwitcherV2` after migration. The canonical component should be layout-neutral enough to render in the header without depending on `SidebarMenu`, `SidebarMenuButton`, or `useSidebar`.

Why:
- The project should not carry V2 naming once the implementation is the only path.
- Header placement should not depend on sidebar-only primitives.
- Future workspace UX changes need one edit target.

Alternative considered:
- Keep `workspace-switcher-v2.tsx` and delete the old file only.
- Rejected because the V2 name encodes migration history into the product component and keeps a sidebar-shaped implementation.

### 4. Keep watchlist editor separate

The workspace menu should keep an action that opens `WorkspaceWatchlistEditor` when permissions allow it, but the editor remains a separate component.

Why:
- Existing workspace-watchlist requirements remain valid.
- Watchlist editing is a secondary workflow and should not bloat the switcher trigger or sidebar brand.

Alternative considered:
- Move watchlist editing into a separate sidebar or settings page.
- Rejected for this change because it would broaden navigation and route scope beyond the selector cleanup.

### 5. Use professional Vietnamese copy throughout touched shell paths

All touched workspace, sidebar, breadcrumb, and watchlist UI copy must be readable Vietnamese. English should remain only for proper nouns, technical tokens, or source identifiers where appropriate.

Why:
- Current workspace/header files contain mojibake and mixed-language labels.
- Moving the control to a more prominent header location increases the importance of copy quality.

Alternative considered:
- Clean only the new header switcher copy.
- Rejected because existing dialogs/menu items remain reachable from the same workflow.

## Risks / Trade-offs

- [Header overcrowding] -> Keep the switcher compact, right-align it with mode toggle on desktop, and allow wrapping or a second header row on narrow screens if needed.
- [Losing workspace visibility on mobile] -> Ensure the trigger remains visible or collapses into a compact label/chip rather than disappearing behind the sidebar.
- [Breaking workspace actions during component consolidation] -> Preserve the existing server actions and permission checks, then verify create, rename, set-default, and watchlist launch paths.
- [Watchlist editor copy remains corrupted] -> Include touched editor copy cleanup in the task list because the editor is launched from the new canonical switcher.
- [Scope creep into full shell redesign] -> Limit layout changes to sidebar header, top header, workspace switcher, breadcrumb copy, and dead code removal.

## Migration Plan

1. Refactor `WorkspaceSwitcher` into the canonical header-ready component.
2. Move active workspace resolution and permission derivation from `AppSidebar` into the main layout/header area.
3. Render the canonical switcher in the top header next to the breadcrumb/mode controls.
4. Restore a dedicated Signapse brand row in `AppSidebar`.
5. Remove the duplicate legacy or V2 workspace switcher file and the unused sidebar `TeamSwitcher` path.
6. Clean copy and verify responsive shell behavior.

Rollback strategy:
- Revert the shell/workspace component changes and restore the previous `WorkspaceSwitcherV2` usage from `AppSidebar`; no backend or data rollback is required.
