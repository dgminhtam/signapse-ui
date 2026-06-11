## Context

The protected app shell now mounts an Assistant UI modal behind the `query:execute` permission, but its composer is disabled and its runtime contains placeholder content. Market conversations already support authenticated list, create, detail, synchronous message submission, analysis detail, evidence, and Telegram delivery through backend actions.

The existing detail client owns message state, optimistic placeholders, analysis caches, evidence, Telegram controls, and rendering in one large component. Reusing that page inside the modal would duplicate route chrome, exceed the modal viewport, and couple compact chat behavior to full-analysis controls. The backend now exposes `GET /market-conversations/{conversationId}/messages` with an exclusive `beforeMessageId` cursor, optional bounded `size`, `hasMore`, and `nextBeforeMessageId`.

## Goals / Non-Goals

**Goals:**

- Make the global assistant a persisted market conversation client backed by existing authenticated actions.
- Support new conversation creation, recent history, thread switching, latest-message loading, older-message pagination, and synchronous follow-up submission.
- Keep the modal compact and usable from every protected workspace.
- Share backend DTO conversion and conversation state behavior through modal-owned helpers where practical.
- Isolate runtime state by active workspace.
- Remove stale full-page market conversation and legacy market query routes now that the modal is the primary surface.

**Non-Goals:**

- Embedding the complete market conversation detail page in the modal.
- Moving evidence, Telegram delivery, or full structured analysis workbench controls into the modal.
- Adding streaming, attachments, edit, regenerate, branch, rename, delete, or archive behavior.
- Configuring Assistant Cloud or storing a second browser-only conversation history.
- Refactoring unrelated market query API compatibility code.

## Decisions

### Use an Assistant UI external-store runtime

Use `useExternalStoreRuntime` with application-owned market conversation messages, loading state, and submission callbacks. Backend DTOs remain the source of truth and are converted into Assistant UI messages at the runtime boundary.

This fits the synchronous existing API and permits explicit thread selection without inventing a second persistence model. A local runtime was rejected because it would make browser state authoritative and complicate reconciliation after backend failures. Assistant Cloud was rejected because the product already owns conversation persistence.

### Add a modal conversation coordinator

Create a focused client hook or controller that owns:

- active workspace identifier;
- selected persisted conversation identifier or a new-thread draft;
- recent conversation summaries and history pagination state;
- loaded chronological messages and older-message cursor;
- submission, loading, and recoverable error state;
- stale-request protection for workspace and thread switches.

The Assistant UI runtime and modal components consume this coordinator. Backend schemas, DTO conversion, and reusable conversation helpers stay outside presentation components.

A single global store was rejected because conversation state only needs to live for the protected shell session and must reset cleanly by workspace.

### Start with an explicit new conversation draft

The first assistant session in a workspace opens on an empty draft rather than silently resuming the most recent thread. Selecting a persisted conversation is explicit through history, and a new-conversation control returns to a fresh draft.

Closing and reopening the modal within the same protected shell preserves the current draft or selected thread. Changing workspace resets the coordinator and starts a new draft after workspace context refresh.

Automatic resume was rejected because recent threads may not match the user's current task and can expose stale context without a deliberate selection.

### Create the persisted thread on first submit

For a draft thread, derive a bounded title from the first non-blank user message, create the market conversation, then submit the message to the returned conversation identifier. The composer remains recoverable if either request fails.

For an existing thread, submit directly through the existing message action. The runtime shows a stable pending state for the synchronous request and replaces pending content with backend-returned messages after success. It does not simulate token streaming.

### Use the paginated message endpoint for thread timelines

Load the latest message page with `size=30` when a persisted thread is selected and fetch older pages with the exclusive `beforeMessageId` cursor. Merge pages chronologically and reconcile by backend message identifier.

The frontend sorts each received page by message `id` ascending before merging so rendering does not depend on undocumented response ordering. When an existing identifier is returned again, the newer payload replaces the stored message so status or content changes are reconciled rather than discarded. `nextBeforeMessageId` is treated as nullable or optional when `hasMore` is false.

Falling back to an unbounded full `messages[]` payload was rejected because it would reproduce the long-thread performance problem inside a smaller viewport.

Conversation summaries continue to use their existing pagination independently from message pagination.

### Keep the modal renderer compact

The modal shows:

- a new-conversation action;
- recent conversation history access;
- compact user and assistant message content;
- loading, empty, and recoverable error states;
- the composer;
- fullscreen control for the assistant surface.

Structured analysis blocks can be represented by concise answer text or a compact summary supported by the existing DTO. Full analysis workbench expansion, evidence, and Telegram controls remain out of scope for the compact modal.

Embedding the route component was rejected because it would create nested workbench UI, duplicate history controls, and make responsive behavior fragile.

### Pass workspace identity through the protected assistant boundary

The protected layout passes `currentWorkspace.id` into `ProtectedAiAssistant`. The coordinator keys requests and state by that identifier. On change, it clears thread summaries, selected conversation, messages, draft input, pagination state, and errors before loading workspace-specific history.

Every async result verifies that its workspace and conversation still match the active coordinator before committing state. This prevents a slower request from a previous workspace or thread from leaking into the new context.

### Remove stale UI routes and preserve permissions

The assistant remains under the existing `query:execute` gate. Existing market conversation actions continue to enforce authentication and backend permissions. Removed UI routes `/market-conversations`, `/market-conversations/{id}`, and `/market-query` do not receive redirect compatibility routes unless a future user request explicitly asks for one.

The sidebar no longer exposes market conversation navigation, and the modal does not render full-conversation actions to removed routes.

## Risks / Trade-offs

- [OpenAPI does not fully express response requiredness or ordering] -> Validate the known fields with a tolerant Zod schema, normalize page order by message id, and use `hasMore` as the authority for whether another cursor request is allowed.
- [Create succeeds but first message submission fails] -> Keep the created conversation selected, preserve the user's text, refresh history, and allow retry without creating another conversation.
- [Workspace or thread changes during a request] -> Tag requests with workspace and conversation identity and ignore stale completions.
- [Assistant UI message shape loses domain detail] -> Keep typed backend DTOs in coordinator state and use a dedicated converter for compact runtime rendering.
- [Stale route links survive the migration] -> Use static search to remove sidebar entries, breadcrumbs, modal actions, and legacy redirects for `/market-conversations` and `/market-query`.
- [Synchronous replies feel slow] -> Show a localized pending state, disable duplicate submission, and avoid claiming streaming behavior.
- [History becomes too dense in the modal] -> Load a bounded recent page first and expose incremental history loading without copying the full list-page toolbar.

## Migration Plan

1. Add frontend DTOs and an authenticated action for the available paginated message endpoint.
2. Extract or add typed market conversation schemas and pure conversion helpers needed by both surfaces.
3. Implement the workspace-scoped conversation coordinator and Assistant UI external-store runtime.
4. Add compact history selection, new-thread behavior, message pagination, and synchronous submission to the modal.
5. Add localized runtime states and remove stale route navigation.
6. Pass active workspace identity from the protected layout and verify stale requests cannot update a new context.
7. Run scoped lint, typecheck, OpenSpec validation, and static checks for unsupported controls and hardcoded copy.

Rollback restores the placeholder runtime and would need an explicit decision to recreate deleted UI routes. Because the backend contracts remain additive and conversation persistence stays backend-owned, rollback does not require data migration.

## Open Questions

- The compact assistant should render the backend's primary answer text. If no stable concise field exists, the DTO mapping needs an agreed fallback before implementation.
- Sidebar removal and automatic deep-linking into the modal remain separate follow-up decisions after usage is evaluated.
