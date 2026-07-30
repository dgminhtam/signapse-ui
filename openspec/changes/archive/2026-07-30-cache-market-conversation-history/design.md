## Context

`MarketConversationAssistant` already keeps History summaries, query, pagination, loading, and error state above the History Popover. However, `setHistoryPopoverOpen()` invalidates the active request identity and calls `loadHistoryPage(0, "")` on every open, so the retained state is discarded as a cache.

The assistant component is keyed by active workspace identity. Conversation creation and successful submission already reconcile the affected summary into the local History list.

## Goals / Non-Goals

**Goals:**

- Issue one initial History request per normalized query during the current workspace-scoped component lifetime.
- Reuse successful summary, empty, and pagination state across Popover close and reopen.
- Prevent duplicate requests when History is reopened while its previous request is still active.
- Preserve explicit error retry and stale-response protection.

**Non-Goals:**

- Add React Query, SWR, a global cache, persistent browser storage, TTL refresh, or a manual refresh control.
- Cache multiple search queries simultaneously.
- Change API parameters, backend ordering, page size, DTOs, permissions, or History rendering.
- Synchronize History changes made in another browser tab or session.

## Decisions

### Track the successfully loaded normalized query

Add a route-local ref whose value is the normalized query for the current successful page-zero result. `null` means the current result set has not loaded successfully. A ref avoids a render-only state value while correctly distinguishing a successful empty result from an uninitialized list.

Page-zero success records `query.trim()`. A new search invalidates the marker before its debounced request. Pagination pages do not change the marker.

Using `historyConversations.length` as the cache signal was rejected because an empty backend result would request again on every reopen.

### Treat close as visibility, not invalidation

Closing History only updates Popover visibility. It preserves the query, summaries, pagination, error, and request identity. An already active request may finish while the Popover is closed and populate the cache for the next open.

Reopening calls page zero only when the current normalized query is not successfully cached, no request is active, and no retryable error is already displayed. This keeps failures under the existing explicit Retry action rather than creating a reopen request loop.

Cancelling and restarting requests on every close was rejected because it creates the duplicate traffic this change is intended to remove.

### Keep existing invalidation boundaries

A workspace change remounts the assistant and therefore resets the cache. Starting a new conversation continues clearing History state and also invalidates the loaded-query marker. Search changes replace the single cached result set.

Successful create and submit operations continue reconciling their conversation summary locally. No refresh request is needed solely because a message was submitted.

### Keep the cache component-local and unbounded by time

The cache lasts only for the mounted workspace-scoped assistant component. This is sufficient for repeated Popover toggles and requires no new dependency or timer. Cross-tab freshness and time-based revalidation are intentionally deferred until there is a demonstrated requirement.

## Risks / Trade-offs

- [History changed in another tab remains stale] → Scope the cache to the current component lifetime; add explicit refresh or stale-time revalidation only if cross-session freshness becomes required.
- [A successful empty result is mistaken for no cache] → Use the loaded normalized-query ref rather than list length.
- [Closing during a request causes a duplicate reopen request] → Preserve request identity and check the existing in-flight ref before loading.
- [A failed request retries repeatedly on reopen] → Leave the cache marker unset but retain the error until the user activates Retry.
- [A workspace or new-draft transition exposes old results] → Keep the existing workspace remount and new-conversation reset, and clear the cache marker with those resets.

## Migration Plan

1. Add the loaded normalized-query marker to the existing History state.
2. Mark successful page-zero responses and invalidate the marker on a new query or new-conversation reset.
3. Change Popover open/close handling to reuse cached or in-flight state.
4. Extend deterministic checks and run targeted lint, typecheck, and strict OpenSpec validation.

Rollback removes the marker and restores unconditional page-zero loading on open; no persisted data migration is involved.

## Open Questions

None. TTL and cross-tab synchronization remain explicitly out of scope.
