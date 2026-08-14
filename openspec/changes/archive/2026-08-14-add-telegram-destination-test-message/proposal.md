## Why

Operators cannot currently verify that Signapse can deliver a message end to end through a configured Telegram bot to a linked Telegram destination. The backend now exposes a destination-scoped test-message command, so the Telegram configuration workspace needs a safe, accessible action that reflects that contract.

## What Changes

- Add an authenticated server action for `POST /telegram/destinations/{destinationId}/test-message` with no request body and a void result.
- Add a visible `Gửi thử` row action for active Telegram destinations, with per-row pending state and localized success, error, timeout, permission, and inactive-state feedback.
- Keep unavailable actions discoverable for read-only users through a focusable `aria-disabled` treatment with an accessible explanation.
- Reorganize destination row actions as `Gửi thử`, `Sửa`, and an overflow menu containing the existing pause and delete flows.
- Preserve existing confirmation behavior for pause and delete while avoiding confirmation, refresh, or persistent state for the test-message command.
- Remove obsolete Telegram specification requirements that still describe the workspace as UI-only or prohibit live backend mutations.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `telegram-configuration-ui`: Add end-to-end test-message behavior to Telegram destination rows and remove stale UI-only requirements that contradict the API-backed workspace.

## Impact

- Telegram server actions and authenticated backend transport usage.
- Telegram destination table actions, pending state, permission/status gating, overflow composition, and accessible descriptions.
- Vietnamese and English Telegram dictionaries.
- Existing Telegram OpenSpec requirements and API mapping assumptions.
- No backend contract, dependency, route, DTO, or persistence changes.
