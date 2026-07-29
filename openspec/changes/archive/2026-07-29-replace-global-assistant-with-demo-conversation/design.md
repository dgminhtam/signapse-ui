## Context

The protected main layout currently mounts `ProtectedAiAssistant`, which dynamically loads `AssistantRuntime`, creates an Assistant UI external-store runtime, and renders `AssistantModal`. Separately, `/demo-conversation` resolves permission, active workspace, and display name before rendering a route-local `DemoConversation`.

Both surfaces call the same authenticated market-conversation actions, but the demo now owns the more complete interaction model: backend history search and pagination, cursor-based transcript loading, operation-specific retry, create-on-first-message, optimistic user feedback, failed-message rendering, tracking rail, and progressive visual reveal.

The replacement must activate that implementation globally without deleting the previous assistant graph. Removal of the inactive runtime, controller, modal, dictionaries, and dependencies belongs to a subsequent cleanup change.

## Goals / Non-Goals

**Goals:**

- Make the promoted demo conversation the only active global assistant for authorized users in the protected shell.
- Preserve the existing client-side permission gate, active-workspace scope, dynamic loading boundary, and error fallback.
- Keep the current route and conversation session intact across overlay open and close.
- Reset all conversation state when the active workspace changes.
- Retire the standalone demo route so one page cannot mount two assistant instances.
- Preserve the validated synchronous API response as transcript truth while retaining the bounded progressive visual reveal.

**Non-Goals:**

- Delete or refactor the old Assistant UI runtime, controller, modal, mapping helpers, dictionary keys, or dependencies.
- Change market-conversation actions, DTOs, permissions, or backend behavior.
- Add backend streaming, attachments, edit, regenerate, branching, fullscreen, rename, delete, or archive.
- Change shared `MessageScroller` or other shared UI primitives.

## Decisions

### Promote the route implementation into a shared production component

Move the conversation component, pure history helpers, and route-local styles into a shared `components/market-conversation-assistant/` area and rename the active component to `MarketConversationAssistant`.

This avoids a shared shell importing application code from a route folder and makes ownership explicit. Importing the route-local demo directly from `ProtectedAiAssistant` was rejected because it would invert the route/component dependency boundary and leave production behavior named and structured as a demo.

### Replace only the protected dynamic entry point

Keep `ProtectedAiAssistant` as the permission and failure boundary, but change its dynamic target from `AssistantRuntime` to `MarketConversationAssistant`. The protected layout supplies `workspaceId` and a resolved `displayName`.

The old runtime graph remains untouched and unreachable. Reusing `useMarketConversationAssistant` was rejected because the promoted surface already owns equivalent persisted state and combining both controllers would duplicate request, draft, history, and reconciliation state.

### Keep session state above local overlay visibility

`MarketConversationAssistant` owns its conversation hooks and a local `open` state for a shared accessible non-modal Popover. Closing the Popover removes only the visible overlay; it does not reset the component's conversation state. The floating trigger remains mounted in the protected shell, and Close, Escape, or outside interaction update `open` without navigation.

The Popover keeps the promoted Card as the single conversation composition, preserves the existing compact dimensions within viewport bounds, and leaves the page outside the panel operable. Fullscreen is not carried forward because it is absent from the selected target design.

### Remount on workspace identity

Render the promoted assistant with `key={workspaceId ?? "no-workspace"}` at the protected boundary. A workspace switch already refreshes the server layout; the key guarantees a fresh conversation state tree and invalidates callbacks from the previous instance.

This reuses the demo route's proven lifecycle rather than adding another workspace-reset effect across its many local states.

### Retire the standalone route during promotion

Remove the `/demo-conversation` page and its breadcrumb mapping when the shared component becomes global. Keeping the page would also mount the global assistant from the parent layout and permit two independent instances to act on the same workspace.

No compatibility redirect is added because the demo route is not a canonical product route.

### Keep localization migration narrow

Continue using the existing `demoConversation` labels for the promoted panel during this change, but replace user-visible demo wording such as Close. Reuse `aiAssistant` loading, error, and trigger labels at the protected shell.

Renaming or merging the dictionary namespaces is deferred with the inactive assistant cleanup to avoid a broad translation and dead-code edit in the activation change.

### Preserve synchronous truth and progressive presentation

The backend continues returning complete user and assistant messages synchronously. The returned payload becomes stored transcript truth immediately; the existing bounded reveal changes only displayed assistant text and remains disabled under reduced motion. The UI must not label this behavior as backend token streaming.

## Risks / Trade-offs

- [Inactive old assistant code remains in the bundle graph or drifts] → Ensure the protected entry point no longer imports it, run a static reference check, and remove it in the follow-up cleanup change.
- [Closing the overlay loses draft or selected conversation] → Keep conversation state in the always-mounted global component and make close change only local visibility.
- [Workspace switch exposes stale state] → Key the active component by workspace identifier and retain existing request identity guards.
- [Nested History Popover or tracking Hover Card has focus/portal regressions inside the parent Popover] → Use existing shared overlay wrappers and verify keyboard focus, Escape, selection, and close behavior.
- [Compact fixed sizing overflows narrow viewports] → Bound width and height by the viewport while preserving the existing Card proportions.
- [Progressive reveal is mistaken for backend streaming] → Keep synchronous pending/reveal labels and never expose a streaming status or endpoint.

## Migration Plan

1. Promote and rename the demo implementation and update deterministic check paths.
2. Add the floating trigger and accessible non-modal Popover around the always-mounted conversation state.
3. Switch `ProtectedAiAssistant` and the protected layout props to the new entry point.
4. Remove the standalone demo route and breadcrumb identity.
5. Validate permission, workspace, close/reopen, request, and localization behavior.
6. If rollback is required, restore the dynamic import target to `AssistantRuntime`; the old implementation remains intact in this change.

## Open Questions

None. Removal of inactive code and dictionary consolidation is explicitly deferred.
