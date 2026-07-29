## Why

The standalone demo conversation now provides the more complete persisted market-conversation experience, while the protected application still mounts the older Assistant UI runtime globally. Promoting the proven demo surface to the protected shell removes the duplicate user experience and makes its history, transcript, retry, tracking, and submission behavior available from every authorized protected page.

## What Changes

- Promote the standalone demo conversation implementation into a production global market-conversation assistant.
- Replace the active `AssistantRuntime` entry point behind `ProtectedAiAssistant` while preserving the existing `query:execute` permission gate, dynamic loading boundary, and active-workspace scope.
- Add a floating trigger and accessible local overlay whose close, Escape, and dismiss behavior preserve the current route and in-memory conversation session.
- Pass the authenticated display name and active workspace from the protected layout, and remount conversation state when the workspace changes.
- Retire the standalone `/demo-conversation` route and its breadcrumb identity to prevent duplicate assistant instances.
- Remove the old fullscreen requirement because the promoted conversation design does not expose fullscreen mode.
- Keep the previous assistant runtime, controller, modal, dictionary namespace, and dependencies in place but inactive; their removal is deferred to a follow-up cleanup change.
- Preserve the synchronous backend contract and progressive visual reveal without claiming backend token streaming.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `demo-conversation`: Promote the route-local demo presentation into the protected global assistant and replace navigation-based Close behavior with local overlay dismissal.
- `demo-conversation-history-api`: Apply the completed persisted conversation lifecycle to the active global assistant instead of a standalone demo route.
- `global-ai-assistant-modal`: Replace the Assistant UI-specific surface with the promoted conversation surface, preserve local modal interaction, and remove fullscreen behavior.
- `ai-assistant-market-conversations`: Make the promoted conversation UI the active global session while retaining workspace, persistence, history, pagination, submission, and accessibility contracts without fullscreen.

## Impact

- Affected entry points: protected main layout and `ProtectedAiAssistant`.
- Affected UI: demo conversation component, its helper and styles, floating trigger, overlay close/focus behavior, localization copy, and demo breadcrumb.
- Affected specifications: the four modified capabilities listed above.
- Backend actions, DTOs, permissions, message contracts, and shared message-scroller primitives are unchanged.
- The old assistant implementation becomes unreachable but remains compilable until the subsequent cleanup change.
