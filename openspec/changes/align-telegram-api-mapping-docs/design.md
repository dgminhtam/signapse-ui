## Context

`docs/APIMAPPING.md` is used as the frontend-facing ledger for the backend OpenAPI snapshot in `docs/api_mapping.json`. The current Telegram section already documents the correct endpoint surface and marks it as not implemented, but one note describes Telegram feature routing keys with `TELEGRAM_*` values that actually belong to system prompt types.

The backend reference document at `D:\Github\signapse\docs\reference\telegram-notifications.md` describes the feature routing keys as `ECONOMIC_CALENDAR_ALERT`, `MARKET_NEWS_ALERT`, and `SCHEDULED_MARKET_ANALYSIS`. The same values appear in `UpdateTelegramFeatureSettingRequest.featureKey` and `TelegramFeatureSettingResponse.featureKey` in `docs/api_mapping.json`.

## Goals / Non-Goals

**Goals:**

- Keep `docs/APIMAPPING.md` aligned with the current backend snapshot for Telegram feature setting enum values.
- Clarify Telegram permission notes using `x-signapse-auth` metadata from `docs/api_mapping.json`.
- Preserve the existing status that Telegram has no frontend route, action, definitions, permissions, or navigation yet.
- Keep the update documentation-only.

**Non-Goals:**

- Do not implement Telegram frontend screens, server actions, DTOs, permission constants, navigation, or forms.
- Do not change `docs/api_mapping.json` or backend reference docs.
- Do not design the eventual Telegram settings UX in this change.
- Do not model the full Telegram Bot API webhook `Update` schema in frontend docs.

## Decisions

1. Treat `docs/api_mapping.json` as the contract source of truth.

   The OpenAPI snapshot is the canonical source for endpoint paths, operation IDs, request and response schemas, enum values, and `x-signapse-auth` permissions. The backend reference document is used as product-context confirmation when it agrees with the snapshot. Alternative considered: mirror only the prose reference doc. That risks drifting from the generated backend contract that frontend code will consume.

2. Document feature routing keys separately from Telegram-related system prompt types.

   `ECONOMIC_CALENDAR_ALERT`, `MARKET_NEWS_ALERT`, and `SCHEDULED_MARKET_ANALYSIS` are feature setting keys. `TELEGRAM_CALENDAR_ALERT_ASSESSMENT`, `TELEGRAM_NEWS_ALERT_ASSESSMENT`, and `TELEGRAM_MARKET_ANALYSIS` are system prompt types. Keeping them separate avoids wiring future frontend form options to the wrong enum. Alternative considered: remove the enum note entirely. That would reduce immediate drift but lose useful integration guidance.

3. Keep Telegram frontend ownership explicitly empty.

   The repository currently has no Telegram frontend files. The docs should continue to say the surface is unimplemented so later work starts with a separate proposal. Alternative considered: predeclare likely file paths. That would over-specify implementation before a UI proposal exists.

## Risks / Trade-offs

- Wrong enum copied into future UI -> Mitigate by documenting the feature setting enum from `UpdateTelegramFeatureSettingRequest` and distinguishing it from system prompt types.
- Permission notes remain incomplete -> Mitigate by checking each Telegram operation's `x-signapse-auth.permissions` while updating the table.
- Documentation appears to promise implemented behavior -> Mitigate by preserving "Chưa triển khai" statuses and the note that there are no frontend routes/actions/types/permissions/navigation yet.
