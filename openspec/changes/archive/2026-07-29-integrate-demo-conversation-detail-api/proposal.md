## Why

The standalone conversation demo can list persisted conversations, but those rows are intentionally non-interactive and cannot restore their messages. Users need to open a saved conversation from History and review its transcript without enabling message submission or modifying persisted data.

## What Changes

- Make persisted History rows selectable by pointer and keyboard.
- Load the selected conversation's paginated text messages through the existing market-conversation messages API.
- Replace the content area with localized loading, empty, failure, retry, and loaded transcript states while guarding against stale selection responses.
- Show the selected conversation title and support loading older messages through the existing cursor.
- Keep persisted conversations read-only and preserve New chat as the way back to the scripted demo.
- Do not create conversations, submit messages, or add analysis/evidence rendering.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `demo-conversation-history-api`: Change persisted History rows from informational summaries into selectable entries that load and display a read-only persisted transcript.

## Impact

- Updates the standalone demo UI and its local deterministic state helpers/assertions.
- Adds matching English and Vietnamese request-state labels.
- Reuses `getMarketConversationMessages`, existing market-conversation DTOs, permission checks, and cursor contract without changing backend APIs or adding dependencies.
- Does not change the global assistant runtime, URL routing, API mapping, or persisted data.
