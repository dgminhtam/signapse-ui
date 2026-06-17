## Why

Signapse currently requires users to leave their active workspace and navigate to `/market-conversations` whenever they want AI-assisted market analysis. A permission-aware floating assistant should make the existing conversation capability available from protected app screens while preserving the backend-persisted market conversation workflow as the source of truth.

## What Changes

- Add a global AI assistant entry point to the protected app shell using the Assistant UI `AssistantModal` pattern, anchored at the lower-right edge of the viewport.
- Gate the assistant with the existing `query:execute` permission and keep it out of unauthenticated or unauthorized surfaces.
- Add a localized placeholder conversation experience with accessible open/close controls, empty state, composer shell, loading state, and failure state.
- Introduce a route-independent runtime boundary that can map Assistant UI messages and thread actions to the existing authenticated market conversation server actions.
- Reuse persisted market conversation contracts for conversation creation, message submission, and conversation loading instead of introducing a separate browser-only chat data model.
- Keep `/market-conversations` and `/market-conversations/{id}` as the canonical full conversation routes and provide a path from the modal to the full experience.
- Exclude Assistant Cloud, token streaming, attachments, message editing, regeneration, branching, conversation rename/delete/archive, and replacement of the canonical market conversation pages.

## Capabilities

### New Capabilities

- `global-ai-assistant-modal`: Covers the protected floating Assistant UI entry point, permission gating, localization, placeholder states, runtime boundary, and compatibility with persisted market conversations.

### Modified Capabilities

None.

## Impact

- Protected app shell: mount a client-owned assistant surface inside `app/[lang]/(main)/layout.tsx` without converting the server layout to a Client Component.
- UI and dependencies: add the Assistant UI React runtime and selected registry source under `components/assistant-ui/`, reviewed and reduced to Signapse-supported controls and shadcn wrapper conventions.
- Authentication and permissions: reuse the existing Clerk-authenticated server action boundary and `query:execute` permission.
- Data layer: reuse `app/api/market-conversations/action.ts` and `app/lib/market-query/definitions.ts`; no new backend endpoint is required for the placeholder phase.
- Localization: add synchronized English and Vietnamese dictionary copy for the assistant trigger, placeholder, composer, status, error, and full-conversation action.
- Existing product flow: `/market-conversations` remains the canonical persisted history/detail experience and is not replaced by modal-local routing.
