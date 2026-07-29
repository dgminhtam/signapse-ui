## Context

The demo conversation currently owns a custom history search, transcript renderer, MessageScroller, tracking rail, and Hover Card previews, but still initializes an AI SDK fixture for New chat and for users without `query:execute`. Persisted detail and follow-up submission were added later, so the component now carries two message models and overlapping loading/error paths.

The global assistant already demonstrates the supported backend flow: resolve the active workspace, derive a title, create a conversation, submit its first message, and retain the created conversation when submission fails. Its modal controller and renderer do not fit the demo's searchable History and tracking UI, so this change reuses only existing server actions and pure helpers.

Backend conversation endpoints are already scoped to the authenticated active workspace and do not accept `workspaceId` as a request argument. The workspace ID passed to the demo is therefore a UI lifecycle identity and request-staleness boundary.

## Goals / Non-Goals

**Goals:**

- Make the demo a permission-gated, backend-only persisted conversation surface.
- Create the conversation on first submission without duplicating it during retry.
- Reset all client state safely when the active workspace changes.
- Preserve backend message metadata and render failed assistant messages.
- Align keyboard, loading, error announcement, and operation-specific retry behavior.
- Show an in-transcript pending marker and progressively reveal a newly returned assistant response without changing the synchronous backend contract.
- Remove fixture-only code, controls, labels, checks, and direct dependencies.
- Preserve the demo-specific History search, MessageScroller, tracking rail, Hover Card, role spacing, and scroll behavior.

**Non-Goals:**

- Reuse or modify the complete `useMarketConversationAssistant` controller.
- Change backend endpoints, DTOs, validation schemas, or workspace scoping.
- Add backend token streaming, attachments, image generation, research, web search, edit, regenerate, branching, rename, delete, or archive.
- Modify shared shadcn wrappers, MessageScroller primitives, theme tokens, or the global assistant.

## Decisions

### Gate the route on the server

The server page resolves current permissions and uses the existing `canExecuteMarketQueries()` helper. Unauthorized users receive the standard localized `AccessDenied` surface before the interactive demo mounts.

Alternative considered: keep the client `useHasAnyPermission` branch and scripted fallback. Rejected because it preserves two product modes and still ships backend UI to an unauthorized route.

### Resolve workspace server-side and remount by workspace identity

The page calls `getActiveWorkspaceForCurrentUser()`, passes `workspaceId`, and keys `DemoConversation` by that ID or a stable no-workspace key. A key change remounts the route-local client state, so selected conversation, messages, History, draft, cursors, loading flags, and errors reset together; late promises from the unmounted instance cannot update the new workspace instance.

The client still guards every backend entry point when `workspaceId` is null and renders a localized no-active-workspace Empty state.

Alternative considered: copy workspace and thread epoch machinery from the global assistant. Rejected because the route boundary already provides a smaller complete reset mechanism. Request IDs remain for query and conversation changes within one mounted workspace.

### Store backend messages directly

The demo stores `MarketChatMessageResponse[]` and uses the existing normalization and reconciliation helpers. Rendering derives alignment and text directly from `role`, while retaining `status`, `failureReason`, and `createdDate`.

Failed assistant messages remain renderable even when content is empty. The transcript and tracking preview use the backend failure reason when present and a localized fallback otherwise.

Alternative considered: extend AI SDK `UIMessage` with route-local metadata. Rejected because no AI SDK runtime remains and the conversion is the source of the current metadata loss.

### Use one persisted draft and one submit flow

New chat clears the current persisted selection and leaves an empty controlled draft. Submission trims the draft and exits for empty content, missing workspace, initial transcript loading, or an active create/submit.

When no conversation is selected:

1. Derive its title with `deriveMarketConversationTitle()`.
2. Call `createMarketConversation()`.
3. Select and prepend the created conversation immediately after successful creation.
4. Call `submitMarketConversationMessage()` for the retained draft.

Selecting the conversation before message submission means a failed first submit can be retried through the normal follow-up path without creating a second conversation. The draft clears only after a successful submit response is reconciled.

### Keep operation errors independent

Use string-valued errors for History, initial transcript, older messages, create, and submit operations. ActionResult failures expose their returned error; thrown read failures use the available exception message with a localized fallback.

Initial transcript retry reloads the latest page. Older-message failure preserves the loaded timeline and cursor, and its Retry invokes the same cursor request. Create and submit failures preserve the draft; whether a conversation is selected determines which operation retry performs.

Alternative considered: retain one `messagesError` boolean and infer the failed operation. Rejected because it cannot retry an older cursor without risking a full transcript replacement.

### Preserve native form and textarea behavior

The controlled textarea remains inside a native form. Enter without Shift calls `form.requestSubmit()` unless IME composition is active; Shift+Enter keeps the native newline behavior. Initial transcript loading, missing workspace, create, and submit disable the composer and Send control.

Pending and error feedback stays connected through `aria-describedby`; operation failures set `aria-invalid` and render an announced error. Create and submit pending states use stable localized labels.

### Reveal the completed response without changing transport

While create or submit is pending, the transcript renders a route-local assistant Marker with a Spinner and localized Thinking label. The Marker is transient and is not added to persisted message state or the tracking rail.

After a successful synchronous submit, the complete validated user and assistant messages are reconciled immediately as backend truth. A separate route-local reveal state temporarily derives partial assistant content for the transcript and tracking preview. The full response is never mutated or re-requested.

The reveal uses `requestAnimationFrame`, native grapheme segmentation, and a bounded linear duration. Composer, History, and New chat remain disabled until it completes so only one transcript operation can own the live edge. Failed or empty assistant responses and messages loaded from History bypass the reveal.

The pending shimmer is scoped to the demo and stops under `prefers-reduced-motion`. Reduced-motion users receive the full response immediately. During visual reveal, assistive technology receives the complete response without live-announcing every partial update.

### Remove fixture-only surface and dependencies

Delete `useChat`, `createChat`, scripted turns, `nextMessage`, fixture assertions, and the unsupported Add/attachment/image/research/web menu. Move the tracking-rail helper out of the misleading fixture module or consolidate it with route-local state helpers.

After static import checks, remove `@ai-sdk/react`, `@shadcn/helpers`, and `ai` from direct dependencies and update the lockfile. Deterministic checks continue to cover message reconciliation, failed-message retention, create/submit retry identity, and tracking widths without an AI SDK fixture.

## Risks / Trade-offs

- [A create succeeds but its first submit fails] → Select the created conversation before submitting and retain the draft so retry cannot create a duplicate.
- [Workspace switches while a request is active] → Key the client by workspace identity and guard every API entry point when no workspace exists.
- [Failed empty assistant messages disappear] → Treat `FAILED` status as renderable independently of content.
- [Older-message retry replaces the timeline] → Keep a dedicated older-message error and retry the unchanged cursor without invoking initial load.
- [Removing direct dependencies breaks an unseen consumer] → Run static import searches before removal, then typecheck the repository.

## Migration Plan

1. Add server permission/workspace resolution and localized denied/no-workspace states.
2. Replace fixture state with backend messages and create-on-first-message submission.
3. Add status rendering, keyboard behavior, and operation-specific errors/retries.
4. Remove unsupported controls, fixture code, labels, checks, and unused dependencies.
5. Run deterministic checks, targeted lint, typecheck, static cleanup searches, and strict OpenSpec validation.
6. Add the transient Thinking marker and bounded progressive reveal for newly submitted successful assistant responses.

Rollback restores the previous route files and direct dependencies. No backend or data migration is required; a conversation successfully created before a failed submit remains valid backend data.

## Open Questions

None.
