## 1. Domain alignment

- [x] 1.1 Update watchlist frontend types and naming to reflect item-level workspace watchlist responses rather than grouped watchlists
- [x] 1.2 Align watchlist action helpers and local terminology with the active-workspace backend contract without changing API payloads
- [x] 1.3 Replace misleading user-facing watchlist copy with consistent professional Vietnamese that describes a workspace tracked-asset list

## 2. Surface cleanup

- [x] 2.1 Retire grouped watchlist route code in `app/(main)/watchlists` so no active or commented implementation suggests named watchlist groups
- [x] 2.2 Keep only supported watchlist entry points and ensure unsupported grouped watchlist creation or management is not exposed in the UI

## 3. Workspace editor completion

- [x] 3.1 Finalize the workspace watchlist editor loading, empty, and no-active-workspace states around the workspace-scoped model
- [x] 3.2 Implement or refine diff-based save behavior so added and removed assets are synchronized through existing add and delete actions
- [x] 3.3 Keep the editor open on partial save failure, reload state from the backend, and show clear toast feedback for retry
- [x] 3.4 Ensure pending save feedback disables duplicate submission and matches the repo UX rules

## 4. Verification

- [x] 4.1 Verify watchlist management works for load, add, remove, no-change save, and partial-failure recovery scenarios
- [x] 4.2 Verify no remaining watchlist surface or code path implies multi-group watchlist behavior unsupported by the backend
