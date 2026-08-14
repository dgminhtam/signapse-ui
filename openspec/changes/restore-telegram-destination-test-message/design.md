## Context

The destination test-message feature was previously implemented and specified, then removed when one dev OpenAPI build temporarily omitted its endpoint. The rebuilt live contract now confirms `POST /telegram/destinations/{destinationId}/test-message`, `operationId: sendTestMessage`, an `int64` path parameter, `204 No Content`, bearer authentication, and `telegram-destination:manage`.

Since the earlier implementation, Telegram infrastructure moved from wide Tables and Sheets to responsive Cards and Items, bot creation became token-only, and bot/destination display labels became backend-owned read-only metadata. Restoration must reuse the proven test-message semantics without reverting those newer boundaries.

## Goals / Non-Goals

**Goals:**

- Restore one visible, localized test-message action per destination Item.
- Preserve the previous no-body, void-result, no-revalidation server-action behavior.
- Keep permission, inactive, pending, success, failure, and timeout states accessible and row-scoped.
- Preserve the responsive Card/Item hierarchy and lifecycle overflow confirmation behavior.
- Reconcile API mapping, domain terminology, and OpenSpec requirements with the rebuilt live contract.

**Non-Goals:**

- Restoring bot or destination rename/update operations, editable display labels, Tables, or Sheets.
- Custom or previewable test content, delivery receipts, history, audit records, or persisted test state.
- Automatic retries, idempotency keys, client cooldowns, or frontend validation of the linked bot status.
- Backend, DTO, schema, dependency, route, feature-routing, or schedule changes.

## Decisions

### Restore a void authenticated server action without revalidation

The server action validates that the destination identifier is a positive integer, sends an authenticated `POST` with no body, and returns the existing `ActionResult<void>` shape. It relies on `fetchAuthenticated()` for bearer auth, `Accept-Language`, timeout behavior, and empty `204` parsing. It does not call route revalidation because the command changes no rendered workspace state.

No request or response DTO is introduced. Modeling an empty payload or refreshing destination data would invent contract surface and imply state that the backend does not return.

### Keep interaction state in a focused destination action component

A feature-local client component owns the send transition and toast feedback for one destination. Local transition state prevents duplicate activation for that Item without disabling eligible actions on other Items.

The component remains separate from destination linking and lifecycle confirmation because those flows have different state, recovery, and refresh semantics.

### Compose the action into the current Card/Item hierarchy

Each destination Item presents the labeled secondary `Gửi thử` Button before its existing overflow trigger. The overflow remains limited to supported lifecycle actions (`Vô hiệu hóa`, separator, `Xóa`); no edit-label control returns. On narrow widths the Item may wrap its action area below content without page overflow, and the loading skeleton mirrors both the labeled action and overflow trigger.

An overflow-only test action was rejected because it reduces discoverability for the primary operational check. Restoring the former Table or Sheet composition was rejected because it would reverse the completed infrastructure redesign.

### Preserve focusable unavailable explanations

The action stays visible for read-only users and non-`ACTIVE` destinations. These states use a native Button with `aria-disabled="true"`, guarded activation, `aria-describedby`, and Tooltip content exposed on focus and hover. Missing manage permission takes precedence over inactive status. Native `disabled` is reserved for the pending state so unavailable users can reach and understand the reason.

Lifecycle create/disable/delete controls remain omitted for read-only users; restoring this non-actionable test affordance does not restore any unsupported mutation.

### Treat `204` as accepted send, not receipt

Success feedback names the destination and states only that the test message was sent. The client does not claim receipt or reading, persist a timestamp, refresh the workspace, or retry automatically. Timeout copy explicitly says the outcome is uncertain and asks the operator to check Telegram before retrying.

Backend-localized errors remain primary, with the feature dictionary providing the safe fallback. Test content remains backend-owned and follows the current UI locale through `Accept-Language`.

## Risks / Trade-offs

- **A timeout may have delivered the message** → Do not retry automatically; explain the ambiguous outcome before a manual retry.
- **A visible unavailable action adds Item width** → Allow the Item action area to wrap responsively and mirror it in the skeleton.
- **Focusable `aria-disabled` still receives activation events** → Guard activation before starting the transition and use native disabled only while pending.
- **The dev contract could drift again** → Record the exact live operation in `APIMAPPING.md` and keep targeted static verification for the path and action.
- **`204` does not prove human receipt** → Keep success copy limited to accepted send semantics.

## Migration Plan

1. Restore API mapping and the focused no-body server action.
2. Restore localized copy and the per-Item test action in the current destination Card.
3. Restore matching domain/spec documentation and skeleton parity.
4. Run static, lint, typecheck, and strict OpenSpec validation.

Rollback removes only the test action, server action, copy, and restored documentation. No data or backend migration is required.

## Open Questions

None. The rebuilt live contract and the archived change resolve method, path, permission, response, locale, feedback, retry, persistence, and availability semantics.
