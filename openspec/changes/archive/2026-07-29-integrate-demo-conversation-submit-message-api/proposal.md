## Why

Persisted conversations in the standalone demo can now be opened and read, but their composer remains disabled. Authorized users need to submit a follow-up message from the selected transcript using the existing market-conversation API without broadening New chat into persisted conversation creation.

## What Changes

- Replace the read-only persisted-conversation composer with a localized free-form message input.
- Submit non-empty follow-up messages through the existing market-conversation submit action.
- Append the returned user and assistant messages to the loaded transcript while preserving ordering, pagination, scrolling, and tracking behavior.
- Add pending, duplicate-submit prevention, localized failure feedback, and retry-friendly draft retention.
- Keep New chat and users without market-query permission on the existing scripted fixture flow.
- Do not create conversations, stream response tokens, change backend contracts, or modify shared conversation components.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `demo-conversation-history-api`: Change selected persisted transcripts from read-only viewing to permission-scoped follow-up message submission.

## Impact

- Updates the route-local demo conversation client, localized English and Vietnamese labels, and deterministic history-state assertions.
- Reuses `submitMarketConversationMessage`, existing request/response schemas, message mapping helpers, and `query:execute` permission behavior.
- Does not change public APIs, DTOs, API mapping documentation, shared UI primitives, global assistant runtime, routes, or dependencies.
