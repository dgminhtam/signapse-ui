## Context

The active-workspace watchlist editor is a controlled dialog that loads tracked assets, lets an operator form a selection, and synchronizes the difference through bulk add and asset-level remove operations. Its current selector separates the trigger, text search, result menu, selected chips, and selection count. It loads a fixed first page for both the existing watchlist and the asset catalog, and a partial save failure discards the editor draft by reloading server state.

The change must preserve the workspace-scoped **Tài sản theo dõi** domain, the existing Base UI/Nova component contract, localization, permission states, and explicit Save workflow. It must also work within a modal overlay without breaking focus containment or dismissal behavior.

## Goals / Non-Goals

**Goals:**

- Provide one compact, accessible multi-select control for discovering and editing tracked assets.
- Make the editor complete for large watchlists and large asset-query result sets.
- Preserve an operator's intended draft across query changes and partial synchronization failures.
- Make dialog dismissal, keyboard behavior, feedback, and responsive scrolling deterministic.
- Keep synchronization compatible with the current bulk-add and asset-level remove APIs.

**Non-Goals:**

- Create a generic asset-picker abstraction or alter shared Base UI/Nova wrapper chrome.
- Auto-save individual selection changes, add select-all/clear-all, or introduce watchlist reordering.
- Redesign unrelated workspace, Telegram, or backend watchlist workflows.
- Require per-asset bulk-add outcome details beyond the current batch-level contract.

## Decisions

### Keep a watchlist-local selector composition

The asset picker remains a watchlist-editor concern because there is one current consumer and its draft, permissions, save semantics, and large-selection behavior are domain-specific. The implementation composes the existing Base UI combobox primitives at the feature boundary instead of adding feature variants or portal behavior to shared wrappers.

Alternative considered: create a shared generic asset picker. This would add a premature API for loading, retry, persistence, and selection policies that no second consumer currently shares.

### Separate initial truth, editable draft, and discovery pages

The editor maintains an initial tracked-asset snapshot and an editable selected-asset draft keyed by asset ID. Dirty status is set equality between those two ID sets, so adding and then removing the same asset returns the dialog to a clean state. Asset search pages are a third, independent source: replacing or appending discovery results MUST NOT remove selected chips that are absent from the current query.

Initial watchlist loading follows every available backend page before the editor becomes interactive. The loading state communicates progress without exposing a partial selection as the complete watchlist.

Alternative considered: treat the current visible result page as the source of selection. This would lose selected assets whenever the search query or page changes.

### Use server-side paginated asset discovery with an explicit load-more action

Opening the combobox fetches the first 20 catalog results. Typing performs a debounced server search over name and symbol, resets accumulated results and page state, and ignores stale responses. The next page is appended with ID deduplication only when the page contract reports more results. The UI exposes an explicit load-more control rather than silent truncation or infinite scrolling.

The asset query uses the existing backend name-or-symbol filter syntax and consumes the returned page order as provided. No client-side relevance ranking is required; pagination and selection state remain independent so loading another page can expose additional matches without losing the draft.

Alternative considered: retain a fixed 20-result list. This fails the requirement that operators can discover every matching asset.

### Use chips as the single visible selection surface

The multi-select combobox displays selected symbols as removable chips and uses its input as the search affordance. Result rows retain full name, symbol, type, and selected state. A concise field description and one selected-count message replace the separate helper card, trigger count, divider, and standalone chip area.

The chip container has a bounded height and internal scrolling so large selections do not push the dialog footer outside the viewport. The dialog body retains the only outer scrolling surface required for narrow viewports and 200% zoom.

Alternative considered: show all chips without a bound. This makes a large existing watchlist hide the save and cancel controls.

### Treat dismissal as a draft decision

After initial loading, focus moves to the search input. Selecting an option leaves the popup open and preserves the current query. Escape closes the popup before the dialog.

When the draft is dirty, Close, Cancel, Escape, and backdrop dismissal open a controlled discard confirmation with Continue Editing and Discard Changes. Clean drafts close normally. Save pending blocks dismissal and duplicate submission.

Alternative considered: retain direct close behavior. This silently loses an operator's multi-asset edit.

### Reconcile save outcomes without discarding the draft

Save derives add and remove operations from the draft and initial snapshot. New assets continue to use bulk-add requests of at most 100 IDs; removes continue to use the existing asset-level operation. Successful operations update the initial snapshot. Failed removes remain selected in the initial snapshot; every asset in a failed add batch remains only in the draft. The editor stays open, provides actionable error feedback, and retries only the outstanding work.

The bulk-add response is treated at batch granularity because the current UI contract does not provide a reliable per-asset failure result. Existing asset IDs returned by a successful bulk request remain synchronized success.

Alternative considered: reload server truth after any failure. This eliminates valid user intent and conflicts with form recovery policy.

### Keep accessibility and localization in the feature contract

All new labels, descriptions, load-more, loading, error, retry, dirty-discard, and selected-count copy comes from dictionaries. The search input has an associated visible or programmatic label. Loading, empty, and error states are perceivable and announced with suitable semantic status. Focus styles and Base UI keyboard semantics remain intact.

## Risks / Trade-offs

- [Large initial watchlists delay dialog readiness] → Load pages deterministically with visible pending feedback and preserve the dialog's stable layout until the full snapshot is ready.
- [Combobox popup portal is nested in a dialog] → Cover pointer, Escape, and focus behavior at the dialog seam; use feature-level overlay composition if verification finds a containment defect.
- [Bulk add has only batch-level failure feedback] → Retain failed-batch IDs in the draft and retry the batch rather than claiming per-asset recovery certainty.
- [Page metadata is transport-typed rather than runtime-validated] → Treat malformed metadata as a recoverable load error with retry; do not infer terminal pagination from item count.

## Migration Plan

No persisted-data migration is required. The rollout replaces the editor's local selection surface while preserving existing watchlist APIs and active-workspace permission gates. A rollback restores the previous editor composition without changing backend watchlist records.

## Open Questions

None for the frontend interaction design. The picker uses the existing paginated name-or-symbol filter contract without additional relevance ordering.
