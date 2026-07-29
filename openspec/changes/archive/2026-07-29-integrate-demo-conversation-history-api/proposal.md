## Why

The completed conversation demo still shows generated fixture history, so it cannot validate the persisted conversation-list experience against the backend contract. The next increment should connect only that history list while keeping transcript detail, message loading, creation, and submission isolated for later changes.

## What Changes

- Replace the demo's generated history snapshots with paginated summaries from the existing market-conversation history API.
- Load history on demand, sort by latest modification, search titles with a 300 ms debounce, and fetch additional pages as the history list approaches its end.
- Add localized loading, empty, failure, and retry behavior while preventing stale requests from replacing newer search results.
- Preserve the standalone scripted transcript, composer, New chat behavior, and direct route access.
- Keep persisted history entries informational in this change; selecting a saved conversation and loading its transcript remain out of scope.
- Offer backend history only to users with `query:execute`; users without it retain the scripted demo without a nonfunctional history control.

## Capabilities

### New Capabilities

- `demo-conversation-history-api`: Backend-backed, searchable, paginated conversation summaries in the standalone demo without persisted transcript selection.

### Modified Capabilities

None.

## Impact

- Updates the route-local demo component under `app/[lang]/(main)/demo-conversation`.
- Updates the English and Vietnamese demo dictionaries for history request states.
- Reuses the existing `getMarketConversations` server action, conversation summary DTO/schema, filter builder, permission constant, and installed debounce dependency.
- Does not add or change backend endpoints, shared UI primitives, global assistant behavior, dependencies, persisted message loading, conversation creation, or message submission.
