## 1. Scope And Structure

- [x] 1.1 Re-read `docs/APIMAPPING.md` and `D:\Github\signapse\docs\reference\telegram-notifications.md` before implementation to confirm the UI still matches the documented Telegram concepts.
- [x] 1.2 Create local Telegram UI definitions and permission constants for the UI shell without adding Telegram API actions or backend fetches.
- [x] 1.3 Add the Telegram settings route under `app/(main)` using a cardless workspace and the existing access-denied pattern.
- [x] 1.4 Add a settings navigation entry for Telegram gated by Telegram read permissions.

## 2. Workspace UI Shell

- [x] 2.1 Build the compact readiness summary for bot connections, destinations, feature routing, and market analysis schedules.
- [x] 2.2 Build the bot connection section with shared toolbar/table surface, status badges, empty state, skeleton, and UI-only row actions.
- [x] 2.3 Build the destination section with shared toolbar/table surface, chat type/status display, empty state, skeleton, and UI-only link-token review flow.
- [x] 2.4 Build the feature routing section for `ECONOMIC_CALENDAR_ALERT`, `MARKET_NEWS_ALERT`, and `SCHEDULED_MARKET_ANALYSIS` with Vietnamese labels and route-scoped switches.
- [x] 2.5 Build the scheduled market analysis section with shared toolbar/table surface, schedule metadata, empty state, skeleton, and UI-only row actions.

## 3. Focused UI States

- [x] 3.1 Add UI-only create/edit form shells for bot connection and market analysis schedule using `AppFormShell`, `FieldGroup`, and shadcn form primitives.
- [x] 3.2 Add UI-only destination linking state that shows the intended `/start <token>` command flow without requesting a live token.
- [x] 3.3 Add `AlertDialog` confirmation shells for destructive bot, destination, and schedule actions without performing mutations.
- [x] 3.4 Ensure all visible UI copy is professional Vietnamese and does not claim a backend mutation succeeded.

## 4. No-API Guardrails And Validation

- [x] 4.1 Verify no `app/api/telegram/action.ts`, Telegram route handler, or `fetchAuthenticated()` call to `/telegram/**` was added.
- [x] 4.2 Verify no frontend control exposes `/webhooks/telegram/{connectionId}` as a user-callable action.
- [x] 4.3 Run the appropriate frontend validation command for touched UI files.
- [x] 4.4 Review the diff for scope drift, especially shared component edits, global theme changes, API integration, or fake success toasts.
