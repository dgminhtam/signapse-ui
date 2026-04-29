## Why

The authenticated home page is currently empty, so users land in the application without a clear workspace context, next action, or summary of what the active workspace controls. Workspace is already used as global scope for watchlist and graph/query workflows, so turning `/` into a focused workspace overview makes the product feel more professional and gives the header switcher a stronger destination.

## What Changes

- Replace the empty protected home page at `/` with a Vietnamese "Tổng quan không gian làm việc" page.
- Show the current workspace as the primary context using backend `currentWorkspace` semantics.
- Add concise overview cards for the active workspace identity, tracked assets/watchlist status, and key technical timestamps without overloading the first screen.
- Provide clear primary actions from the overview, including editing tracked assets through the existing workspace watchlist editor when permissions allow.
- Add professional empty/blocked states for users with no workspace, no workspace read permission, or no tracked assets.
- Keep grouped watchlist concepts out of the UI; the overview only presents the active workspace's single tracked-asset list.
- Align frontend workspace naming and action terminology with the current backend contract: `currentWorkspace` and `/me/workspaces/{id}/set-current`.

## Capabilities

### New Capabilities
- `workspace-overview-home`: Covers the authenticated home page workspace overview, current workspace context, watchlist summary entry point, permission-aware states, and professional Vietnamese UX hierarchy.

### Modified Capabilities
- None.

## Impact

- Affected routes: `app/(main)/page.tsx` becomes the workspace overview surface.
- Affected workspace data flow: `app/(main)/layout.tsx`, `components/workspace-switcher.tsx`, `app/api/workspaces/action.ts`, and `app/lib/workspaces/*` may need naming/contract alignment.
- Affected watchlist entry point: `components/workspace-watchlist-editor.tsx` can be reused or lightly refactored so the overview can launch the same editor.
- Affected docs/checklists: `docs/APIMAPPING.md` and the existing workspace API drift notes should be updated once implementation aligns with `currentWorkspace` and `set-current`.
- No new backend endpoint is required; this change consumes existing workspace and watchlist APIs.
