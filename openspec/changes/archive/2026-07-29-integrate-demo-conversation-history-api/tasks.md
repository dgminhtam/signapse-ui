## 1. Define route-local history state

- [x] 1.1 Add the smallest route-local helper needed to build page-zero and next-page conversation history requests, normalize the title filter, and replace or deduplicate appended summaries.
- [x] 1.2 Add one runnable assertion covering unfiltered/query request construction, page replacement, ordered deduplicated append, and query reset.

## 2. Connect the History Popover

- [x] 2.1 Replace generated fixture history with on-demand `getMarketConversations()` calls using size 10, `lastModifiedDate` descending, current-workspace backend scoping, and a latest-request guard.
- [x] 2.2 Debounce trimmed title search by 300 ms, reload page zero per normalized query, and request the next page only near the list end when no request is active and `hasMore` is true.
- [x] 2.3 Add localized loading, empty, failure, and Retry states while preserving the existing accessible search control.
- [x] 2.4 Use the existing `query:execute` permission check so unauthorized users retain the scripted demo with a static title and no history request.
- [x] 2.5 Render persisted summaries as informational, non-focusable rows without changing the demo title, transcript, composer, or New chat state and without calling detail or messages APIs.

## 3. Remove fixture history and verify

- [x] 3.1 Remove the generated history snapshots, local-only history filtering/batch constants, and fixture selection path while retaining the scripted chat fixture used by the transcript.
- [x] 3.2 Run the route-local assertion, targeted lint for the demo and dictionaries, and `pnpm.cmd typecheck`; resolve change-related failures.
- [x] 3.3 Statically verify the demo does not call conversation detail, messages, create, or submit APIs, then run strict OpenSpec validation for `integrate-demo-conversation-history-api`.
