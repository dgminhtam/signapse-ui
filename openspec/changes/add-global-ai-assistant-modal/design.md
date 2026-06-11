## Context

Signapse already provides a canonical persisted conversation experience at `/market-conversations` and `/market-conversations/[conversationId]`. Its authenticated server actions create conversations, submit synchronous messages, load persisted messages, and fetch structured market analysis and evidence under the `query:execute` permission.

The new surface is a global assistant entry point for users who are working elsewhere in the protected app. Assistant UI provides an `AssistantModal` registry component implemented as a floating popover containing a `Thread`, but the registry source includes generic controls such as attachments, editing, regeneration, branching, export, and hard-coded English copy that do not match the current Signapse contract or repository UI rules.

The first delivery is intentionally a placeholder conversation surface. It must establish the shell, permission boundary, localization, accessibility, and runtime ownership without inventing fake persisted messages. Later backend wiring should reuse the existing market conversation APIs rather than introducing a separate assistant domain.

## Goals / Non-Goals

**Goals:**

- Add a permission-aware Assistant UI modal to every protected locale route.
- Keep the server-owned main layout and mount the assistant through a small Client Component.
- Deliver a polished localized placeholder state that is honest about unavailable backend interaction.
- Establish a route-local runtime boundary that can map persisted market conversation DTOs into Assistant UI message state.
- Preserve `/market-conversations` as the canonical history and full-detail experience.
- Keep the imported Assistant UI source aligned with Signapse shadcn, accessibility, responsive layout, and localization conventions.

**Non-Goals:**

- Assistant Cloud, anonymous/public assistant access, token streaming, SSE, or polling.
- Attachments, tool-call UI, raw reasoning traces, editing, regeneration, branching, export, rename, delete, or archive.
- Replacing the canonical market conversation list/detail routes.
- Adding a global conversation store before backend-enabled thread switching requires it.
- Implementing message lazy loading before the backend pagination contract in `add-market-conversation-message-lazy-loading` is available.

## Decisions

### Mount a client-owned assistant inside the protected server layout

Add a small client component to `app/[lang]/(main)/layout.tsx` inside the existing permission and sidebar providers. The server layout continues to resolve authentication, permissions, workspace, and dictionary state. The client component reads permissions through the existing permission provider and returns nothing unless `query:execute` is present.

Alternative considered: add the assistant to the root locale layout. Rejected because that would initialize it for auth/public routes and weaken the permission boundary.

Alternative considered: convert the main layout to a Client Component. Rejected because it would disrupt existing server-side auth, permission, workspace, and cookie loading.

### Use the AssistantModal interaction pattern without accepting the full registry feature set

Use the official `AssistantModalPrimitive` composition and a reduced `Thread` implementation under `components/assistant-ui/`. Preview the registry source through the shadcn CLI, then retain only the modal, thread, accessible tooltip/button composition, message rendering, and composer structure needed by this change.

The imported source must use existing `@/components/ui/` wrappers where a Signapse wrapper exists, Lucide icons, semantic theme tokens, dictionary copy, and repo-standard pending/error composition. Unsupported controls are removed rather than disabled or left as misleading placeholders.

Alternative considered: install the full registry output unchanged. Rejected because it includes unsupported behavior, hard-coded English labels, and visual overrides that conflict with the `radix-nova` policy.

Alternative considered: implement a new Sheet instead of Assistant UI. Rejected because the requested interaction is specifically `AssistantModal`, and the library primitives provide the thread/runtime contract needed for later integration.

### Keep the placeholder honest and runtime ownership narrow

The placeholder phase may initialize the minimum Assistant UI runtime required to render the thread, but message submission remains disabled or explicitly unavailable until it calls the Signapse backend. It must not return fabricated assistant messages or store a second local history that looks persisted.

Runtime creation belongs in a dedicated client provider adjacent to the modal rather than the global `components/providers.tsx`, because only authorized protected routes need it. This also avoids loading Assistant UI dependencies for public/auth pages.

Alternative considered: use a `LocalRuntime` adapter that generates fake replies. Rejected because it would establish behavior that conflicts with backend-persisted conversations as the source of truth.

### Use a backend-owned runtime adapter when interaction is enabled

When the placeholder becomes interactive, use an Assistant UI external-store or equivalent custom runtime adapter whose state is derived from Signapse market conversation DTOs. The adapter maps:

```text
MarketChatMessageResponse.role USER      -> user
MarketChatMessageResponse.role ASSISTANT -> assistant
content                                  -> text message part
PENDING                                  -> running/pending presentation
FAILED + failureReason                   -> error presentation
conversation id                          -> runtime thread id
```

The first submitted message follows the current two-call workflow: derive title, create the conversation, then submit the message. Subsequent messages call the existing synchronous submit action. Private requests remain behind `fetchAuthenticated()` through server actions.

Alternative considered: use a long-lived `LocalRuntime` and synchronize it opportunistically. Rejected because local and backend thread state can diverge after reload, workspace changes, or navigation.

### Preserve canonical routing and local modal state

Opening and closing the assistant changes no URL state. The modal provides a locale-aware action to `/market-conversations` before a conversation exists and to `/market-conversations/{id}` after a persisted thread exists. It does not use route interception or embed the full analysis/evidence workspace.

Alternative considered: encode modal state or selected thread in query parameters. Rejected because the assistant is an auxiliary overlay and canonical thread URLs already exist.

### Treat workspace changes as a conversation boundary

Market conversation endpoints are scoped by the backend-resolved current workspace. The assistant must not carry an apparently active persisted thread across a workspace switch. The placeholder phase only needs to avoid owning workspace state; backend integration should reset or reload runtime thread state when the active workspace changes.

Alternative considered: send `workspaceId` from the assistant. Rejected because the existing backend contract explicitly resolves workspace context and the frontend does not send that field.

## Risks / Trade-offs

- [Assistant UI registry output drifts from Signapse UI conventions] -> Preview registry changes, review every added file, retain a reduced component set, and replace hard-coded copy and unsupported controls before completion.
- [The floating trigger overlaps existing lower-right controls or data workbenches] -> Verify representative desktop and mobile routes and use responsive inset/sizing that remains inside the protected viewport.
- [Placeholder runtime accidentally implies persistence] -> Keep submission disabled or explicitly unavailable until the backend adapter is active; never generate fake successful assistant replies.
- [Modal and canonical conversation state diverge] -> Treat backend DTOs as authoritative and navigate to canonical routes for history and full structured analysis.
- [Bundle cost affects all protected pages] -> Mount only for authorized users and lazy-load the assistant client surface if the dependency materially affects the protected shell bundle.
- [Workspace switching leaves a stale thread visible] -> Reset or reload the runtime on active workspace change during backend integration.
- [Current detail endpoint returns the full message array] -> Keep the modal placeholder bounded and coordinate long-thread loading with the separate message-pagination change rather than inventing a second pagination contract.

## Migration Plan

1. Add and review the minimum Assistant UI dependencies and registry source.
2. Add the protected client provider and permission-gated modal mount.
3. Add localized placeholder, responsive sizing, focus behavior, and canonical-route action.
4. Remove unsupported generic Assistant UI controls and verify Signapse shadcn conformance.
5. Add the persisted conversation runtime adapter when the backend-enabled phase is started.
6. Map synchronous pending, completed, and failed message states without advertising streaming.

Rollback is UI-local: remove the assistant mount, provider, registry components, dictionary keys, and dependencies. Existing `/market-conversations` routes and backend actions remain unchanged.

## Open Questions

- Should the backend-enabled modal initially resume the most recently modified conversation or always start a new conversation? Starting a new conversation is recommended for the first interactive version to avoid hidden thread-selection behavior.
- Should the modal stay available on `/market-conversations` routes? Keeping it available is consistent globally, but hiding it there may reduce duplicate conversation surfaces; this can be resolved during implementation after checking the final interaction.
