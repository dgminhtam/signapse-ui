## Context

The demo owns scripted `useChat` state and route-local persisted history/detail state. A selected persisted transcript is currently mapped into the same `UIMessage` renderer, but its composer is deliberately read-only. The existing market-conversation boundary already validates `POST /market-conversations/{id}/messages` and returns the completed user and assistant message pair.

The global assistant's `useMarketConversationAssistant` provides the reference submit lifecycle, but adopting that controller would duplicate and replace the demo's established history, cursor, fixture, and tracking behavior.

## Goals / Non-Goals

**Goals:**

- Let an authorized user submit a non-empty follow-up from a selected persisted transcript.
- Reuse the existing submit action and route-local message merge path.
- Preserve the draft on failure, prevent duplicate submission, and expose localized pending and error feedback.
- Preserve loaded older messages, scroll behavior, role spacing, and tracking rails after appending the response.
- Keep the scripted path unchanged outside persisted selection.

**Non-Goals:**

- Create a conversation from New chat.
- Replace the fixture transport or global assistant controller.
- Optimistically invent message IDs or stream partial assistant content.
- Change permissions, API payloads, DTOs, routes, shared primitives, or message subtype rendering.

## Decisions

### Keep submission state route-local

Add controlled draft, pending, and error state beside the existing selected-conversation state. Submit directly with `selectedConversation.id` and merge the returned `userMessage` and `assistantMessage` through `mergeConversationMessages`.

Alternative considered: reuse `useMarketConversationAssistant`. Rejected because it also owns history, selection, creation, and pagination already implemented locally by the demo.

### Use the server response as transcript truth

Do not append optimistic messages. While the request is active, show the existing Thinking treatment; after success, append both validated backend messages and clear the draft. This avoids temporary IDs and reconciliation logic for an API that already returns both completed messages.

Alternative considered: optimistically append the user's draft. Rejected because it adds rollback and ID replacement behavior without improving the synchronous response contract.

### Preserve retry context

Trim and validate before calling the action, disable duplicate submission while pending, retain the draft when the action fails, and show localized error feedback at the composer. Clear stale submission feedback when the selected conversation or New chat changes.

### Keep scripted and persisted modes separate

Only selected persisted conversations receive the editable API composer. New chat restores the existing scripted fixture, and users without `query:execute` keep that fixture path. Conversation creation remains a later change.

### Reuse existing request invalidation

Capture the current message request generation before submitting and apply the response only if the same persisted conversation remains current. Busy controls prevent ordinary thread switching during submission; the generation guard covers stale asynchronous completion.

## Risks / Trade-offs

- [The backend call returns both messages only after assistant work completes] → Show Thinking and keep controls disabled until the action settles.
- [A stale response arrives after the transcript changes] → Compare the message request generation and selected conversation before merging.
- [A successful submit leaves history metadata stale locally] → Move the selected summary to the front; History already reloads page zero from server when reopened.
- [Submission fails after the backend has accepted the message] → Preserve the draft and rely on backend response/error semantics; do not invent client idempotency unsupported by the contract.

## Migration Plan

1. Add localized composer submission states.
2. Wire the selected persisted composer to the existing submit action and merge helper.
3. Extend deterministic assertions and run scoped verification.

Rollback restores the persisted read-only composer. No backend or data migration is required.

## Open Questions

None. Persisted conversation creation and token streaming remain separate future scope.
