## Why

`docs/APIMAPPING.md` is the frontend integration ledger for the backend OpenAPI snapshot, but its Telegram notes currently mix Telegram feature routing keys with Telegram-related system prompt types. This can mislead later frontend work before the Telegram settings UI is proposed or implemented.

## What Changes

- Correct the Telegram feature routing enum documented in `docs/APIMAPPING.md` to match `docs/api_mapping.json` and the backend Telegram reference documentation.
- Clarify Telegram endpoint permission notes where the OpenAPI snapshot already exposes `x-signapse-auth` metadata.
- Keep the frontend implementation status as not integrated: no Telegram routes, actions, definitions, permissions, navigation, or UI will be added by this change.
- Keep `/webhooks/telegram/{connectionId}` documented as backend-only and not a frontend caller.

## Capabilities

### New Capabilities

- `api-mapping-ledger`: Defines expectations for keeping `docs/APIMAPPING.md` aligned with backend snapshot semantics when documenting frontend-facing API contract drift.

### Modified Capabilities

None.

## Impact

- Affected docs: `docs/APIMAPPING.md`.
- Reference sources: `docs/api_mapping.json` and `D:\Github\signapse\docs\reference\telegram-notifications.md`.
- Frontend code impact: none in this change; Telegram remains a documented but unimplemented surface.
- API impact: none; this only corrects frontend-facing documentation of existing backend contract metadata.
