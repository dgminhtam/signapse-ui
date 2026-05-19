## 1. Verify Contract Sources

- [x] 1.1 Re-read `docs/api_mapping.json` for all `/telegram/**` endpoints, operation IDs, request and response schemas, feature setting enum values, and `x-signapse-auth` permissions.
- [x] 1.2 Re-read `D:\Github\signapse\docs\reference\telegram-notifications.md` to confirm Telegram ownership, destination verification, feature routing, and backend-only webhook context.
- [x] 1.3 Confirm frontend code still has no Telegram route, action, DTO, permission, navigation, or UI ownership before changing implementation status notes.

## 2. Update API Mapping Ledger

- [x] 2.1 Update `docs/APIMAPPING.md` Telegram endpoint notes so documented permission requirements match `docs/api_mapping.json`.
- [x] 2.2 Replace the Telegram feature key note with `ECONOMIC_CALENDAR_ALERT`, `MARKET_NEWS_ALERT`, and `SCHEDULED_MARKET_ANALYSIS`.
- [x] 2.3 Keep Telegram frontend integration status as `Chưa triển khai` and webhook status as backend-only.
- [x] 2.4 Keep the Telegram frontend ownership row empty because no frontend files are implemented in this change.

## 3. Validate Documentation Change

- [x] 3.1 Review the `docs/APIMAPPING.md` diff to verify only intended Telegram ledger content changed.
- [x] 3.2 Re-run targeted searches for `TELEGRAM_CALENDAR_ALERT_ASSESSMENT`, `TELEGRAM_NEWS_ALERT_ASSESSMENT`, and `TELEGRAM_MARKET_ANALYSIS` in `docs/APIMAPPING.md` to ensure they are not documented as feature route keys.
- [x] 3.3 Run `openspec status --change "align-telegram-api-mapping-docs"` and report validation limits for this docs-only change.
