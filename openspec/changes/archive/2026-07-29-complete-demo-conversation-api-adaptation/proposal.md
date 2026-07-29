## Why

The demo conversation currently mixes a scripted fixture with persisted backend conversations, leaving New chat, workspace changes, failed messages, composer behavior, and retry handling inconsistent with the working market-conversation flow. Completing the backend adaptation removes the duplicate mode and makes the demo a reliable full conversation surface within the backend's supported feature set.

## What Changes

- Require `query:execute` for the demo route and scope all conversation behavior to the active workspace.
- Show an explicit no-active-workspace state and reset the demo when the active workspace changes.
- Replace the scripted New chat flow with persisted conversation creation on the first submitted message.
- Preserve the created conversation and draft when its first message submission fails so retry does not create a duplicate conversation.
- Keep backend message status, failure reason, and creation date through rendering, including empty-content failed assistant messages.
- Align the composer with Enter-to-send, Shift+Enter newline, IME-safe submission, and operation-specific loading states.
- Separate initial transcript, older-message, create, and submit failures so each retry preserves the correct state and cursor.
- Remove the scripted fixture, unsupported attachment/research/image/web actions, and direct AI SDK fixture dependencies when no consumers remain.
- Show a localized Thinking marker while create or submit is pending, then progressively reveal the completed assistant response after the synchronous API returns.
- Preserve the demo-specific MessageScroller, tracking rail, Hover Card previews, history search, role spacing, and jump-to-latest behavior.
- Continue to exclude backend token streaming, attachments, edit, regenerate, branching, rename, delete, and archive.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `demo-conversation`: Replace the scripted fallback with a permission-gated, workspace-aware persisted conversation surface and update composer and accessibility behavior.
- `demo-conversation-history-api`: Add create-on-first-message, workspace lifecycle, failed-message rendering, and operation-specific error and retry requirements.

## Impact

- Updates the demo route page, client component, route-local styles and state helpers, deterministic checks, and localized dictionaries.
- Reuses the existing market-conversation actions and pure title/message reconciliation helpers without importing the global assistant controller.
- Removes obsolete fixture code and, after static consumer checks, direct dependencies on `@ai-sdk/react`, `@shadcn/helpers`, and `ai` plus their lockfile entries.
- Does not change backend endpoints, DTO contracts, shared UI primitives, the global assistant hook, or other conversation surfaces.
