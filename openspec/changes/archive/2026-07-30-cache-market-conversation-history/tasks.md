## 1. Cache History Across Popover Visibility

- [x] 1.1 Track the successfully loaded normalized History query, mark page-zero success, and invalidate the marker when search or new-conversation state replaces the result set.
- [x] 1.2 Change History open and close handling to preserve query, summaries, pagination, errors, and active request identity, loading page zero only when the current query is uncached, idle, and not awaiting explicit retry.
- [x] 1.3 Keep workspace remount and local create or submit reconciliation behavior intact without adding a dependency, TTL, persistent storage, or shared cache.

## 2. Verification

- [x] 2.1 Extend the deterministic assistant check for first open, cached non-empty and empty results, in-flight reopen suppression, query invalidation, and explicit retry after failure.
- [x] 2.2 Run the deterministic assistant check and targeted lint for the changed component and check files.
- [x] 2.3 Run the repository typecheck and `openspec validate cache-market-conversation-history --strict`.

User-owned manual QA: confirm repeated History close and reopen avoids loading flashes and duplicate network requests while search, pagination, Retry, New chat, submit reconciliation, and workspace switching remain usable.
