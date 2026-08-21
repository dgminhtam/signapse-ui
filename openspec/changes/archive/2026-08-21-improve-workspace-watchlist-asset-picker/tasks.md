## 1. Data and query state

- [x] 1.1 Confirm and use the existing paginated asset-list contract with the name-or-symbol `$filter` syntax; no additional ranking contract is required.
- [x] 1.2 Load every page of the active workspace watchlist into an initial tracked-asset snapshot before enabling editor changes.
- [x] 1.3 Add debounced, stale-safe, paginated asset discovery state with ID deduplication, explicit load-more availability, and selection independent from discovery pages.

## 2. Compact tracked-asset editing

- [x] 2.1 Replace the fragmented watchlist selector with the existing Base UI multi-select combobox composition, including symbol chips and information-rich asset result rows.
- [x] 2.2 Add bounded chip scrolling, dialog-body responsive scrolling, one concise field description, and one selected-count presentation without changing shared primitive chrome.
- [x] 2.3 Implement accessible search labeling, loading/empty/error/retry feedback, initial input focus, continuous multi-selection, and Escape behavior within the dialog overlay.
- [x] 2.4 Add dirty-set comparison and a controlled discard confirmation for Close, Cancel, Escape, and backdrop dismissal while preserving clean-close and save-pending behavior.

## 3. Save recovery

- [x] 3.1 Reconcile successful bulk-add batches and asset-level removals into the editor baseline while retaining unsynchronized draft changes after a partial failure.
- [x] 3.2 Surface actionable save failure feedback and retry only outstanding failed bulk batches or remove operations without repeating successful work.

## 4. Localization and behavioral tests

- [x] 4.1 Add localized copy for the compact selector, pagination, accessible feedback, and discard confirmation in supported dictionaries.
- [x] 4.2 Add dialog-level component tests for complete initial pagination, search/load-more, selection persistence, dirty dismissal, keyboard behavior, accessibility feedback, and partial-save retry using the established Testing Library seam.

## 5. Verification

- [x] 5.1 Run `openspec validate improve-workspace-watchlist-asset-picker --strict`.
- [ ] 5.2 Run the targeted component test, `pnpm lint`, and `pnpm typecheck`.

User-owned manual QA: verify nested combobox-popup pointer/focus behavior, dark mode, a narrow mobile viewport, and 200% zoom after the implementation is available.
