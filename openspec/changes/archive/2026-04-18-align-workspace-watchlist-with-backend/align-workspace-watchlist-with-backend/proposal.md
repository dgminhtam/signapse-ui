## Why

The current watchlist feature mixes two incompatible models: a grouped watchlist UI with named lists and descriptions, and a backend contract that behaves like a single asset watchlist scoped to the active workspace. This mismatch makes the feature hard to reason about, leaves dead UI paths in the codebase, and increases the risk of building frontend behavior the backend cannot support.

## What Changes

- Standardize the frontend watchlist domain to a single watchlist per active workspace.
- Make the workspace watchlist editor the primary management surface for adding and removing tracked assets.
- Remove or retire grouped watchlist flows that assume named watchlists, descriptions, or nested watchlist items.
- Align watchlist types, copy, and action semantics with the existing backend contract that only adds, lists, and removes assets for the active workspace.
- Keep backend APIs unchanged in this phase and limit the change to frontend behavior, terminology, and UX cleanup.

## Capabilities

### New Capabilities
- `workspace-watchlist-management`: Manage the tracked asset list for the active workspace using the existing backend watchlist API.

### Modified Capabilities
- None.

## Impact

- Affected frontend watchlist actions and types in `app/api/watchlists` and `app/lib/watchlists`.
- Affected user-facing watchlist surfaces, especially `components/workspace-watchlist-editor.tsx` and the dormant `app/(main)/watchlists` route.
- No backend API, schema, or dependency changes in this phase.
