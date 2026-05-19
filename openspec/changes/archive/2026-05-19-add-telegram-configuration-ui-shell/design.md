## Context

`docs/APIMAPPING.md` documents Telegram bot connections, destinations, feature settings, market analysis schedules, and the backend-only Telegram webhook. The backend reference document describes the operational model: a user-managed bot is connected first, a destination is verified through `/start <token>`, feature routes choose a destination per workflow, and scheduled market analysis sends at local absolute times.

The frontend currently has no Telegram route, action, DTO, permission module, or navigation entry. This change is intentionally UI-only so the team can review the Telegram configuration experience before wiring live API calls.

## Goals / Non-Goals

**Goals:**

- Add a reviewable Telegram configuration UI shell under the existing settings navigation model.
- Show the final information architecture for bot connections, verified destinations, feature routing, and market analysis schedules.
- Use existing Signapse app-level surfaces and shadcn primitives without changing `components/ui`.
- Use professional Vietnamese UI copy and mirror loading, empty, blocked, and destructive-confirmation states.
- Make API integration seams obvious for the later backend-wiring change.

**Non-Goals:**

- Do not add Telegram server actions or route handlers.
- Do not call `/telegram/**` endpoints or `/webhooks/telegram/**`.
- Do not parse live Telegram DTOs with Zod yet.
- Do not implement real create/update/delete/disable mutations.
- Do not design or expose Telegram delivery logs; they are not in the current frontend API mapping.
- Do not model Telegram Bot API webhook `Update` schemas in frontend code.

## Decisions

1. Use a single settings workspace instead of a multi-page wizard.

   Telegram setup has an order, but operators will revisit bot status, destinations, feature routes, and schedules independently. A single cardless workspace with four sections keeps the dependency chain visible while supporting repeated maintenance. Alternative considered: a strict first-run wizard. That would be helpful for onboarding but weak for ongoing administration.

2. Keep the route top-level under the existing settings nav style.

   Existing settings pages are top-level app routes such as `/system-prompts` and `/cronjobs`, so this UI should use `/telegram` and appear under the `Cai dat` navigation group. Alternative considered: `/settings/telegram`. That would introduce a new route hierarchy not currently used by the app shell.

3. Use read-only/disabled UI seams for backend-dependent actions.

   Buttons such as `Ket noi bot`, `Lien ket diem nhan`, and `Tao lich` may open local UI shells or disabled review states, but they must not perform network calls. Any disabled/pending-looking action must clearly avoid claiming a real backend mutation happened. Alternative considered: fake successful mutations in local state. That risks misleading reviewers and future implementers.

4. Use switches only for feature routing.

   `PUT /telegram/feature-settings` has an `enabled` field, so the eventual feature routing rows can use compact switches. Bot connections, destinations, and schedules only expose disable/delete in the current API mapping, so the UI should use status badges plus explicit actions for those records. Alternative considered: switches for every active/inactive entity. That would imply an enable endpoint the current contract does not document.

5. Prefer list/table surfaces over decorative cards for repeated entities.

   Bot connections, destinations, and schedules are operational lists. They should use `AppListToolbar` and `AppListTable` with stable column widths, empty rows using `<Empty>`, and `AlertDialog` for destructive actions. Inner cards are reserved for small status/readiness panels or focused forms, not for wrapping the whole page.

6. Keep temporary data explicit and removable.

   If the implementation needs review data, keep it in local UI fixtures with names that make the no-API boundary obvious. The later API integration change should be able to delete fixtures and replace them with server-loaded data without redesigning the page.

## Risks / Trade-offs

- UI-only controls can look live -> Mitigate with disabled states, clear empty states, and no success toast for backend mutations.
- A single page can become dense -> Mitigate with compact readiness summary, section anchors or tabs if needed, and list surfaces with clear hierarchy.
- Mock rows can drift from backend DTOs -> Mitigate by shaping fixtures from `docs/api_mapping.json` field names and deleting them during API integration.
- Permissions can be unclear before API integration -> Mitigate with local Telegram permission constants based on `x-signapse-auth`, but do not add Telegram endpoint calls.
- Future API integration may alter fields -> Mitigate by keeping component boundaries aligned with backend concepts: bot connections, destinations, feature settings, schedules.
