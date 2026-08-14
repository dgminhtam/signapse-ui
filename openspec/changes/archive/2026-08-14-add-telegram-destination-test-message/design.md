## Context

The Telegram configuration workspace already loads and mutates backend-backed bot connections, destinations, feature settings, and schedules. Destination rows currently expose edit, pause, and delete as three inline icon actions, while the live backend contract now adds `POST /telegram/destinations/{destinationId}/test-message` with no request body, a `204 No Content` response, and the `telegram-destination:manage` permission.

The command verifies the end-to-end path from Signapse through the linked Telegram bot to the selected Telegram destination. Its message content is fixed by the backend, and the response does not provide a message identifier, delivery history, or table state to refresh. The existing authenticated transport already supports empty `204` responses and propagates the current UI locale through `Accept-Language`.

The destination action column is already dense. The new action must remain discoverable, must explain unavailable states to keyboard and screen-reader users, and must not weaken the existing confirmation behavior for pause or delete.

## Goals / Non-Goals

**Goals:**

- Provide a visible, localized per-destination action for sending the backend-generated test message.
- Match the live API contract without adding request or response DTOs.
- Keep permission, inactive, pending, success, failure, and timeout states understandable and accessible.
- Preserve per-row concurrency and prevent duplicate activation while a send is pending.
- Rebalance the destination action cell without changing destination CRUD behavior.
- Remove stale OpenSpec requirements that still describe the Telegram workspace as UI-only.

**Non-Goals:**

- Custom or previewable test-message content.
- Delivery receipts, message history, audit records, or a persisted last-test timestamp.
- Automatic retries, idempotency keys, client cooldowns, or rate-limit policy.
- Frontend validation of the linked Telegram bot status.
- Backend, route, dependency, data-model, or Telegram feature-routing changes.

## Decisions

### Use a void authenticated server action without revalidation

Add one destination-scoped server action that accepts a numeric destination identifier, calls the documented endpoint with `POST`, omits the body, and returns the existing void action-result shape. The action uses the shared authenticated transport so permission headers, localized errors, and `Accept-Language` remain consistent.

No DTO is introduced because the contract has neither request fields nor response content. The action does not revalidate the Telegram route, and the client does not refresh after success, because the command does not mutate any state rendered by the workspace.

Alternative considered: model an empty request/response type and refresh after every send. Rejected because it invents contract surface and causes unnecessary data movement and layout updates.

### Keep test-message interaction in a focused row-action component

The destination row delegates the new interaction to a focused client component that owns only the send transition and feedback for that destination. Local pending state disables the affected action while allowing sends to different destinations to proceed independently.

Alternative considered: put a destination selector and send action in the section toolbar. Rejected because the row already supplies the destination context and a second selector adds friction and synchronization state.

Alternative considered: open a form or confirmation dialog. Rejected because the backend owns the fixed content and the action is a deliberate connectivity check rather than a destructive mutation.

### Make unavailable actions focusable and explicitly described

The test action remains visible when the user lacks manage permission or the destination is not `ACTIVE`. These unavailable states use a focusable button with `aria-disabled="true"`, blocked pointer and keyboard activation, and an explicit description associated through `aria-describedby`. The same explanation is visible from a tooltip on hover and focus. Permission denial takes precedence over inactive status when both apply.

Native `disabled` is reserved for the in-flight pending state, when the user has already understood and activated the control. This prevents duplicate submission while avoiding an inaccessible permission/status explanation.

Alternative considered: hide the action or use native disabled for all unavailable states. Rejected because hiding reduces discoverability and native disabled controls cannot receive focus to expose the reason.

### Preserve a visible label and move lifecycle actions into overflow

The action order is `Gửi thử`, `Sửa`, then an overflow menu. The test action uses the Lucide send icon with a text label at every breakpoint. The overflow menu contains `Tạm dừng`, a separator, and `Xóa`; both actions keep their existing confirmation dialogs and localized feedback.

The menu uses the existing shadcn wrappers and opens the corresponding controlled confirmation after the menu item is selected. Focus must return to the overflow trigger after cancellation or completion. The table continues to own any horizontal overflow on narrow viewports.

Alternative considered: add a fourth inline icon-only button. Rejected because the current action column is already dense, the send icon alone is less discoverable on touch devices, and tooltip-only meaning is insufficient.

### Treat `204` as accepted send, not human receipt

On `204`, the client shows localized success feedback naming the Telegram destination. The copy states that the test message was sent but never claims it was received or read. No persistent row status is shown.

Backend-provided localized error messages remain primary, with feature-specific localized fallbacks. The client never retries automatically. If a timeout leaves the outcome ambiguous, feedback tells the user to check Telegram before manually trying again.

Alternative considered: optimistic success state or a persisted “last tested” value. Rejected because the response has no receipt, timestamp, message identifier, or persistence contract.

### Use the current UI locale

The command relies on the current request locale already sent as `Accept-Language`. It does not use feature-setting or schedule output language because a destination-level connectivity check is not scoped to a workspace workflow.

### Reconcile the main Telegram specification

The delta spec adds normative test-message behavior and removes obsolete UI-only requirements superseded by the API-backed Telegram requirements. The shared infrastructure and nested schedule hierarchy remain intact; only contradictory statements that prohibit backend calls or live mutation feedback are removed.

## Risks / Trade-offs

- **A timeout can produce an unknown outcome and a manual retry can duplicate a message** → Never retry automatically; provide explicit timeout copy telling the user to check Telegram first.
- **`204` does not prove that a person saw the message** → Success copy describes sending only and does not claim receipt or reading.
- **Focusable `aria-disabled` controls still receive activation events** → Guard both pointer and keyboard activation before invoking the server action and keep pending as native disabled.
- **Moving pause and delete into an overflow menu can regress focus or confirmation behavior** → Use controlled confirmation state, preserve existing dialog copy/actions, and verify keyboard focus restoration.
- **The action cell becomes wider** → Keep only the new primary row action and edit visible; let the existing table surface own narrow-viewport horizontal overflow.
- **Backend error and rate-limit behavior is not documented** → Preserve localized backend messages and a safe generic fallback without inventing status mappings or cooldown rules.

## Migration Plan

1. Add localized copy and the server action.
2. Add the focused test-message row action and reorganize destination lifecycle actions into overflow.
3. Validate permission, status, pending, feedback, keyboard, and responsive behavior.
4. Remove obsolete UI-only requirements through the delta spec when the change is archived.

Rollback removes the row action and server action and restores the prior inline destination actions. No data migration or backend rollback is required.

## Open Questions

None. Product semantics, success meaning, retry policy, locale ownership, persistence scope, accessibility treatment, and action composition were resolved during discovery.
