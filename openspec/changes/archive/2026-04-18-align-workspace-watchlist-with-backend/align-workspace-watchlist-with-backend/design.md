## Context

The current frontend contains two competing watchlist models. The active implementation path uses a workspace-scoped editor that loads and saves a flat list of tracked assets through the existing backend watchlist API. At the same time, the dormant `app/(main)/watchlists` route and related commented-out components describe a grouped watchlist experience with names, descriptions, and nested items that the current backend contract does not expose.

This change standardizes the feature around the backend behavior that already exists: one watchlist per active workspace, represented as a flat list of tracked assets. The repository also has UI and review rules that require clear Vietnamese copy, explicit loading feedback, and consistent handling of empty states and destructive actions.

## Goals / Non-Goals

**Goals:**
- Align the frontend watchlist domain with the current backend contract without requiring backend changes.
- Make the workspace watchlist editor the primary and unambiguous management surface.
- Remove or retire grouped watchlist code paths that imply unsupported backend behavior.
- Clarify frontend types and copy so engineers and users both understand watchlist as a workspace asset list.

**Non-Goals:**
- Introducing named watchlist groups, watchlist descriptions, or multi-watchlist management.
- Changing backend endpoints, request payloads, or response schemas.
- Building a new standalone watchlist module beyond what is needed to remove ambiguity from the current product surface.

## Decisions

### 1. Frontend watchlist semantics will be workspace-scoped and flat
The frontend will treat watchlist data as a single list of tracked assets for the active workspace.

Why:
- This matches the existing API shape: list, add by `assetId`, and delete by `assetId`.
- It removes the mismatch between FE expectations and BE capabilities.

Alternative considered:
- Preserve grouped watchlist UI and map it onto the flat API.
- Rejected because it hides unsupported behavior behind a misleading interface and creates immediate product debt.

### 2. The workspace editor will remain the primary user surface
`components/workspace-watchlist-editor.tsx` will be the main surface for managing tracked assets.

Why:
- It already matches the workspace-scoped model and requires the fewest conceptual changes.
- It avoids keeping two different watchlist entry points alive.

Alternative considered:
- Revive `/watchlists` as the primary page.
- Rejected for this phase because the current route is inactive and the product need is management within the active workspace context, not a separate module.

### 3. The dormant grouped watchlist route will be retired rather than revived
The `app/(main)/watchlists` route will not expose grouped watchlist behavior. It may continue to redirect or be reduced to a minimal placeholder, but it must not retain active code or comments that describe unsupported grouped watchlists.

Why:
- The current commented implementation is materially incorrect for the chosen domain.
- Leaving it in place increases onboarding cost and raises the chance of future regressions.

Alternative considered:
- Keep the grouped route code commented for future reuse.
- Rejected because the intended future shape is unknown and the existing code is misleading.

### 4. Frontend types will be renamed or aliased toward item-level responses
Watchlist response types in `app/lib/watchlists/definitions.ts` will be expressed as item-level types, such as `WorkspaceWatchlistItemResponse` or `WatchlistAssetResponse`, instead of names that imply list/group nesting.

Why:
- Current names are close to the backend payload but still leave room for misreading when combined with grouped UI remnants.
- Clear names reduce implementation mistakes in future feature work.

Alternative considered:
- Keep all existing type names untouched.
- Rejected because the current ambiguity is part of the problem this change is addressing.

### 5. Save behavior will use diff-based synchronization and recover to server state on partial failure
The editor will compute additions and removals from the initial selection, call existing add/delete actions per asset, and treat any failed operation as a sync failure. On failure, the editor will keep the dialog open, show an error toast, and reload server state before allowing further edits.

Why:
- This preserves current API usage and ensures the UI returns to a reliable source of truth.
- Keeping the dialog open lets users understand that the save did not complete as expected.

Alternative considered:
- Close the dialog after partial failure and rely on a background refresh.
- Rejected because it hides the failed save and makes the user repeat discovery work.

### 6. Permission behavior will remain action-based in this phase
The editor will continue to require the existing watchlist read/create/delete permissions needed by the current API interactions.

Why:
- No backend or auth model changes are planned in this phase.
- Introducing a new permission abstraction would expand scope without improving backend alignment.

Alternative considered:
- Introduce a frontend-only "manage watchlist" permission gate.
- Rejected because it would add indirection without changing the underlying authorization rules.

## Risks / Trade-offs

- [Route removal may hide a future entry point] -> Keep the redirect or a minimal placeholder route, but remove misleading grouped logic and comments.
- [Type renames may touch more call sites than expected] -> Prefer a narrow rename or alias strategy scoped to watchlist modules first, then update imports deliberately.
- [Diff-based save can leave the server partially updated before recovery] -> Reload from the server immediately after any failure and present a single sync error state.
- [Users may still expect a standalone watchlist page] -> Keep workspace-level language consistent across the product so the editor is clearly the primary management surface.

## Migration Plan

1. Update watchlist domain language and types to reflect a workspace-scoped asset list.
2. Clean up dormant grouped watchlist route code so no active or commented implementation suggests unsupported behavior.
3. Finish the workspace watchlist editor UX around loading, empty, success, and partial failure handling.
4. Verify the feature through targeted UI and action tests before implementation is considered complete.

## Open Questions

No open questions are intentionally left for this phase. The change assumes the backend contract remains unchanged and scoped to the active workspace.
