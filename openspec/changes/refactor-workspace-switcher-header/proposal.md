## Why

The workspace selector currently sits in the sidebar header and consumes the same visual slot that should establish Signapse brand identity. The code also keeps two workspace switcher components (`workspace-switcher.tsx` and `workspace-switcher-v2.tsx`), leaving an unclear canonical path and making future workspace UX iteration risky.

## What Changes

- Move workspace selection from the sidebar header into the top application header, positioned near the breadcrumb as global context for the current page.
- Restore a dedicated Signapse brand row in the sidebar header so the app logo and workspace context are visually distinct.
- Consolidate workspace selection into one canonical component and remove the legacy duplicate switcher after migration.
- Keep workspace create, rename, set-default, and tracked-asset watchlist entry points available from the canonical workspace menu according to existing permissions.
- Keep `WorkspaceWatchlistEditor` as a separate workspace-scoped editor instead of folding watchlist editing into sidebar branding.
- Clean workspace/header/sidebar user-facing copy so it is professional Vietnamese and contains no mojibake.
- Remove obvious workspace/sidebar demo or dead code such as the unused `TeamSwitcher` path when it is no longer needed.
- Preserve existing backend APIs, permissions, and workspace resolution behavior.

## Capabilities

### New Capabilities

- `workspace-header-switcher`: Covers placement, behavior, cleanup, and acceptance criteria for a single canonical workspace switcher rendered in the application header.

### Modified Capabilities

- None.

## Impact

- Affected shell layout under `app/(main)/layout.tsx`.
- Affected sidebar composition under `components/app-sidebar.tsx`.
- Affected workspace selector components under `components/workspace-switcher*.tsx`.
- Affected workspace watchlist entry point via `components/workspace-watchlist-editor.tsx`, without changing watchlist domain behavior.
- Affected breadcrumb/header adjacency through `components/app-breadcrumbs.tsx` if copy or responsive layout needs cleanup.
- No backend API, DTO, database, permission, or data migration changes.
