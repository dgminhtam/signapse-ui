## Why

Workspace watchlist management currently splits search, selection, and selected-asset visibility across several controls. The editor also silently discards unsaved work, stops loading existing watchlist assets after a fixed page, and cannot expose every matching asset to an operator.

## What Changes

- Replace the fragmented tracked-asset selector with an accessible, compact multi-select combobox that combines search, selected chips, and removal.
- Load the complete active-workspace watchlist before editing and preserve selected assets while search results and result pages change.
- Add paginated asset discovery with initial results, debounced name-or-symbol search, and an explicit load-more path.
- Protect a changed draft from every dialog dismissal path and keep successful and failed save operations distinguishable so failed work can be retried without discarding the user's intent.
- Reduce duplicate helper/count chrome, add localized feedback and accessible loading, error, and keyboard behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workspace-watchlist-management`: Define compact asset selection, complete watchlist loading, paginated asset discovery, dirty-draft protection, and draft-preserving partial-save recovery for the active workspace watchlist editor.

## Impact

- Affects the workspace tracked-asset editor, its asset query flow, localized copy, and component-level behavioral tests.
- Continues to use the existing bulk-add and asset-level remove watchlist APIs; bulk-add retries remain batch-scoped.
- Uses the existing paginated asset-list contract with the current name-or-symbol filter syntax.
- Does not add a dependency or change shared Base UI/Nova wrapper chrome.
