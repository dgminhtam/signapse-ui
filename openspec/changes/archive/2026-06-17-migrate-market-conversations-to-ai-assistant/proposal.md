## Why

The protected AI assistant is currently a placeholder while the complete market conversation workflow was previously split across dedicated routes. Connecting the modal to the existing backend will make conversational market analysis available from any protected workspace and let the modal become the only market conversation UI surface.

## What Changes

- Replace the placeholder assistant runtime with a backend-backed Assistant UI external-store runtime for persisted market conversations.
- Let users start a new conversation, submit follow-up messages, browse recent conversation history, and switch threads inside the assistant modal.
- Load the latest messages first and support loading older messages through the paginated market conversation message contract.
- Reset assistant conversation state when the active workspace changes so threads are never shown under the wrong workspace context.
- Remove `/market-conversations`, `/market-conversations/{id}`, and `/market-query` UI routes and their legacy redirect behavior.
- Remove modal actions that navigate to removed market conversation routes.
- Preserve the existing permission gate and expose only actions supported by the current synchronous backend contract.

## Capabilities

### New Capabilities

- `ai-assistant-market-conversations`: Covers persisted market conversation creation, history selection, message loading and submission, workspace isolation, compact rendering, and removal of stale route navigation.

### Modified Capabilities

None.

## Impact

- Protected app shell and assistant components under `components/assistant-ui/` and `components/protected-ai-assistant.tsx`.
- Market conversation actions, DTO mapping, message pagination, and shared conversation UI/controller code.
- Protected layout workspace context passed into the assistant boundary.
- English and Vietnamese dictionaries for runtime, history, loading, empty, and failure states.
- Existing authenticated backend endpoints for conversation list/create/detail/message submission, plus `GET /market-conversations/{conversationId}/messages` with the exclusive `beforeMessageId` cursor and bounded `size`.
- No backend breaking change, streaming claim, Assistant Cloud configuration, or migration of evidence and Telegram controls into the modal.
