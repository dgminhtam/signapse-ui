## 1. API Definitions And Actions

- [x] 1.1 Re-read `docs/APIMAPPING.md`, `docs/api_mapping.json`, and `D:\Github\signapse\docs\reference\telegram-notifications.md` before implementation to confirm endpoint paths and DTO fields.
- [x] 1.2 Add Telegram response/request types and Zod schemas in `app/lib/telegram/definitions.ts` for bot connections, destinations, link tokens, feature settings, and schedules.
- [x] 1.3 Add `app/api/telegram/action.ts` with authenticated GET actions for bot connections, destinations, feature settings, and market analysis schedules.
- [x] 1.4 Add authenticated mutation actions for bot create/update/disable/delete, destination link-token/update/disable/delete, feature setting update, and schedule create/update/disable/delete.
- [x] 1.5 Ensure all Telegram mutation actions return `ActionResult`, call `revalidatePath("/telegram")`, and preserve response parsing through `fetchAuthenticated()`.

## 2. Server Data Loading

- [x] 2.1 Update the Telegram page server component to resolve current permissions and current workspace context before rendering.
- [x] 2.2 Fetch each Telegram collection only when the user has that collection's read permission, without failing the whole page when another Telegram read permission is missing.
- [x] 2.3 Fetch current workspace watchlist assets for schedule forms when workspace and watchlist read access are available.
- [x] 2.4 Pass backend data and section access states into the Telegram client component instead of using local fixture arrays.
- [x] 2.5 Keep the existing access-denied behavior when the user has no Telegram read permission.

## 3. Bot And Destination Integration

- [x] 3.1 Replace bot connection fixtures with API-backed bot rows while keeping the multi-bot table layout.
- [x] 3.2 Wire bot connection create/update forms to real actions with Zod validation, pending spinners, disabled submit state, success/error toasts, and refresh.
- [x] 3.3 Wire bot disable/delete row actions to real actions behind `AlertDialog` confirmations.
- [x] 3.4 Replace destination fixtures with API-backed destination rows and active destination derivation for routing/schedule controls.
- [x] 3.5 Wire destination link-token flow to `createTelegramLinkToken`, display `startCommand` and `expiresAt`, support copying the command, and refresh destination data after verification.
- [x] 3.6 Wire destination update/disable/delete actions to real actions with confirmations where destructive.

## 4. Feature Routing And Schedule Integration

- [x] 4.1 Replace feature route fixtures with API-backed feature settings merged with the fixed Telegram feature key list.
- [x] 4.2 Wire route destination selection and enabled switch to `updateTelegramFeatureSetting`, blocking controls when no current workspace or active destination can form a valid request.
- [x] 4.3 Replace schedule fixtures with API-backed schedule rows nested under the `SCHEDULED_MARKET_ANALYSIS` route area.
- [x] 4.4 Wire schedule create/update forms to real actions with current workspace, active destinations, timezone, local times, and watchlist asset selection.
- [x] 4.5 Wire schedule disable/delete row actions to real actions behind `AlertDialog` confirmations.
- [x] 4.6 Update readiness summary, empty states, and blocked states to derive from real API data and permissions.

## 5. Validation And Guardrails

- [x] 5.1 Verify the frontend does not expose `/webhooks/telegram/{connectionId}` or model Telegram Bot API webhook `Update` schemas.
- [x] 5.2 Verify there are no remaining Telegram UI fixtures used as production data.
- [x] 5.3 Run `pnpm typecheck`.
- [x] 5.4 Run targeted ESLint for Telegram route, Telegram API action, Telegram lib files, and touched supporting files.
- [x] 5.5 Run `openspec validate integrate-telegram-configuration-api --strict`.
- [x] 5.6 Review the diff for scope drift, especially shared component edits, global theme changes, unrelated API mapping changes, or single-bot UI assumptions.
