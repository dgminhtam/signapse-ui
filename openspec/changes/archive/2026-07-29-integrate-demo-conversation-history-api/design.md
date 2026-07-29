## Context

`DemoConversation` currently builds 25 history snapshots from the same scripted `createChat()` fixture used by its transcript. Search and incremental reveal operate only on that in-memory array, and selecting an item replaces the transcript with fixture messages.

The repository already owns the required backend boundary: `getMarketConversations()` calls authenticated `GET /market-conversations`, validates `Page<MarketConversationSummaryResponse>`, and is used by the global assistant. The endpoint is scoped to the active workspace and requires `query:execute`. The existing global assistant controller cannot be reused directly because it also owns conversation creation, message submission, persisted message loading, and transcript selection, all of which are excluded here.

## Goals / Non-Goals

**Goals:**

- Replace only the demo history fixture with authenticated conversation summaries.
- Preserve the existing History Popover, localized title search, and near-end incremental loading.
- Keep results current for the active workspace by refreshing page zero whenever the Popover opens.
- Handle request races, loading, empty, error, retry, permission, and pagination states without changing shared chat infrastructure.
- Leave one small runnable assertion for the non-trivial history state transitions.

**Non-Goals:**

- Load conversation detail or persisted messages.
- Select a persisted conversation or replace the scripted transcript.
- Create conversations, submit messages, or connect the composer to a backend or model.
- Refactor the global assistant controller or introduce a shared history abstraction.
- Add endpoints, dependencies, shared UI wrappers, URL state, or persistence.

## Decisions

### Reuse the existing summary action and contract

Call `getMarketConversations()` with page index `0`, size `10`, and `lastModifiedDate desc`. Build a non-empty title filter with the existing `buildFilterQuery()` and `title[containsIgnoreCase]`.

This keeps authentication, active-workspace scoping, response validation, API base URL handling, and localized transport errors in the existing server action.

Alternative considered: add a demo-specific route handler or server action. Rejected because it duplicates an established protected read boundary.

### Keep history request state route-local

Store summaries, current page, `hasMore`, loading, error, debounced query, and a monotonic request identifier inside the demo feature. A new request replaces page zero; a next-page request appends unique IDs. A response applies only when its request identifier is still current.

Keep the small pure request/merge transitions in a route-local helper so one assertion script can cover page replacement, deduplicated append, and query reset without mounting React.

Alternative considered: generalize `useMarketConversationAssistant`. Rejected because adding options to a controller that also owns detail and submission increases blast radius for one route.

### Load on Popover open and search on the backend

Opening History clears the local query and requests the latest first page, even when earlier data exists. Query changes are trimmed and debounced by 300 ms, then request a replacement first page. Near-end scroll requests the next backend page only when `hasMore` is true and no request is active.

This preserves the current interaction while avoiding eager requests for users who never inspect history. Refetching on open also avoids retaining another workspace's list after the workspace switcher's `router.refresh()`.

Alternative considered: filter only fetched rows in the browser. Rejected because it presents an incomplete search when more backend pages exist.

### Keep persisted rows informational

Render returned titles in the existing history list without a selection callback or focusable command action. The demo header title, scripted messages, selected fixture state, and New chat behavior do not derive from a persisted summary.

Alternative considered: update only the header title on selection. Rejected because it would imply that the unchanged fixture transcript belongs to the selected persisted conversation.

### Preserve demo access without the backend permission

Use the existing client permission provider and market-query permission constant. When `query:execute` is unavailable, render the current title as static text instead of a History trigger and make no history request. The scripted demo remains available as required by its original boundary.

Alternative considered: gate the whole route. Rejected because persisted history is the only behavior requiring the permission in this change.

## Risks / Trade-offs

- [The OpenAPI `SpecificationConversation` schema does not enumerate filter fields] → Verify that `containsIgnoreCase(title, ...)` is accepted before completing search integration; do not silently substitute loaded-page-only filtering.
- [Changing search while a request is in flight can apply stale rows] → Use a monotonic request identifier and apply only the latest response.
- [Offset pages can overlap if conversations are modified between requests] → Deduplicate appended summaries by ID while preserving backend order.
- [Informational rows are less useful than selectable history] → Keep the boundary explicit; persisted detail selection belongs to the next change.
- [Refreshing every Popover open adds a request] → Prefer correctness across workspace switches; the request is deferred until the user opens History.

## Migration Plan

1. Add the route-local history state helper and assertion.
2. Replace generated history state with the existing authenticated summary action.
3. Add localized request-state labels and permission-aware trigger rendering.
4. Verify the backend title filter, assertion, targeted lint, typecheck, static scope searches, and strict OpenSpec validation.

Rollback restores the route-local fixture history and removes the added labels/helper. No backend or data migration is required.

## Open Questions

- The snapshot documents generic conversation specifications but does not expose their fields. Implementation must confirm backend support for case-insensitive title filtering before marking the search requirement complete.
